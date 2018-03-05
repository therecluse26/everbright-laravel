<?php

namespace App\Http\Controllers;

use App\Image;
use App\Events\ImageUploaded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Isolesen\Pel;
use Ramsey\Uuid\Uuid;
use App\Jobs\GenerateThumbnail;
use App\Jobs\GenerateWebImage;

class ImageController extends Controller
{

    public function __construct()
    {
      //Implements auth middleware
      $this->middleware('auth', ['except' => [
        'index',
        'show'
      ]]);

      $this->image_storage_schema = config('file_handling.albums.image_storage_schema');
      $this->image_url_schema = config('file_handling.albums.image_url_schema');
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

        //error_log($request->input('temp_folder'));

        $temp_dir = 'temp/' . $request->input('temp_folder');

        /*if(!File::exists($temp_dir)) {
          File::makeDirectory($temp_dir, 0775);
        }*/

        $image = $request->image;

        $ext = $image->getClientOriginalExtension();

        //$new_filename = md5(uniqid().mt_rand(1,1000000)).'_'.time() . '.' . $ext;

        $uuid = Uuid::uuid4();

        $new_filename = $uuid->toString() . '.' . $ext;

        //error_log($temp_dir . '/' . $new_filename);

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
        $image = new Image;
        $image->id = $img_data->photo_id;
        $image->album_id = $album_id;
        $image->original_file = $img_data->file_name;
        $image->image_name = $img_data->title;
        $image->image_description = $img_data->description;
        $image->watermark_position = $img_data->watermark;

        $temp_file = "temp/$temp_folder/$img_data->file_name";

        $image_meta = [];
        $image_meta['album_slug'] = $album_slug;
        $image_meta['image_id'] = $img_data->photo_id;
        $image_meta['new_original_file_path'] = "private_albums/$album_slug/$img_data->file_name";
        $image_meta['remote_original_file_path'] = "$album_slug/$img_data->file_name";
        $image_file_info = pathinfo($image_meta['new_original_file_path']);
        $image_meta['extension'] = $image_file_info['extension'];
        $image_meta['thumb_file_name'] = $image_file_info['filename'].'_thumb.'.$image_file_info['extension'];
        $image_meta['web_file_name'] = $image_file_info['filename'].'_web.'.$image_file_info['extension'];
        $image_meta['parent_dir'] = $image_file_info['dirname'];
        $image_meta['thumb_dir'] = $image_meta['parent_dir'].'/thumbs/';
        $image_meta['web_dir'] = $image_meta['parent_dir'].'/web/';

        //Constructs image URL
        $image->original_file_url = str_replace("{{image}}", $img_data->photo_id, str_replace("{{album}}", $album_slug, $this->image_url_schema));
        //$image->thumb_file_url = str_replace("{{image}}", $img_data->photo_id . "_thumb", str_replace("{{album}}", $album_slug, $this->image_url_schema));

        if (!Storage::move($temp_file, $image_meta['new_original_file_path']) ){
          throw new Exception($temp_file);
        }

        $image->save();

        // Dispatches gobs for thumbnail and web version generation and uploading
        dispatch(new GenerateThumbnail($image_meta));
        dispatch(new GenerateWebImage($image_meta));
        //dispatch(new RemoteStoreImage($image_meta));

        return "true";

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

        $folder = $album_slug;

        foreach($images as $image){
          //Invoke Image store method here
          $this->store($image, $temp_folder, $album_slug, $album_id);
        }

        //error_log('$folder: ' . $folder);
        //error_log('$url_folder: ' . $url_folder);


        //Create thumbnails and web versions


        //Push Images to B2
        //$b2 = new RemoteFileHandler;
        //$b2->mass_store($folder, $url_folder);

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
