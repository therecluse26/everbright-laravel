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

                  {!! Form::open(['route' => 'albums.store', 'id' => 'album-create-form']) !!}

                  <div class="form-group" id="basic_info">

                    {{ Form::label('title', 'Album Title') }}
                    {{ Form::text('title', null, ['class' => 'form-control input-lg', 'style' => 'font-size:2.5rem;font-weight:bold;']) }}

                    {{ Form::label('slug', 'URL Slug') }}
                    <div class="input-group">
                      <div class="input-group-addon">{{ URL::to('/albums') . '/' }}</div>
                      {{ Form::text('slug', null, ['class' => 'form-control']) }}
                    </div>

                    <br>

                    {{ Form::label('tags', 'Tags') }}
                    {{ Form::text('tags', null, ['class' => 'form-control', 'autocomplete' => 'off']) }}

                    {{ Form::hidden('temp_folder', null, ['id' => 'temp_folder', 'class' => 'form-control', 'autocomplete' => 'off']) }}

                    <br><br>

                    {!! Form::checkbox('active[]', null, null, ['id'=>'active']) !!}
                    {{ Form::label('active', 'Album Active') }}

                    <h4>Images</h4>
                      <div id="image-upload" class="dz-container dropzone">
                        <div class="dz-message" data-dz-message><span>Drop image files here</span></div>
                      </div>

                  </div>

                  <br>

                  <div class="form-group">
                     {!! Form::submit('Create Album', ['id' => 'submit-btn','class' => 'btn btn-primary form-control']) !!}
                  </div>

                  {!! Form::close() !!}

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
  <link href="{{ asset('js/bootstrap-tagsinput/dist/bootstrap-tagsinput.css') }}" rel="stylesheet"></link>
  <script src="{{ asset('js/bootstrap-tagsinput/lib/bootstrap3-typeahead.min.js') }}"></script>
@endsection
