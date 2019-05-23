@extends('layouts.app')

@section('specific_head')
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects.css')}}" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects-advanced.css')}}" rel="stylesheet" type="text/css">
<link href="{{URL::asset('css/hover-effects-advanced-styles.css')}}" rel="stylesheet" type="text/css">

@endsection

  @section('content')

      <div class="container-fluid">

        <div class="text-center">
          <img src="{{URL::asset('storage/photos/site_images/TandemLogoWeb.png')}}" style="width:60%;height:auto;" />
        </div>

      </div>


@endsection
