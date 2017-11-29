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

Route::get('photos/{album_title?}/{slug?}', 'PhotoDisplayController@getPhotos');
Route::get('imagerequest/{tag?}/{collection?}', 'ImagePullController@pullApiImages');
Route::get('gallery/{album_title?}', 'GalleryController@pullGallery');
Route::get('posts', 'PostController@index')->name('posts');
Route::get('post/{id}', 'PostController@show')->name('post');
/*----------------------------------------------------------------------------*/

/**********************
* USER RELATED ROUTES *
***********************/

Route::middleware(['auth'])->group(function () {

  //Everything in Admin namespace
  Route::namespace('Admin')->group(function(){
    Route::get('admin/dashboard', 'AdminController@index')->name('admin_dash');
    //Redirects /admin to admin dashboard
    Route::get('admin', function(){
      return redirect()->route('admin_dash');
    });

    /*Route::get('admin/edit', function(){
      return redirect()->route('user');
    });*/

  });

  //Post resource group (with auth)
  Route::resource('posts', 'PostController',
    ['except' => ['index', 'show']
      //,'names' => ['create' => 'post_create']
    ]
  );
  /*Route::get('posts', 'PostController@index')->name('posts');
  Route::get('post/{id}', 'PostController@show')->name('post');
  Route::get('post/create', 'PostController@create')->name('post_new');
  Route::post('post/create', 'PostController@store')->name('post_create');
  Route::get('post/edit/{id}', 'PostController@edit')->name('post_edit');
  Route::post('post/update/{id}', 'PostController@update')->name('post_edit');
  Route::post('post/delete/{id}', 'PostController@destroy')->name('post_delete'); */

});

Route::get('user','UserInfoController@edit')->middleware('auth')->name('user');



Route::post('user','UserInfoController@update');
/*----------------------------------------------------------------------------*/

/**********************
*    UNUSED ROUTES    *
***********************/
/*Route::middleware(['auth'])->group(function () {
    Route::get('user/{id?}','UserInfoController@show')->name('UserInfo');
});*/
//Route::get('admin/edit', 'UserInfoController@edit')->middleware('auth')->name('admin_edit');
//Route::post('admin','UserInfoController@update');
//Route::get('user/{id?}','UserInfoController@show')->name('UserInfo')->middleware('auth');
