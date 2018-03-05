@extends('layouts.app')

@section('specific_head')
  <script src="{{ asset('js/masonry/masonry.pkgd.min.js') }}"></script>
  <script src="{{ asset('js/imagesloaded/imagesloaded.pkgd.min.js') }}"></script>
@endsection

@section('content')

<div class="container">

  <div class="row col-md-12 text-center">

      <h2>{{ $album->title }}</h2>
      <small>{{ date('m-d-Y', strtotime($album->created_at)) }}</small>

      <!-- Initialize Masonry grid -->
      <div class="grid">

      @foreach ($album->images as $image)

        <div class="grid-item">
          <a href="{{ $image->original_file_url . '?img_type=web&c=' . $cacheparam }}">
            <img src="{{ $image->original_file_url . '?img_type=thumb' }}" width="390" />
          </a>
        </div>

      @endforeach

      </div>

  </div>

</div>

@endsection

@section('specific_foot')
<script type="text/javascript">

var $container = $('.grid');

$container.imagesLoaded( function() {
     $container.masonry({
       itemSelector: '.grid-item'
     });
});

/*$(document).ready(function(){

  $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
    columnWidth: 400
  });
})*/
</script>
@endsection
