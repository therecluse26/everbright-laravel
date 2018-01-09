<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Isolesen\Pel;

class ImageController extends Controller
{

    public function __construct()
    {
      //Implements auth middleware
      $this->middleware('auth', ['except' => [
        'index',
        'show'
      ]]);
    }


    public function image_checksum(Image $image){

      // string Imagick::getImageSignature ( void )

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        /*$image_mgr = new ImageManager;
        $img = $image_mgr->make('storage/photos/site_images/Photo1.jpg')->resize(300, 200);
        return $img->response('jpg');*/

        $img1_checksum = md5_file('storage/photos/site_images/Photo1.jpg');
        $img2_checksum = md5_file('storage/photos/site_images/Photo1.jpg');

        return $img1_checksum . '<br>' . $img2_checksum;

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $albums_all = \App\Album::all();

        $albums = [];

        foreach($albums_all as $alb){

          $albums[$alb['id']] = ucfirst($alb['title']);

        }

        return view('image_create', ['albums'=>$albums]);
    }

    /**
     * Temporary storage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function temp_store(Request $request)
    {

      $temp_dir = 'temp/' . $request->input('temp_folder');

      if(!File::exists($temp_dir)) {
        File::makeDirectory($temp_dir, 0775, true);
      }

      $image = $request->image;

      $ext = $image->guessClientExtension();

      $new_filename = uniqid() . '.' . $ext;

      $image->storeAs( $temp_dir . '/', $new_filename);

      return $new_filename;

    }

    /**
     * Delete resource from temporary storage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function temp_delete($folder, $mode = 'single', $filename = null)
    {
      try {

        $folder_path = storage_path().'/app/temp/' . $folder;

        $path = $folder_path . '/' . $filename;

        if ($mode == 'single'){

          $resp = File::delete($path);

          if( sizeof(Storage::files('temp/'.$folder)) == 0 ){

            File::deleteDirectory($folder_path);

          };

        } elseif ($mode == 'all') {

          $resp = File::deleteDirectory($folder_path);

        }

        echo $resp;

      } catch (Exception $e){

        echo $e->getMessage();

      };



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
        return $request;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function show(Image $image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function destroy(Image $image)
    {
        //
    }
}
