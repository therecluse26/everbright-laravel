@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">

              <h2>{{ $album->title }}</h2>
              <small>{{ date('m-d-Y', strtotime($album->created_at)) }}</small>

        </div>
    </div>
</div>

@endsection
