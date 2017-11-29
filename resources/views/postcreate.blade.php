@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>New Post</h4></div>

                <div class="panel-body">

                  {!! Form::model($user, ['url' => 'user', 'id' => 'user-form']) !!}

                  <div class="form-group" id="basic_info">

                    {{ Form::label('title', 'Post Title') }}
                    {{ Form::text('title', null, ['class' => 'form-control']) }}

                    {{ Form::label('category', 'Category') }}
                    {{ Form::select('category', $categories, null, ['class' => 'form-control custom-select']) }}

                  </div>

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

<script>
$(document).ready(function(){
  $('#user-form').submit(function(e){

    e.preventDefault();

    var formData = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "post",
      data: formData,
      success: function(result){
        if (result.status === 'success') {

          console.log(result);

          $('#alert-msg').html('<div class="alert alert-success alert-dismissable">\
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');
        } else {

          console.log(result);

          $('#alert-msg').html('<div class="alert alert-danger alert-dismissable">\
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ result.msg +'</div>');
        }
      }
    })

  });
})
</script>
@endsection
