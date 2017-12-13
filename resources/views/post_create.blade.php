@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>New Post</h4></div>

                <div class="panel-body">

                  {!! Form::open(['route' => 'posts.store', 'id' => 'post-create-form']) !!}

                  <div class="form-group" id="basic_info">

                    {{ Form::label('title', 'Post Title') }}
                    {{ Form::text('title', null, ['class' => 'form-control input-lg', 'style' => 'font-size:2.5rem;font-weight:bold;']) }}

                    {{ Form::label('slug', 'URL Slug') }}
                    <div class="input-group">
                      <div class="input-group-addon">{{ URL::to('/blog/posts') . '/' }}</div>
                      {{ Form::text('slug', null, ['class' => 'form-control']) }}
                    </div>


                    {{ Form::label('category', 'Category') }}
                    {{ Form::select('category', $categories, null, ['class' => 'form-control custom-select']) }}

                    {!! Form::checkbox('published[]', null, null, ['id'=>'published']) !!}
                    {{ Form::label('published', 'Published') }}


                  </div>


                    {{ Form::label('post-body', 'Post Content') }}
                    <br>
                    {{ Form::textarea('post-body', null , ['id' => 'post-body']) }}

                  <br>

                  <div class="form-group">
                     {!! Form::submit('Create Post', ['id' => 'submit-btn','class' => 'btn btn-primary form-control']) !!}
                  </div>

                  {!! Form::close() !!}

                  <div id="alert-msg"></div>

                  <div id="formdivhidden"></div>

                </div>
            </div>
        </div>
    </div>
</div>

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

  $('#post-create-form').submit(function(e){

    e.preventDefault();

    var formData = $(this).serialize();

    //console.log(this.action);

    $.ajax({
      type: "POST",
      url: this.action,//"post/create",
      data: formData,
      success: function(result){

        if (result.status === 'success') {

          //$('#alert-msg').html('<div class="alert alert-success alert-dismissable">\<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');

          var return_data = JSON.stringify(result);

          console.log(return_data);

          //Pushes
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
