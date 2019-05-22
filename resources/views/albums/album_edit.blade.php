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

  <figure itemtype="http://schema.org/ImageObject" class="photo-grid-item">
    <a href="#" class="image_edit_trigger" id="{{ $image->id }}" data-size="{{ $image->web_dimensions }}">
      <img class="photo-grid-image" src="{{ $image->thumb_file_url }}" width="420px" itemprop="thumbnail" />
    </a>
  </figure>

@endforeach

</div>




<!-- Modal -->
<div class="modal fade" id="image_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">

      <div class="modal-body">

        <div class="modal-image"></div>
        <div class="modal-image-data">
          <form id="image_data_form">
            <input id="image_id" name="image_id" value="" />
            <label for="image_name">Name</label>
            <input id="image_name" name="image_name" value=""/>
            <label for="image_description">Description</label>
            <input id="image_description" name="image_description" value=""/>
          </form>
        </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger pull-left" >Delete Image</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="image_save" type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>


@endsection

@include('partials.photoswipe_dom')

@section('specific_foot')
<script src="{{ asset('js/page_includes/album_edit.js') }}"></script>
@endsection
