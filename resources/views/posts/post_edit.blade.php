@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>Edit Post</h4></div>

                <div class="panel-body">

                  @isset($response['msg'])

                    <div class="alert alert-success alert-dismissable">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>{{ $response['msg'] }}</div>

                  @endisset

                  {!! Form::model($post, ['route' => ['posts.update', $post->id], 'id' => 'post-edit-form']) !!}

                  <div class="form-group" id="basic_info">

                    {{ Form::label('title', 'Post Title') }}
                    {{ Form::text('title', null, ['class' => 'form-control input-lg', 'style' => 'font-size:2.5rem;font-weight:bold;']) }}

                    {{ Form::label('slug', 'Post URL Slug') }}
                    {{ Form::text('slug', null, ['class' => 'form-control']) }}

                    {{ Form::label('category', 'Category') }}
                    {{ Form::select('category', $categories, $post->cat_id, ['class' => 'form-control custom-select']) }}

                    <br>

                    {{ Form::label('tags', 'Tags') }}
                    {{ Form::text('tags', $tags, ['class' => 'form-control', 'autocomplete' => 'off']) }}

                    <br><br>

                    {!! Form::checkbox('published', $post->published, null, ['id'=>'published'], $post->published) !!}
                    {{ Form::label('published', 'Published') }}

                  </div>

                    {{ Form::label('post-body', 'Post Content') }}
                    <br>
                    {{ Form::textarea('post-body', $post->post_body, ['id' => 'post-body']) }}

                  <br>

                  <div class="form-group">
                     {!! Form::submit('Update', ['id' => 'submit-btn','class' => 'btn btn-primary form-control']) !!}
                  </div>

                  {!! Form::close() !!}

                  <div id="alert-msg"></div>

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
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet"></link>
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

    //Automatic slug creation
    $('#title').on('change keyup keypress',function(t){
      var slugval = slugify(t.target.value);
      $('#slug').val(slugval);
    });
    $('#slug').on('change keyup keypress',function(t){
      var slugval = slugify(t.target.value);
      $('#slug').val(slugval);
    });

    // Submit post form for update
    $('#post-edit-form').submit(function(e){

      e.preventDefault();
      var formData = $(this).serialize();
      $.ajax({
        type: "PUT",
        url: this.action,
        data: formData,
        success: function(result){
          if (result.status === 'success') {

            $('#alert-msg').html('<div class="alert alert-success alert-dismissable">\
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');

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
