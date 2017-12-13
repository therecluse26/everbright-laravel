<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use App\Author;

class PostController extends Controller
{

    public function __construct()
    {
      //Implements auth middleware
      $this->middleware('auth', ['except' => [
        'index',
        'show'
      ]]);
    }

    public static function pullLoggedInAuthor(){

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
      $posts = \App\Post::select('id', 'title', 'created_at', 'author_id')->where('published', '=', '1')->orderBy('created_at', 'desc')->paginate(10);
      $categories_all = \App\Category::all();
      $categories = [];
      foreach($categories_all as $cat){
        $categories[$cat['id']] = ucfirst($cat['name']);
      }

      return view('post_index', ['categories'=>$categories, 'posts'=>$posts]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
      $author = PostController::pullLoggedInAuthor();
      $categories_all = \App\Category::all();


      $categories = [];

      foreach($categories_all as $cat){

        $categories[$cat['id']] = ucfirst($cat['name']);

      }

      return view('post_create', ['categories'=>$categories, 'user'=>$author]);

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
        $author = PostController::pullLoggedInAuthor();
        $post = new Post;

        $post->title = $request['title'];
        $post->slug = $request['slug'];
        $post->cat_id = $request['category'];
        $post->author_id = $author->id;
        $post->published = (int)$request['published'];
        $post->post_body = $request['post-body'];

        $post->save();

        $resp_array['status'] = 'success';
        $resp_array['msg'] = 'Post created successfully!';
        $resp_array['id'] = $post->id;

        return $resp_array;
        //return redirect()->route('posts.edit', ['id' => $id, 'r' => $resp_encrypted]);

      } catch (\Illuminate\Database\QueryException $e) {

        $resp_array['status'] = 'error';

        if($e->getCode() === '23000') {

          $resp_array['msg'] = 'Duplicate Post Title or URL Slug';

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
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        //Show post
        $author = $post->load('author');
        $post->author->email = \App\User::select('email')->where('id', $author->user_id)->first();

        //return $author;

        return view('post', ['post'=>$post]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post, Request $request)
    {
        //
        $author = PostController::pullLoggedInAuthor();
        $categories_all = \App\Category::all();
        $categories = [];
        $response = $request->input('r');

        if(!is_null($response)){
          $response = (array)json_decode(base64_decode($response));
        }

        foreach($categories_all as $cat){

          $categories[$cat['id']] = ucfirst($cat['name']);

        }

        return view('post_edit', ['categories'=>$categories, 'author'=>$author, 'post'=>$post, 'response'=>$response]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)//Post $post)
    {
        try {
          //$post_update->post_body = $post->post_body;
          //$post_update->cat_id = $post->cat_id;

          //return $request->input('published');

          $post = Post::find($id);
          $post->title = $request->get('title');
          $post->slug = $request['slug'];
          $post->cat_id = $request->get('category');
          $post->published = $request->has('published') ? true: false;
          $post->post_body = $request->get('post-body');
          $post->save();

          /*foreach($post as $key => $value) {
            if(!is_array($value) && $key != '_token'){
              $post_update->$key = isset($post[$key]) ? $value : null;
            }
          } */

          $post->save();

          //Returns success
          return array('status'=>'success', 'msg'=>'Post updated successfully');

        } catch (\Exception $e) {
          return array('status'=>'error', 'msg'=>'Error: ' . $e->getMessage());
        }

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
