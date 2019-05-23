@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading"><h4>User Info</h4></div>

                <div class="panel-body">

                  <form action="/user" method="POST" id="user-form">

                  <div class="form-group" id="basic_info">

                    <label for="firstname">First Name</label>
                    <input type="text" name="firstname" id="firstname" class="form-control" value="{{ $user->firstname }}">

                    <label for="lastname">Last Name</label>
                    <input type="text" name="lastname" id="lastname" class="form-control" value="{{ $user->lastname }}">

                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" class="form-control" value="{{ $user->email }}">

                    <label for="phone">Phone</label>
                    <input type="text" name="phone" id="phone" class="form-control" value="{{ $user->phone }}">

                    <br>

                    <input type="checkbox" name="email_notifications" id="email_notifications" value="{{ $user->email_notifications }}">
                    <label for="email_notifications">Email Notifications</label>

                    &nbsp;&nbsp;&nbsp;

                    <input type="checkbox" name="text_notifications" id="text_notifications" value="{{ $user->text_notifications }}">
                    <label for="text_notifications">Text Notifications</label>

                  </div>

                  <div class="form-group" id="billing_address">
                    <hr>
                    <h4>Billing Information</h4>

                    <label for="userinfo[billing_street]">Billing Address 1</label>
                    <input type="text" name="userinfo[billing_street]" id="billing_street" class="form-control" value="{{ $user->billing_street }}">

                    <label for="userinfo[billing_street2]">Billing Address 2</label>
                    <input type="text" name="userinfo[billing_street2]" id="billing_street2" class="form-control" value="{{ $user->billing_street2 }}">

                    {{ Form::label('userinfo[billing_city]', 'Billing City') }}
                    {{ Form::text('userinfo[billing_city]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[billing_state]', 'Billing State') }}
                    {{ Form::text('userinfo[billing_state]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[billing_zip]', 'Billing Zip') }}
                    {{ Form::text('userinfo[billing_zip]', null, ['class' => 'form-control']) }}

                    <br>

                    {!! Form::checkbox('same_ship_bill', null, $user->userinfo['same_ship_bill'], ['id'=>'same_ship_bill']) !!}
                    {{ Form::label('same_ship_bill', 'Shipping Address same as Billing') }}

                  </div>

                  <div class="form-group" id="shipping_address">
                    <hr>
                    <h4>Shipping Information</h4>
                    {{ Form::label('userinfo[shipping_street]', 'Shipping Address 1') }}
                    {{ Form::text('userinfo[shipping_street]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[shipping_street2]', 'Shipping Address 2') }}
                    {{ Form::text('userinfo[shipping_street2]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[shipping_city]', 'Shipping City') }}
                    {{ Form::text('userinfo[shipping_city]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[shipping_state]', 'Shipping State') }}
                    {{ Form::text('userinfo[shipping_state]', null, ['class' => 'form-control']) }}

                    {{ Form::label('userinfo[shipping_zip]', 'Shipping Zip') }}
                    {{ Form::text('userinfo[shipping_zip]', null, ['class' => 'form-control']) }}

                  </div>

                  <div class="form-group">
                    {!! Form::submit('Update', ['id' => 'submit-btn','class' => 'btn btn-primary form-control']) !!}
                  </div>


                  </form>

                  @if ($errors->any())
                      <div class="alert alert-danger">
                          <ul>
                              @foreach ($errors->all() as $error)
                                  <li>{{ $error }}</li>
                              @endforeach
                          </ul>
                      </div>
                  @endif
                  
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
