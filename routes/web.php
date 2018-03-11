<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();

/**********************
* GENERAL SITE ROUTES *
***********************/
Route::get('/', function () {
    return view('landing');
});

Route::get('about', function () {
    return view('about');
});

Route::get('/testtest', function(){

  echo \App\Http\Controllers\Image\ImageTransformController::generateBlurThumb('albums/blur-test-7/11f6bdeb-bdf5-4501-9111-1b123ab3a998.JPG');

});


// Blog-related routes
Route::prefix('blog')->group(function () {
  Route::resource('posts', 'PostController', ['except'=>['index', 'tagPostIndex']]);
  Route::get('tag/{tag_id}', 'PostController@tagPostIndex');
  Route::get('tags', 'PostController@listTags');
  Route::get('/', 'PostController@index')->name('posts.index');
});

// Image-related routes
Route::resource('images', 'Image\ImageController');
Route::post('images/temp_store', 'Image\ImageController@temp_store');
Route::get('images/temp_delete/{folder}/{mode?}/{filename?}', 'Image\ImageController@temp_delete');


//Album-related routes
Route::resource('albums', 'Album\AlbumController', ['except'=>['show', 'edit']]);
Route::get('albums/{slug}', 'Album\AlbumController@show');
Route::get('albums/{slug}/edit', 'Album\AlbumController@edit');
Route::get('albums/{slug}/images/{image_id}', 'Image\ImageLoadController@showAlbumImage');


Route::get('photos/{album_title?}/{slug?}', 'PhotoDisplayController@getPhotos');
Route::get('imagerequest/{tag?}/{collection?}', 'ImagePullController@pullApiImages');
Route::get('gallery/{album_title?}', 'GalleryController@pullGallery');

//Router::get('files/{params?}', 'RemoteFileHandler@show')->where('params');
Route::resource('files', 'RemoteFileHandler');


/*----------------------------------------------------------------------------*/

/**********************
* USER RELATED ROUTES *
***********************/

//Everything in Admin namespace
Route::namespace('Admin')->group(function(){
  Route::get('admin/dashboard', 'AdminController@index')->name('admin_dash');
  //Redirects /admin to admin dashboard
  Route::get('admin/users', 'AdminController@userIndex');
  Route::get('admin', function(){
    return redirect()->route('admin_dash');
  });
});

//User Routes
Route::get('user/edit','UserInfoController@edit')->middleware('auth')->name('user');
Route::get('user/{id}','UserInfoController@show');
Route::post('user','UserInfoController@update');


/*----------------------------------------------------------------------------*/

/**********************
*    UNUSED ROUTES    *
***********************/

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
