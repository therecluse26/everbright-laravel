<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Mhetreramesh\Flysystem\BackblazeAdapter;
use League\Flysystem\Config;
use League\Flysystem\Filesystem;
use ChrisWhite\B2\Client;
use ChrisWhite\B2\Bucket;

class RemoteFileHandler extends Controller
{
    protected $filesystem;

    public function __construct(){
      $accountId = env('B2_ACCOUNT_ID', '');
      $applicationKey = env('B2_APPLICATION_KEY', '');
      $this->public_bucket_id = env('B2_PUBLIC_BUCKET_ID', '');
      $this->public_bucket_name = env('B2_PUBLIC_BUCKET_NAME', '');
      $this->private_bucket_id = env('B2_PRIVATE_BUCKET_ID', '');
      $this->private_bucket_name = env('B2_PRIVATE_BUCKET_NAME', '');
      $this->client = new Client($accountId, $applicationKey);
      //$bucket = new Bucket();
      //$adapter = new BackblazeAdapter($client, env('B2_BUCKET_NAME', ''));
      /*$filesystem = new Filesystem($adapter, new Config([
          'disable_asserts' => true,
      ]));
      $filesystem->addPlugin(new \League\Flysystem\Plugin\GetWithMetadata());
      $this->flysystem = $filesystem;*/
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

      return "RemoteFileHandler@index";

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
    public function store($file_name, $file_path)
    {

      /*try {

          $file = $this->client->upload([
            'BucketName' => $this->public_bucket_name,
            'FileName' => $file_name,
            'Body' => fopen(Storage::get($file_path), 'r')
          ]);

        return $this->show($file_name);

      } catch (Exception $e) {

        return $e->getMessage();
      }*/
    }

   /**
    * Mass stores images to remote location (B2)
    *
    * @param $file_path
    * @return \Illuminate\Http\Response
    */
    public function massStore($file_path)
    {
      try {

        $return_array = [];

        error_log('$file_path: ' . $file_path);

        foreach (Storage::files($file_path) as $filename){

          error_log($filename);

          $this->client->upload([
            'BucketName' => $this->public_bucket_name,
            'FileName' => $filename,
            'Body' => fopen(Storage::get($filename), 'r')
          ]);

            sleep(0.1);
        }

        //foreach($files as $file){  }

        //error_log(print_r($return_array, true));

        return true;

      } catch (Exception $e) {

        error_log($e->getMessage());
        return $e->getMessage();
      }
    }

    /**
     * Display file remote URL.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show_url($file_name)
    {

      $file_name = str_replace('+', '/', $file_name);

      $file = $this->client->getFile([
          'BucketName' => $this->public_bucket_name,
          'FileName' => $file_name
      ]);

      $bucketInfo = $this->client;

      $rp = new \ReflectionProperty('ChrisWhite\B2\Client', 'downloadUrl');

      $rp->setAccessible(true);

      $base_url = $rp->getValue($bucketInfo);

      $file_url = $base_url . "/file/$this->public_bucket_name/" . $file->getName();

      return $file_url;

    }

    /**
     * Display file
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($file_name)
    {

      return $file_name;

    }


    public static function show_public($id){

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
