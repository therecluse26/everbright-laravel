@extends('layouts.app')

@section('specific_head')
  <script src="{{ asset('js/masonry/masonry.pkgd.min.js') }}"></script>
  <script src="{{ asset('js/imagesloaded/imagesloaded.pkgd.min.js') }}"></script>
  <script src="{{ asset('js/photoswipe/photoswipe.min.js') }}"></script>
  <script src="{{ asset('js/photoswipe/photoswipe-ui-default.min.js') }}"></script>
  <link rel="stylesheet" href="{{ asset('js/photoswipe/default-skin/default-skin.css') }}">
  <link rel="stylesheet" href="{{ asset('js/photoswipe/photoswipe.css') }}">
  <style type="text/css">
  .photo-grid {
    margin: 0 auto; /* this is the css that keeps the container centered in page */
  }
  .photo-grid-image {
    width: 380px;
    /* vertical gutter */
    margin-bottom: 5px;
  }
  </style>
  <meta name="csrf-token" content="{{ csrf_token() }}">

@endsection

@section('content')

<div class="container-fluid">
  <div class="row col-md-12 text-center">
    <h2>{{ $album->title }}</h2>
    <small>{{ date('m-d-Y', strtotime($album->created_at)) }}</small>
  </div>
</div>

<!-- Initialize Masonry grid -->
<div class="photo-grid" itemscope itemtype="http://schema.org/ImageGallery">

@foreach ($album->images as $image)
  <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" class="photo-grid-item">
    <a href="{{ $image->web_file_url . '&c=' . $cacheparam }}" itemprop="contentUrl" data-size="{{ $image->web_dimensions }}">
      <img class="photo-grid-image" src="{{ $image->thumb_file_url }}" width="420px" itemprop="thumbnail" />
    </a>
    <!--<figcaption itemprop="caption description">{{ $image->image_description }}</figcaption> -->
  </figure>
@endforeach

</div>

@endsection

@include('partials.photoswipe_dom')

@section('specific_foot')
<script src="{{ asset('js/page_includes/album_show.js') }}"></script>
@endsection
