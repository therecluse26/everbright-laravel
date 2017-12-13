@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading"><h3>Dashboard</h3></div>

                <div class="panel-body">

                  <ul id="admin-controls">
                    <h4>Blog</h4>
                    <li>
                      <a href="{{ route('posts.index') }}">Show Posts</a>
                    </li>
                    <li>
                      <a href="{{ route('posts.create') }}">New Post</a>
                    </li>
                    <br>
                    <h4>Photo Management</h4>
                    <li>
                      <a href="{{ route('posts.index') }}">Create Album</a>
                    </li>
                    <li>
                      <a href="{{ route('posts.create') }}">Add Photos</a>
                    </li>
                    <li>
                      <a href="{{ route('posts.create') }}">Manage Tags & Categories</a>
                    </li>

                  </ul>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection
