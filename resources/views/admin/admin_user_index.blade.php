@extends('layouts.app')

@section('content')

<div class="container">
    <div class="col-sm-12">
        <div class="panel panel-default">

            <div class="panel-heading"><h4>User Info</h4></div>

            <div class="panel-body">

              <table class="table">

                <thead>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                </thead>

                <tbody>
                <form id="user_edit">
                  @foreach ($users as $user)
                    <tr>
                      <td>
                        {{ $user->firstname }}
                      </td>
                      <td>
                        {{ $user->lastname }}
                      </td>
                      <td>
                        {{ $user->email }}
                      </td>

                      <td>
                        @foreach ( $user->roles as $role )
                        <a id="{{ 'roles_' . $user->id }}" href="#roles?id={{ $user->id }}">{{ $role->name }}</a> <br>
                        @endforeach
                      </td>

                      @if ( $user->id != \Auth::user()->id )
                      <td class="text-right">
                        <button id="{{ 'delete_' .$user->id }}" class="btn btn-danger">Delete</button>
                      </td>
                      @endif

                    </tr>
                  @endforeach
                </form>
              </tbody>
              </table>




              <div id="alert-msg"></div>


@include ('partials.roles_modal')


<div class="clearfix"></div>

            </div>
        </div>
    </div>
</div>


<script>
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
