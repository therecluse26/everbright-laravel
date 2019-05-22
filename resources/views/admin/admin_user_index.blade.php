@extends('layouts.app')

@section('specific_head')
<style type="text/css">
.table > tbody > tr > td {
     vertical-align: middle;
}
.subject-info-box-1,
.subject-info-box-2 {
  float: left;
  width: 45%;
}
.subject-info-box-1 select,
.subject-info-box-2 select {
  height: 200px;
  padding: 0;
}
.subject-info-box-1 select option,
.subject-info-box-2 select option {
  padding: 12px 10px 10px 10px;
}
.subject-info-box-1 select option:hover,
.subject-info-box-2 select option:hover {
  background: #EEEEEE;
}
.subject-info-arrows {
  padding-top: 60px;
  float: left;
  width: 10%;
}
.subject-info-arrows input {
  width: 70%;
  margin-bottom: 5px;
}
</style>
@endsection

@section('content')

<div class="container">
    <div class="col-sm-12">
        <div class="panel panel-default">

            <div class="panel-heading text-center"><h4>Edit Users</h4></div>

            <div class="panel-body">

              <table class="table">

                <thead>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th></th>
                </thead>

                <tbody>

                <form id="user_edit">

                  @foreach ($users as $user)

                    <tr id="{{ 'usertr_' . $user->id }}">
                      <td>
                        {{ $user->firstname }}
                      </td>
                      <td>
                        {{ $user->lastname }}
                      </td>
                      <td>
                        {{ $user->email }}
                      </td>

                      <td id="{{ 'rolestd_' . $user->id }}">
                        @foreach ( $user->roles as $role )
                        <a href="#" id="{{ 'roles_' . $user->id }}" >{{ $role->name }}</a> <br>
                        @endforeach
                      </td>

                      <td class="text-right">
                      @if ( $user->id != \Auth::user()->id )
                        <button class="deleteUserBtn btn btn-danger" data-user="{{ $user->id }}" >Delete</button>
                      @endif
                      </td>

                    </tr>

                  @endforeach

                </form>
              </tbody>
              </table>


              <div id="alert-msg"></div>

              @include ('partials.roles_modal')


            </div>
        </div>
    </div>
</div>



<script>
function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

function userRolesList(id) {

  var return_val = null;

  $.ajax({
    type: "GET",
    url: "users/"+id+"/roles",
    async: false,
    success: function(role_array){

      return_val = role_array;

    }
  });

  return return_val;

}

$(document).ready(function(){

  var roles = {!! $roles !!};

  $('body').on('click', "a[id^='roles_']", function(){

    $('#rolesButton').click();

    var id = this.id.split('_')[1];

    var role_array = userRolesList(id);

    $('#roles-selected').empty();
    $('#roles-available').empty();
    $('#user_id').val(id);

    $.each(role_array['user_roles'], function(key, value){
      $('#roles-selected').append("<option value='"+value.id+"'>"+value.name+"</option>");
    });

    $.each(role_array['diff_roles'], function(key, value){
      $('#roles-available').append("<option value='"+value.id+"'>"+value.name+"</option>");
    })

  });


  $('.deleteUserBtn').click(function(){

    if ( confirm("Are you sure you want to delete this user?") === true) {
      var userid = this.dataset.user;
      $.ajax({
        type: "DELETE",
        url: "users",
        data: { id: userid, _token: '{{ csrf_token() }}' },
        success: function(response){


          if (response.status == 'success'){

            $('#usertr_' + userid).fadeOut('fast', function(){
              $('#usertr_' + userid).remove();
            });

          } else {

            alert(response.status);

          }

        }
      });

    }

  });


  $('#saveRoles').click(function(){

    var sendData = new FormData();
    var formData = [];
    var new_roles = [];

    var id = $('#user_id').val();
    $('#roles-selected > option').each(function(){
      var value = $(this).val();
      var name = $(this).text()
      new_roles.push({"role_id": value, "role_name": name});
    });

    formData.push(toObject(new_roles));
    formJson = JSON.stringify(formData);
    sendData.append("_token", $('[name=_token').val());
    sendData.append('formData', formJson);
    sendData.append('userId', id);

    $.ajax({
      type: "POST",
      url: "users/"+id+"/roles",
      processData: false,
      contentType: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      data: sendData,
      success: function(response){

        $('#rolesModal').modal('toggle');

        $("#rolestd_" + id).empty();

        $.each(response[0], function(key, value){
          $('#rolestd_' + id).append('<a href="#" id="roles_'+id+'">'+value.role_name+'</a><br>');
        });

      }
    });
  });

});

//Role assignment box button logic
(function () {
    $('#btnRight').click(function (e) {
        var selectedOpts = $('#roles-available option:selected');
        if (selectedOpts.length == 0) {
            alert("Nothing to move.");
            e.preventDefault();
        }
        $('#roles-selected').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
    $('#btnAllRight').click(function (e) {
        var selectedOpts = $('#roles-available option');
        if (selectedOpts.length == 0) {
            alert("Nothing to move.");
            e.preventDefault();
        }
        $('#roles-selected').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
    $('#btnLeft').click(function (e) {
        var selectedOpts = $('#roles-selected option:selected');
        if (selectedOpts.length == 0) {
            alert("Nothing to move.");
            e.preventDefault();
        }
        $('#roles-available').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
    $('#btnAllLeft').click(function (e) {
        var selectedOpts = $('#roles-selected option');
        if (selectedOpts.length == 0) {
            alert("Nothing to move.");
            e.preventDefault();
        }
        $('#roles-available').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
}(jQuery));
</script>
@endsection
