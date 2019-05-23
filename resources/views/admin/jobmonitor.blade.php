@extends('layouts.app')

@section('content')

<script type="text/javascript" src="{{ URL::asset('js/page_includes/job_monitor.js') }}"></script>

<div class="container">
    <h2 class="text-center">Queued Jobs</h2>

    <div id="status-container" class="text-center">
        
    </div>
</div>
@endsection