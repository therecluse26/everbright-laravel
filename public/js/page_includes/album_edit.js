var $imagegrid = $('.photo-grid').masonry({
  itemSelector: '.photo-grid-image',
  gutter: 5,
  fitWidth: true
});

$imagegrid.imagesLoaded().progress( function() {
  $imagegrid.masonry();
});

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(".image_edit_trigger").on("click", function () {

    var imgid = this.id;

    $.ajax({
      type: "GET",
      url: "/images/" + imgid,
      datatype: "json",
      success: function(result){

        var imgdata = JSON.parse(result);

        $('#image_id').val(imgdata.id);
        $('#image_name').val(imgdata.image_name);
        $('#image_description').val(imgdata.image_description);

        //$(".modal-body").html(result);

        $('#image_modal').modal({
            show: 'true'
        });


      }
    });

    $('#image_save').on('click', function(){

      var image_updated_data = null;
      image_updated_data = $('#image_data_form').serialize();

      console.log(image_updated_data);

      $.ajax({
        type: "PUT",
        url: "/images/" + imgid,
        data: image_updated_data,
        success: function(result){

          if (result == 'success'){
            $('#image_modal').modal({
                show: 'false'
            });
          }

        }
      });

    });


     //var myBookId = $(this).data('id');
     //$(".modal-body #bookId").val( myBookId );
     // As pointed out in comments,
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
});
