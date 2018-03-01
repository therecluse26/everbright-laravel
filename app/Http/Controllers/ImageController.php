<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Isolesen\Pel;
use Ramsey\Uuid\Uuid;


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

      try {

        $temp_dir = 'temp/' . $request->input('temp_folder');

        /* if(!File::exists($temp_dir)) {
          File::makeDirectory($temp_dir, 0775);
        } */

        $image = $request->image;

        $ext = $image->guessClientExtension();

        //$new_filename = md5(uniqid().mt_rand(1,1000000)).'_'.time() . '.' . $ext;

        $uuid = Uuid::uuid4();
        $new_filename = $uuid->toString() . '.' . $ext;

        $image->storeAs( $temp_dir . '/', $new_filename );

        return $new_filename;

      } catch (Exception $e) {

        return $e->getMessage();
      }

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
    public function store($img_data, $temp_folder, $album_slug, $album_id)
    {
      try {

        /*error_log($temp_folder);
        error_log($img_data->file_name);
        error_log($album_slug);*/

        $image = new Image;
        $image->id = $img_data->photo_id;
        $image->album_id = $album_id;
        $image->original_file = $img_data->file_name;
        $image->image_name = $img_data->title;
        $image->image_description = $img_data->description;

        $temp_file = "temp/$temp_folder/$img_data->file_name";
        $new_folder = "private_albums/$album_slug";
        $new_file_path = "$new_folder/$img_data->file_name";
        $remote_file_path = "$album_slug/$img_data->file_name";

        $image->original_file_path = $new_file_path;

        if (!Storage::move($temp_file, $new_file_path) ){
          throw new Exception($temp_file);
        }

        $image->save();

        return $remote_file_path;

      } catch (Exception $e) {

        return $e->getMessage();
      }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function mass_store($images, $temp_folder, $album_slug, $url_folder, $album_id)
    {
      try {

        foreach($images as $image){
          //Invoke Image store method here
          $folder = $this->store($image, $temp_folder, $album_slug, $album_id);
        }

        //Push Images to B2
        $b2 = new RemoteFileHandler;
        $b2->mass_store($folder, $url_folder);

        //error_log(print_r($files, true));

        return true;

      } catch (Exception $e) {

        return $e->getMessage();
      }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Image  $image
     * @return \Illuminate\Http\Response
     */
    public function show(Image $image)
    {
      return $image;
      //return view('image_show', ['image'=>$image]);
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
