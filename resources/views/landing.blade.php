@extends('layouts.app')

@section('specific_head')
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects.css')}}" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects-advanced.css')}}" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects-advanced-styles.css')}}" rel="stylesheet" type="text/css">

<!-- Styles -->
<style>

  html, body {
    height: 100%;
    margin: 0;
  }

  .table-center {
    display: table;
    min-height:100%;
    min-width:100%;
    display:flex;
    position:relative;
  }

  .middle {
    display: table-cell;
    vertical-align: middle;
    float:none;
  }

  .landing-left-pane {
    min-height:100%;
    min-width: 50%;
    max-width: 50%;
  }

  .landing-right-pane {
    min-height:100%;
    min-width: 50%;
    max-width: 50%;
  }

  .landing-full-pane {
    min-height:100%;
    min-width:100%;
    background-color:#fff;
    display:flex;
    align-items:stretch;
    position:relative;
  }

  .centercontent {
    margin-top: 50%;
    background: inherit;
    background-clip: text;
    color: transparent;
    filter: invert(1) grayscale(0) contrast(3) drop-shadow(0 3px 1px black);
    pointer-events: none;
  }

  .center-logo {
    position:static;
    min-height: 12em;
    vertical-align: middle;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .div-link {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    text-align: center;
  }

  #div-link-right {
    background-image: url("{{URL::asset('storage/photos/site_images/Photo3.jpg')}}");
  }

  #div-link-left {
    background-image: url("{{URL::asset('storage/photos/site_images/Photo1.jpg')}}");
  }

</style>

@endsection

  @section('content')

      <div class="container landing-full-pane">

        <div>
          <img class="center-logo" width="35%" src="{{URL::asset('storage/photos/site_images/TandemLogoNew.png')}}" />
        </div>

      </div>


@endsection
