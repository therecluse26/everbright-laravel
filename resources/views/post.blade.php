@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">

              <h2>{{ $post->title }}</h2>
              <small>{{ date('m-d-Y', strtotime($post->created_at)) }}</small>
              <hr>
              {!! $post->post_body !!}
              <br>
              <hr>

              <div class="business-card">
                  <div class="media">
                      <div class="media-left">
                          <img class="media-object img-circle profile-img" src="{{ $post->author->photo_url }}" width='150px'>
                      </div>
                      <div class="media-body">
                          <h4 class="media-heading">{{ $post->author->firstname . ' ' .  $post->author->lastname }}</h4>
                          <div class="bio">{{ $post->author->bio }}</div>
                          <div class="mail"><a href="mailto:{{ $post->author->email }}">{{ $post->author->email }}</a> </div>
                      </div>
                  </div>
              </div>


        </div>
    </div>
</div>

@endsection
