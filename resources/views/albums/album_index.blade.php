@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">

        <h2>Albums</h2>
        <hr>
          @forelse ($albums as $album)
            <h3 style="margin-bottom:-3px;">
              <a href="{{ '/albums/'. $album->slug }}">{{ $album->title }}</a>

              <!-- Edit buttons if user is admin -->
              @if(\Auth::user()->isAdmin())
                @if($album->active == 1)
                  <small>(public)</small>
                @endif
                - <small><a href="{{ '/albums/'.$album->slug.'/edit' }}"> Edit</a></small>
              @endif

            </h3>
            <br>
            <hr>
          @empty
            <p>No photo albums :(</p>
          @endforelse

        </div>
    </div>
</div>

@endsection
