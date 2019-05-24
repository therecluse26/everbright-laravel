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
     * Display an album listing.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (\Auth::user() && \Auth::user()->isAdmin()){
            $albums = \App\Album::all();
        } else {
            $albums = \App\Album::where('active', 1)->get();
        }


        return view('albums/album_index', ['albums'=>$albums]);
    }

    /**
     * Show the form for creating a new album.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $users = \App\User::all();

        $categories_all = \App\Category::all();

        $categories = [];

        foreach ($categories_all as $cat) {
            $categories[$cat['id']] = ucfirst($cat['name']);
        }

        return view('albums/album_create', ['categories'=>$categories, 'users'=>$users]);
    }

    /**
     * Store a newly created album and attach images
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $resp_array = [];

        try {
            $form_data = json_decode($request->get('formData'));

            $album = new \App\Album;

            //Assign form data entries to variables
            foreach ($form_data as $entry) {
                if ($entry->name == 'images' || $entry->name == 'temp_folder') {
                    ${$entry->name} = $entry->value;
                } elseif ($entry->name == 'active'){
                    if ($entry->value == 'on'){
                        $val = 1;
                    } else {
                        $val = 0;
                    }
                    $album->{$entry->name} = $val;
                } else {
                    $album->{$entry->name} = $entry->value;
                }
            }

            $album->slug = str_slug($album->slug, '-');

            unset($album->_token, $album->tags);

            if (!isset($album->title, $album->slug) || $album->title == '' || $album->slug == '') {
                throw new \Exception("Title and slug are required");
            }

            //Pass $images array to image_massStore method on ImageController
            if (!isset($images)) {
                throw new \Exception("Images missing");
            }

            $url_folder = "albums/$album->slug";

            //Stores album
            $album->save();

            $img_control = new ImageController;
            $img_control->massStore($images, $temp_folder, $album->slug, $url_folder, $album->id);

            $resp_array['status'] = 'success';
            $resp_array['msg'] = 'Album created successfully!';
            $resp_array['slug'] = $album->slug;

            return $resp_array;
        } catch (\Exception $ex) {
            $resp_array['status'] = 'error';
            $resp_array['msg'] = $ex->getMessage();

            return $resp_array;
        } catch (\Illuminate\Database\QueryException $e) {
            $resp_array['status'] = 'error';

            if ($e->getCode() === '23000') {
                $resp_array['msg'] = 'Duplicate Album Title or URL Slug';
            } else {
                $resp_array['msg'] = 'Error: ' . $e->getMessage();
            }

            return $resp_array;
        }
    }

    /**
     * Display the specified album.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $album = Cache::rememberForever('album_'.$slug, function () use ($slug) {
            return Album::pullBySlug($slug);
        });

        return view('albums/album_show', [ 'album' => $album, 'cacheparam' => uniqid() ]);
    }

    /**
     * Show the form for editing the specified album.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($slug)
    {
        $album = Album::pullBySlug($slug);

        return view('albums/album_edit', ['album'=>$album, 'cacheparam' => uniqid()]);
    }

    /**
     * Update the specified album in storage.
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
     * Remove the specified album from storage.
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
