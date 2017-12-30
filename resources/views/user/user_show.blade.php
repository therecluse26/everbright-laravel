@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading"><h4>User Info</h4></div>

                <div class="panel-body">

                  <h2>{{ $user->firstname . ' ' . $user->lastname }}</h2>

                  <a href="mailto:{{ $user->email }}">{{ $user->email }}</a>

                  <br><br>

                  <p>{{ $user->author->bio }}</p>

            </div>
        </div>
    </div>
</div>
@endsection
