@extends('layouts.app')

@section('content')

<div class="container">
  <div class="row">
    <div class="col-md-8 col-md-offset-2">
      <div class="panel panel-default">

        <div class="panel-heading">
          <h4>User Info</h4>
        </div>

        <div class="panel-body">
          <form id="user-form">

            <div class="form-group" id="basic_info">

              <div class="form-group" id="basic_info">

                <label for="firstname">First Name</label>
                <input type="text" name="firstname" id="firstname" class="form-control" value="{{ $user->firstname }}">

                <label for="lastname">Last Name</label>
                <input type="text" name="lastname" id="lastname" class="form-control" value="{{ $user->lastname }}">

                <label for="email">Email</label>
                <input type="text" name="email" id="email" class="form-control" value="{{ $user->email }}">

                <label for="phone">Phone</label>
                <input type="text" name="phone" id="phone" class="form-control" value="{{ $user->phone }}">

              </div>

              @if ( $user->isAuthor() )

              <div class="form-group">

                <h4>Author Info</h4>

                <label for="author[photo_url]">Photo Url</label>
                <input type="text" name="author[photo_url]" id="author_photo" class="form-control" value="{{ $user->author->photo_url }}">

                <label for="author[bio]">Bio</label>
                <textarea type="text" name="author[bio]" id="author_bio" class="form-control">{{ $user->author->bio }}</textarea>

              </div>

              @endif

              <div class="form-group">

                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <input type="submit" value="Update" id="submit-btn" class="btn btn-primary form-control">

              </div>

          </form>
          <div id="alert-msg"></div>

        </div>
      </div>
    </div>
  </div>
</div>
<script>
  var sameship = <?php echo (bool)$user->userinfo->same_ship_bill ? 1 : 0; ?>;

  if (sameship == 1) {
    $('#shipping_address').hide();
  }

  $(document).ready(function () {

    $('#user-form').submit(function (e) {

      e.preventDefault();

      var formData = $(this).serialize();

      $.ajax({
        type: "POST",
        url: "/user",
        data: formData,
        success: function (result) {
          if (result.status === 'success') {

            console.log(result);

            $('#alert-msg').html('<div class="alert alert-success alert-dismissable">\
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + result.msg + '</div>');
          } else {

            console.log(result);

            $('#alert-msg').html('<div class="alert alert-danger alert-dismissable">\
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + result.msg + '</div>');
          }
        }
      })

    });

    $('#same_ship_bill').change(function () {
      if ($(this).prop('checked') == true) {
        $('#shipping_address').hide();
      } else {
        $('#shipping_address').show();
        $("input[name*='shipping_']").val('');

      }
    });
  })
</script>
@endsection