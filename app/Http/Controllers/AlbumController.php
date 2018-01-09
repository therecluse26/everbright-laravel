<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AlbumController extends Controller
{

    public function __construct()
    {
      //Implements auth middleware
      $this->middleware('auth', ['except' => [
        'index',
        'show'
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
      ob_start();
      var_dump($request);
      $string = ob_get_clean();
      error_log($string);
      
      return "blah";

      $resp_array = [];

      try {
        //Store post to database
        $album = new \App\Album;

        $album->title = $request->title;
        $album->slug = $request->slug;
        $album->active = (int)$request->active;

        //Stores new post (must be done before attaching tags to retrieve post id)
        $album->save();

        /*//Attaches tags to new post
        $tags = explode(',', $request->get('tags'));
        $newtag_array = [];

        foreach($tags as $tag){
          $newtag = \App\Tag::firstOrCreate(['tag' => $tag]);
          array_push($newtag_array, ['post_id'=>$album->id, 'tag_id'=>$newtag->id]);
        }

        $album->tags()->sync($newtag_array); */

        $resp_array['status'] = 'success';
        $resp_array['msg'] = 'Album created successfully!';
        $resp_array['id'] = $album->id;

        return $resp_array;
        //return redirect()->route('posts.edit', ['id' => $id, 'r' => $resp_encrypted]);

      } catch (Exception $ex) {

        $resp_array['status'] = 'error';
        $resp_array['msg'] = $ex->getMessage();

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
    public function show($id)
    {
        //
        return 'AlbumController@show';

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
        return 'AlbumController@edit';

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
