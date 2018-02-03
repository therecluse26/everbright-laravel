<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mhetreramesh\Flysystem\BackblazeAdapter;
use League\Flysystem\Filesystem;
use ChrisWhite\B2\Client;


class RemoteFileHandler extends Controller
{
    protected $filesystem;

    public function __construct(){
      $accountId = env('B2_ACCOUNT_ID', '');
      $applicationKey = env('B2_APPLICATION_KEY', '');
      $client = new Client($accountId, $applicationKey);
      $adapter = new BackblazeAdapter($client, env('B2_BUCKET_NAME', ''));
      $filesystem = new Filesystem($adapter);
      $this->flysystem = $filesystem;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        //$this->flysystem->createDir('test1');
        //$this->flysystem->put('test1/test.txt', 'test123');

        //return $this->flysystem->listContents();

        // Set the content type header - in this case image/jpeg

       return \Storage::disk('b2')->get('11164838_10153000733263557_299277979517595318_n.jpg');

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return $this->flysystem->read($id);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
