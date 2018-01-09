<script src="{{ asset('js/jquery-3.2.1.min.js')}}"></script>

<!-- Styles -->
<link href="{{ asset('css/app.css') }}" rel="stylesheet">

@if( in_array( \Request::route()->getName(), ['albums.create', 'albums.edit'] ) )

  <script src="{{ asset('js/uploader/dropzone.js')}}"></script>
  <script type="text/javascript">// Immediately after the js include
    Dropzone.autoDiscover = false;
  </script>
  <link href="{{ asset('css/dropzone.css') }}" rel="stylesheet">
@endif
