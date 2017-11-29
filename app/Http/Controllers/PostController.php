<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use App\Author;

class PostController extends Controller
{

    public static function pullAuthor(){

      $user_id = \Auth::user()->id;
      $author = Author::where('user_id', $user_id)->first();

      //Removes admin section from array if user is not admin (security measure)
      if ( $author['admin']['active'] !== 1 ) {
        unset($author['admin']);
      }

      return $author;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return "PostController@index";
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
      $author = PostController::pullAuthor();
      $categories_all = \App\Category::all();

      $categories = [];

      foreach($categories_all as $cat){

        $categories[$cat['id']] = ucfirst($cat['name']);

      }

      return view('postcreate', ['user'=>$author, 'categories'=>$categories]);

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
        return "PostController@store";
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        //
        return "PostController@show";
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        //
        return "PostController@edit";
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        //
        return "PostController@update";
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        //
        return "PostController@destroy";
    }
}
