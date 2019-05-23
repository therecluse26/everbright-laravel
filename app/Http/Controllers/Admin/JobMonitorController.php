<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use romanzipp\QueueMonitor\Models\Monitor;

use Illuminate\Http\Request;

class JobMonitorController extends Controller
{
    /**
     * Show the status of all jobs
     */
    public function show()
    {
        return view('admin/jobmonitor');
    }

    /**
     * Pulls list of running jobs and returns JSON response
     */
    public function monitor()
    {
        $jobs = Monitor::ordered()->get();

        foreach ($jobs as $job) {
            if (!is_null($job->finished_at)){
                Monitor::destroy($job->id);
            };
        }

        return $jobs;
    }
}
