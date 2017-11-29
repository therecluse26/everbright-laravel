<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Tandem</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
        <link href="{{URL::asset('css/hover-effects.css')}}" rel="stylesheet" type="text/css">
        <link href="{{URL::asset('css/hover-effects-advanced.css')}}" rel="stylesheet" type="text/css">
        <link href="{{URL::asset('css/hover-effects-advanced-styles.css')}}" rel="stylesheet" type="text/css">

        <script src="{{URL::asset('js/jquery-3.2.1.min.js')}}"></script>
        <script src="{{URL::asset('js/Vague.js/Vague.min.js')}}"></script>

        <script>
        /*$(document).ready(function(){
            $("a").hover(function(){

              $(this).addClass('hover08-focused');

            }, function(){

              $(this).removeClass('hover08-focused');

            });
        }) */
        /*
        $(document).ready(function(){
          var right = $('#div-link-right').Vague({
          	intensity:      10,      // Blur Intensity
          	forceSVGUrl:    false,   // Force absolute path to the SVG filter,
          	// default animation options
              animationOptions: {
                duration: 4000,
                easing: 'linear' // here you can use also custom jQuery easing functions
              }
          });

          var left = $('#div-link-left').Vague({
          	intensity:      10,      // Blur Intensity
          	forceSVGUrl:    false,   // Force absolute path to the SVG filter,
          	// default animation options
              animationOptions: {
                duration: 4000,
                easing: 'linear' // here you can use also custom jQuery easing functions
              }
          });

          $("a").hover(function(){

            if ($(this).attr('id') == 'div-link-right'){
              right.blur();
            } else {
              left.blur();
            }
            //$(this).addClass('blur');

          }, function(){
            //$(this).removeClass('blur');
            if ($(this).attr('id') == 'div-link-right'){
              right.unblur();
            } else {
              left.unblur();
            }

          });

        }); */
        </script>

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
            background-color:grey;
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
            z-index: 9;
            position: absolute;
            margin: auto;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 3px;
            pointer-events: none;
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
            background-image: url("{{URL::asset('storage/Photo3.jpg')}}");

          }

          #div-link-left {
            background-image: url("{{URL::asset('storage/Photo1.jpg')}}");

          }

        </style>

    </head>
    <body>
      <div class="container landing-full-pane">

        <div>
          <img class="center-logo" width="35%" src="{{URL::asset('storage/TandemLogoSolo.png')}}" />
        </div>

        <div class="row table-center">

          <a href="#left" class="div-link landing-left-pane">
              <figure class="effect-honey" id="div-link-left">
                    <figcaption>
                      <h2> <span></span> <i>Photography</i></h2>
                    </figcaption>
              </figure>
            </a>

            <a href="#right" class="div-link landing-right-pane">
              <!--<div class="col-md-6 col-sm-6 middle pull-right landing-right-pane">
              </div> -->
              <figure class="effect-honey" id="div-link-right">
                    <figcaption>
                      <h2> <span></span> <i>Design</i></h2>
                    </figcaption>
              </figure>
            </a>

        </div>

      </div>
    </body>
</html>
