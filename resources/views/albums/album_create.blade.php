@extends('layouts.app')

@section('specific_head')

<script src="{{ asset('js/uploader/dropzone.js')}}"></script>
<script type="text/javascript">// Immediately after the js include
  Dropzone.autoDiscover = false;
</script>
<link href="{{ asset('css/dropzone.css') }}" rel="stylesheet">

@endsection

@section('content')

<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-default">

                <div class="panel-heading"><h4>New Album</h4></div>

                <div class="panel-body">

                  <form action="/albums" method="POST" id="album-create-form">

                    <div class="form-group" id="basic_info">

                      <label for="title">Album Title</label>
                      <input type="text" name="title" id="title" class="form-control input-lg" style="font-size:2.5rem;font-weight:bold;">

                      <label for="slug">Slug</label>
                      <div class="input-group">
                        <div class="input-group-addon">{{ URL::to('/albums') . '/' }}</div>
                        <input type="text" name="slug" id="slug" class="form-control">
                      </div>

                      <br>

                      <label for="tags">Tags</label>
                      <input type="text" name="tags" id="tags" class="form-control" autocomplete="off">

                      <input type="hidden" name="temp_folder" id="temp_folder" class="form-control" autocomplete="off">

                      <br><br>

                      <input type="checkbox" name="active[]" id="active">
                      <label for="active">Album Active</label>

                      <h4>Images</h4>
                        <div id="image-upload" class="dz-container dropzone">
                          <div class="dz-message" data-dz-message><span>Drop image files here</span></div>
                        </div>

                    </div>

                    <br>

                    <div class="form-group">
                      <input type="submit" value="Create Album" id="submit-btn" class="btn btn-primary form-control">

                    </div>

                  </form>

                  <div id="alert-msg"></div>

                  <div id="formdivhidden"></div>

                </div>
            </div>
        </div>
    </div>
</div>

@include('partials/dropzone_preview')
  <script type="text/javascript" src="{{ URL::asset('js/page_includes/album_create.js') }}"></script>
@endsection

@section('specific_foot')
  <!-- For post/image tag functionality -->
  <script src="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js') }}"></script>
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet">
  <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>
@endsection
