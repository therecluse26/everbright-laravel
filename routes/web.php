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

Route::prefix('blog')->group(function () {
  Route::resource('posts', 'PostController', ['except'=>'index']);
  Route::get('/', 'PostController@index')->name('posts.index');
});

Route::get('photos/{album_title?}/{slug?}', 'PhotoDisplayController@getPhotos');
Route::get('imagerequest/{tag?}/{collection?}', 'ImagePullController@pullApiImages');
Route::get('gallery/{album_title?}', 'GalleryController@pullGallery');

Route::resource('/image', 'ImageController');


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
Route::get('user','UserInfoController@edit')->middleware('auth')->name('user');

Route::post('user','UserInfoController@update');



/*----------------------------------------------------------------------------*/

/**********************
*    UNUSED ROUTES    *
***********************/
