<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Cache-control" content="public">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name') }}</title>

    @include('includes.common_head')

    @yield('specific_head')

</head>
<body>
  <div id="app">

    @include('layouts.nav')

    @yield('content')

  </div>

  @include('includes.common_foot')

  @yield('specific_foot')

</body>
</html>
