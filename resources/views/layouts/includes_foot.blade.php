<!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>

@if( in_array( \Request::route()->getName(), ['posts.create', 'posts.edit'] ) )
  <!-- Post Edit Specific Libraries -->

  <!-- Wysiwyg editor -->
  <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>

  <!-- For post/image tag functionality -->
  <script src="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js') }}"></script>
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet"></link>
  <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>


  <script>
    tinymce.init({
      selector: '#post-body'
    });
  </script>

@elseif( in_array( \Request::route()->getName(), ['albums.create', 'albums.edit'] ) )

  <!-- For post/image tag functionality -->
  <script src="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js') }}"></script>
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet"></link>
  <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>
  
@endif
