@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>User Info</h4></div>

                <div class="panel-body">

                  {!! Form::model($user, ['url' => 'user', 'id' => 'user-form']) !!}

                  <div class="form-group" id="basic_info">
                    {{ Form::label('firstname', 'First Name') }}
                    {{ Form::text('firstname', null, ['class' => 'form-control']) }}

                    {{ Form::label('lastname', 'Last Name') }}
                    {{ Form::text('lastname', null, ['class' => 'form-control']) }}

                    {{ Form::label('email', 'Email') }}
                    {{ Form::text('email', null, ['class' => 'form-control']) }}

                    {{ Form::label('phone', 'Phone') }}
                    {{ Form::text('phone', null, ['class' => 'form-control']) }}


                    </div>

                  @if ( $user->isAuthor() )

                    <div class="form-group">

                    <h4>Author Info</h4>

                    {{ Form::label('author[photo_url]', 'Photo Url') }}
                    {{ Form::text('author[photo_url]', null, ['class' => 'form-control']) }}

                    {{ Form::label('author[bio]', 'Bio') }}
                    {{ Form::textarea('author[bio]', null, ['class' => 'form-control']) }}

                    </div>

                  @endif

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
var sameship = <?php echo (bool)$user->userinfo->same_ship_bill ? 1 : 0; ?>;

if ( sameship == 1 ) {
  $('#shipping_address').hide();
}

$(document).ready(function(){

  $('#user-form').submit(function(e){

    e.preventDefault();

    var formData = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "user",
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

  $('#same_ship_bill').change(function(){
    if( $(this).prop('checked') == true ){
      $('#shipping_address').hide();
    } else {
      $('#shipping_address').show();
      $("input[name*='shipping_']").val('');

    }
  });
})

</script>
@endsection
