<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use DB;

class PhotoDisplayController extends Controller
{

    public function getPhotos($album_title = null, $slug = null) {

    // No Album Specified
    if(is_null($album_title)){

        $album = DB::table('albums')->join('images', function($join){
                $join->on('albums.id', '=', 'images.album_id');
            })->get()->groupBy('album_id')->all();

            if(!isset($album[1][0]->base_uri)){
                //Instantiates an error object to pass to the page if no results returned from database
                $album = array();
                $album[1] = new \stdClass();
                $album[1]->title = '500: No photos!';
            }

            return view('photos_all', ['album' => $album]);

    // Album specified, but no photo slug
    } else {

        if(is_null($slug)){

            // Pull photos from specified album
            $album = DB::table('albums')->join('images', function($join){
                $join->on('albums.id', '=', 'images.album_id');
            })->where('albums.title', $album_title)->get();

            if(empty($album[0]->base_uri)){
                //Instantiates an error object to pass to the page if no results returned from database
                $album = array();
                $album[0] = new \stdClass();
                $album[0]->title = '404: Album not found!';
            }

            return view('photo_album', ['album' => $album]);

        // Album and photo both specified
        } else {

            // Pull photos from specified album
            $photo = DB::table('albums')->join('images', function($join){
                $join->on('albums.id', '=', 'images.album_id');
            })->where('albums.title', $album_title)->where('images.slug', $slug)->get();

            if(empty($photo[0]->base_uri)){
                //Instantiates an error object to pass to the page if no results returned from database
                $photo = array();
                $photo[0] = new \stdClass();
                $photo[0]->photo_name = '404: Photo not found!';
            }

            return view('photo', ['photo' => $photo]);

            }
        }
    }
}
