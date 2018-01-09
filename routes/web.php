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

// Blog-related routes
Route::prefix('blog')->group(function () {
  Route::resource('posts', 'PostController', ['except'=>['index', 'tagPostIndex']]);
  Route::get('tag/{tag_id}', 'PostController@tagPostIndex');
  Route::get('tags', 'PostController@listTags');
  Route::get('/', 'PostController@index')->name('posts.index');
});

// Image-related routes
Route::resource('images', 'ImageController');
Route::post('images/temp_store', 'ImageController@temp_store');
Route::get('images/temp_delete/{folder}/{mode?}/{filename?}', 'ImageController@temp_delete');


//Album-related routes
Route::resource('albums', 'AlbumController');


Route::get('photos/{album_title?}/{slug?}', 'PhotoDisplayController@getPhotos');
Route::get('imagerequest/{tag?}/{collection?}', 'ImagePullController@pullApiImages');
Route::get('gallery/{album_title?}', 'GalleryController@pullGallery');


/*----------------------------------------------------------------------------*/

/**********************
* USER RELATED ROUTES *
***********************/

//Everything in Admin namespace
Route::namespace('Admin')->group(function(){
  Route::get('admin/dashboard', 'AdminController@index')->name('admin_dash');
  //Redirects /admin to admin dashboard
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
