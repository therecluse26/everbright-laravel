@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">

        <h2>Albums</h2>
        <hr>
          @foreach ($albums as $album)

            <h3 style="margin-bottom:-3px;">
              <a href="{{ '/albums/'. $album->slug }}">{{ $album->title }}</a>

              <!-- Edit buttons if user is admin -->
              @if( (isset(Auth::user()->admin)) && Auth::user()->admin->active == 1)
                - <small><a href="{{ '/albums/'.$album->slug.'/edit' }}"> Edit</a></small>
              @endif

            </h3>

            <br>

            <hr>
          @endforeach


        </div>
    </div>
</div>

@endsection
