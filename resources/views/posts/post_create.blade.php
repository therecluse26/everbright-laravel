@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>New Post</h4></div>

                <div class="panel-body">

                  <form action="/blog/posts" method="POST" id="post-create-form">

                    <div class="form-group" id="basic_info">

                      <label for="title">Post Title</label>
                      <input type="text" name="title" id="title" class="form-control input-lg" style="font-size:2.5rem;font-weight:bold;">

                      <label for="slug">Slug</label>
                      <div class="input-group">
                        <div class="input-group-addon">{{ URL::to('/blog/posts') . '/' }}</div>
                        <input type="text" name="slug" id="slug" class="form-control">
                      </div>

                      <label for="category">Category</label>
                      <select name="category" id="category" class="form-control custom-select">
                        @foreach ($categories as $key => $category)
                          <option value="{{ $key }}">{{ $category }}</option>
                        @endforeach
                      </select>

                      <br>
                    
                      <label for="tags">Tags</label>
                      <input type="text" name="tags" id="tags" class="form-control" autocomplete="off">

                      <br><br>

                      <input type="checkbox" name="published[]" id="published">
                      <label for="published">Published</label>

                    </div>

                      <label for="post-body">Post Content</label>
                      <textarea name="post-body" id="post-body"></textarea>
                      
                      <input name="author_id" value="{{ $author->id }}" hidden readonly>
                      <input type="hidden" name="_token" value="{{ csrf_token() }}">

                    <br>

                    <div class="form-group">
                      <input type="submit" value="Create Post" id="submit-btn" class="btn btn-primary form-control">
                    </div>

                  </form>

                  <div id="alert-msg"></div>

                  <div id="formdivhidden"></div>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('specific_foot')
  <!-- Wysiwyg editor -->
  <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>

  <!-- For post/image tag functionality -->
  <script src="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js') }}"></script>
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet">
  <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>

  <script>
    tinymce.init({
      selector: '#post-body'
    });
  </script>

  <script>
  function slugify(text){
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-and-')         // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }
  </script>
  
  <script>
  $(document).ready(function(){

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
          var taglist = $.get("/blog/tags");
          return taglist;
        }
      }
    })

    //Submit new post for creation
    $('#post-create-form').submit(function(e){
      e.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
        type: "POST",
        url: this.action,//"post/create",
        data: formData,
        success: function(result){

          if (result.status === 'success') {

            var return_data = JSON.stringify(result);
            //Pushes to database
            $('#formdivhidden').html('<form style="display: hidden" action="/blog/posts/'+ result.id +'/edit" method="GET" id="hiddenform">\
                                    <input type="hidden" id="r" name="r" value="'+ btoa(return_data) +'"/>\
                                  </form>');

            $('#hiddenform').submit();

          } else {

            $('#alert-msg').html('<div class="alert alert-danger alert-dismissable">\
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');
          }
        }
      })
    });
  })
  </script>
@endsection
