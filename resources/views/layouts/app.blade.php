<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    @include('layouts.includes_head')

</head>
<body>
  <div id="app">

    @include('layouts.nav')

    @yield('content')

  </div>

  @include('layouts.includes_foot')

</body>
</html>
