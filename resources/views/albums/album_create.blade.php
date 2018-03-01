@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
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
