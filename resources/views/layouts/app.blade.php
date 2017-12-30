<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    <script src="{{ asset('js/jquery-3.2.1.min.js')}}"></script>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">



</head>
<body>
  <div id="app">

    @include('layouts.nav')

    @yield('content')

  </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>

    @if( in_array( \Request::route()->getName(), ['posts.create', 'posts.edit'] ) )
      <!-- Post Edit Specific Libraries -->
      <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>

      <script src="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js') }}"></script>
      <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet"></link>

      <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>


      <script>
        tinymce.init({
          selector: '#post-body'
        });
      </script>

    @endif

</body>
</html>
