<?php

namespace App\Http\Controllers\Album;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Image\ImageController;
use App\Album;
use Illuminate\Http\Request;
use App\Image;
use \Cache;

class AlbumController extends Controller
{

    public function __construct()
    {
      //Implements auth middleware
      $this->middleware('auth', ['except' => [
        'index'
      ]]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return 'AlbumController@index';

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(!$this->authorize('create', Album::class)){

        };

        $categories_all = \App\Category::all();

        $categories = [];

        foreach($categories_all as $cat){

          $categories[$cat['id']] = ucfirst($cat['name']);

        }

        return view('albums/album_create', ['categories'=>$categories]);


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $resp_array = [];

      try {
        //Store post to database

        $form_data = json_decode($request->get('formData'));

        //error_log($request->get('formData'));

        /*$album_title = $form_data[1]->value;
        $album_slug = $form_data[2]->value;
        $album_tags = $form_data[3]->value;
        $album_temp_folder = $form_data[4]->value;
        $album_active = (int)$form_data[5]->value;
        $images = $form_data[5]->images;*/

        $album = new \App\Album;

        //Assign form data entries to variables

        foreach ($form_data as $entry){
          if($entry->name == 'images' || $entry->name == 'temp_folder'){
            ${$entry->name} = $entry->value;
          } else {
            $album->{$entry->name} = $entry->value;
          }
        }

        $album->slug = str_slug($album->slug, '-');

        unset($album->_token, $album->tags);

        if (!isset($album->title, $album->slug) || $album->title == '' || $album->slug == '') {
          throw new \Exception("Title and slug are required");
        }

        //Pass $images array to image_mass_store method on ImageController
        if (!isset($images)){
          throw new \Exception("Images missing");
        }

        $url_folder = "albums/$album->slug";

        //Stores album
        $album->save();

        $img_control = new ImageController;
        $img_control->mass_store($images, $temp_folder, $album->slug, $url_folder, $album->id);


        /*//Attaches tags to new album
        $tags = explode(',', $request->get('tags'));
        $newtag_array = [];
        foreach($tags as $tag){
          $newtag = \App\Tag::firstOrCreate(['tag' => $tag]);
          array_push($newtag_array, ['post_id'=>$album->id, 'tag_id'=>$newtag->id]);
        }

        $album->tags()->sync($newtag_array); */

        $resp_array['status'] = 'success';
        $resp_array['msg'] = 'Album created successfully!';
        $resp_array['slug'] = $album->slug;

        return $resp_array;
        //return redirect()->route('posts.edit', ['id' => $id, 'r' => $resp_encrypted]);

      } catch (\Exception $ex) {

        $resp_array['status'] = 'error';
        $resp_array['msg'] = $ex->getMessage();

        return $resp_array;

      } catch (\Illuminate\Database\QueryException $e) {

        $resp_array['status'] = 'error';

        if($e->getCode() === '23000') {

          $resp_array['msg'] = 'Duplicate Album Title or URL Slug';

        } else {

          $resp_array['msg'] = 'Error: ' . $e->getMessage();

        }

        return $resp_array;
        //return redirect()->route('posts.create', ['r' => $resp_encrypted]);
      }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
      //$album = Album::pullBySlug($slug);

      $album = Cache::rememberForever('album_'.$slug, function() use ($slug) {
        return Album::pullBySlug($slug);
      });

      //return $album;

        return view('albums/album_show', [ 'album' => $album, 'cacheparam' => uniqid() ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($slug)
    {
        //

        $album = Album::pullBySlug($slug);

        return $album;

        /*$album = Album::with(array('images' => function($query)
        {   $query->select('id', 'album_id', 'image_name', 'image_description',
            'original_file', 'created_at');
        }))->select(['id', 'title', 'created_at'])->where('slug', $slug)->first();*/


        return view('albums/album_edit', ['album'=>$album]);

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
        return 'AlbumController@update';

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
        return 'AlbumController@destroy';

    }
}
