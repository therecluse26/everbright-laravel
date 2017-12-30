@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>Upload Images</h4></div>

                <div class="panel-body">

                  {!! Form::open(['route' => 'image.store', 'id' => 'image-create-form']) !!}

                  <div class="form-group" id="basic_info">

                    {{ Form::label('album', 'Album') }}
                    {{ Form::select('album', $albums, null, ['class' => 'form-control custom-select']) }}

                    {{ Form::label('tags', 'Tags') }}
                    {{ Form::text('slug', null, ['class' => 'form-control']) }}

                  </div>


                  <br>

                  <div class="form-group">
                     {!! Form::submit('Upload Image', ['id' => 'submit-btn','class' => 'btn btn-primary form-control']) !!}
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
