//Generic functions used in page
function slugify(text){
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
function guid() {
  return s4() + s4() + s4() + s4() + s4() + s4();
}
function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

//Generates global temporary folder variable
newTempFolder = guid();

$(document).ready(function(){

  $('#temp_folder').val(newTempFolder);

  //Dropzone.js functionality
  allImages = [];
  allImages.temp_folder = newTempFolder;

  var dropzone = new Dropzone('div#image-upload', {
    url: "/images/temp_store",
    previewTemplate: document.querySelector('#preview-template').innerHTML,
    dictDefaultMessage: "Drop image files here",
    dictFallbackMessage: "Unsupported browser",
    parallelUploads: 2,
    thumbnailHeight: 300,
    thumbnailWidth: 300,
    maxFilesize: 20,
    filesizeBase: 1024,
    addRemoveLinks: true,
    paramName: "image",
    acceptedFiles: "image/jpeg,image/jpg,image/png",
    sending: function(file, xhr, formData) {

      formData.append("_token", $('[name=_token').val()); //Appends _token to satisfy Laravel CSRF protection
      formData.append("temp_folder", newTempFolder);

    },
    thumbnail: function(file, dataUrl) {
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (var i = 0; i < images.length; i++) {
          var thumbnailElement = images[i];
          thumbnailElement.alt = file.name;
          thumbnailElement.src = dataUrl;
        }
        setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
      }
    },
    success: function(file, response){

      var photo_id = response.substring(0, response.indexOf('.'));
      file.element_id = allImages.length;
      file.file_name = response;
      file.photo_id = photo_id;

      allImages.push({'file_name': response, 'photo_id': photo_id});

      $(file.previewElement).find('.photo_title').attr('id', photo_id + '_title');
      $(file.previewElement).find('.photo_description').attr('id', photo_id + '_description');
      $(file.previewElement).find('.photo_watermark').attr('id', photo_id + '_watermark');

    },
    removedfile: function(file){

      if (file.file_name != undefined) {
        var del_url = 'images/temp_delete/'+newTempFolder+'/single/'+file.file_name;

        $.ajax({
          type: 'GET',
          url: '/'+del_url,
          success: function(resp) {
            if(resp == 1){
              var index = allImages.indexOf(file.file_name);
              if(index > -1){
                allImages.splice(index, 1);
              }
              var _ref;
              return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            }
          },
          error: function( jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });

      } else {

        var _ref;
        return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;

      }
    }
  });


  $('#title').on('change keyup keypress',function(t){
    var slugval = slugify(t.target.value);
    $('#slug').val(slugval);
  });

  //Tags input and typeahead
  $('#tags').tagsinput({
    cancelConfirmKeysOnEmpty: true,
    autoSelect: false,
    allowDuplicates: false,
    typeahead: {
      afterSelect: function(val) { this.$element.val(""); },
      source: function(query) {
        var taglist = $.get("/image/tags");
        return taglist;
      }
    }
  })

  //Submit new album for creation
  $('#album-create-form').submit(function(e){

    $('.photo_title').each(function(x){
      if(x < allImages.length){
        var photo_id = this.id.substring(0, this.id.indexOf('_'));
        var index = allImages.findIndex(function(res){ return res.photo_id == photo_id });
        allImages[index].title = this.value;
      }
    })

    $('.photo_description').each(function(x){
        if(x < allImages.length){
          var photo_id = this.id.substring(0, this.id.indexOf('_'));
          var index = allImages.findIndex(function(res){ return res.photo_id == photo_id });
          allImages[index].description = this.value;
        }
    })

    $('.photo_watermark').each(function(x){
        if(x < allImages.length){
          var photo_id = this.id.substring(0, this.id.indexOf('_'));
          var index = allImages.findIndex(function(res){ return res.photo_id == photo_id });
          allImages[index].watermark = this.value;
        }
    })

    e.preventDefault();

    var sendData = new FormData();
    var formData = $(this).serializeArray();
    var images = [];

    images.push(toObject(allImages));

    formData.push({"name": "images", "value": toObject(allImages)});

    formBase64 = JSON.stringify(formData);

    sendData.append("_token", $('[name=_token').val());
    sendData.append('formData', formBase64);

    console.log(this.action);

    $.ajax({
      type: "POST",
      url: this.action,
      datatype: "json",
      data: sendData,
      processData: false,
      contentType: false,
      success: function(result){

        if (result.status === 'success') {

          //console.log(result);

          //var return_data = JSON.stringify(result);

          //Pushes to database
          $('#formdivhidden').html('<form style="display: hidden" action="/albums/'+ result.slug +'" method="GET" id="hiddenform">\
                                </form>');

          $('#hiddenform').submit();

        } else {

          $('#alert-msg').html('<div class="alert alert-danger alert-dismissable">\
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {

        $('#alert-msg').html('<div class="alert alert-danger alert-dismissable">\
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ jqXHR.responseText +'</div>');

        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    })
  });
})

//Deletes temporary images from server on page unload
$(window).on('beforeunload unload', function(){
  //Only sends delete temp file request to server if there are remaining images in allImages array
  if (allImages.length > 1) {
    var del_url = 'images/temp_delete/'+newTempFolder+'/all';
    $.ajax({
      type: 'GET',
      url: '/'+del_url,
      success: function(resp) {
        console.log(resp);
      },
      error: function( jqXHR, textStatus, errorThrown ) {
        console.log(errorThrown);
      }
    });
  }
})
