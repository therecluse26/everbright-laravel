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
        'show',
        'listTags',
        'tagPostIndex'
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

    //Attaches tags to a post
    public function attachTags($post, $tags){

      try {

        foreach ($tags as $current_tag) {

          $newtag = App\Tag::firstOrCreate(['tag'=>$current_tag]);

          $post->tags()->attach($newtag);

          return "Successful attach";

        }

      } catch (\Illuminate\Database\QueryException $e) {

        return $e->getMessage();

      }

    }


    public function listTags(){

      //$tags = ["query" => "Unit", "suggestions" => []];

      $tags = \App\Tag::all()->pluck('tag');

      return $tags;

    }

    public function tagPostIndex($tag)
    {

      $tag = urldecode($tag);

      $posts = \App\Post::where('published', '=', '1')->whereHas('tags', function($query) use ($tag) {

          $query->where('tag', '=', $tag);

      })->get();

      $categories_all = \App\Category::all();

      $categories = [];

      foreach($categories_all as $cat){

        $categories[$cat['id']] = ucfirst($cat['name']);

    }

      return view('posts/post_tag_index', ['posts'=>$posts, 'tag'=>$tag]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $posts = \App\Post::published()
          ->select('id', 'title', 'created_at', 'author_id')
          ->descending()
          ->paginate(10);

      $categories_all = \App\Category::all();

      $categories = [];

      foreach($categories_all as $cat){

        $categories[$cat['id']] = ucfirst($cat['name']);

      }

      return view('posts/post_index', ['categories'=>$categories, 'posts'=>$posts]);
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

      return view('posts/post_create', ['categories'=>$categories, 'user'=>$author]);

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

        //Stores new post (must be done before attaching tags to retrieve post id)
        $post->save();

        //Attaches tags to new post
        $tags = explode(',', $request->get('tags'));
        $newtag_array = [];

        foreach($tags as $tag){
          $newtag = \App\Tag::firstOrCreate(['tag' => $tag]);
          array_push($newtag_array, ['post_id'=>$post->id, 'tag_id'=>$newtag->id]);
        }

        $post->tags()->sync($newtag_array);

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

        $tags = $post->tags();

        $post->author->email = \App\User::select('email')->where('id', $author->user_id)->first();

        //return $author;

        return view('posts/post', ['post'=>$post]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post, Request $request)
    {
        $author = PostController::pullLoggedInAuthor();

        $categories_all = \App\Category::all();

        $tags = $post->tags()->pluck('tag');

        $tagstring = "";
        foreach ($tags as $tag){
          $tagstring .= $tag . ',';
        }

        $categories = [];

        $response = $request->input('r');

        if(!is_null($response)){
          $response = (array)json_decode(base64_decode($response));
        }

        foreach($categories_all as $cat){

          $categories[$cat['id']] = ucfirst($cat['name']);

        }

        return view('posts/post_edit', ['categories'=>$categories, 'author'=>$author, 'post'=>$post, 'tags'=>$tagstring, 'response'=>$response]);

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
          $post = Post::find($id);

          $tags = explode(',', $request->get('tags'));
          $newtag_array = [];

          foreach($tags as $tag){
            $newtag = \App\Tag::firstOrCreate(['tag' => $tag]);
            array_push($newtag_array, $newtag->id);
          }

          $post->tags()->sync($newtag_array);

          $post->title = $request->get('title');
          $post->slug = $request['slug'];
          $post->cat_id = $request->get('category');
          $post->published = $request->has('published') ? true: false;
          $post->post_body = $request->get('post-body');

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
