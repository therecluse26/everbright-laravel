<?php

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
Route::resource('images', 'Image\ImageController');
Route::post('images/temp_store', 'Image\ImageController@tempStore');
Route::get('images/temp_delete/{folder}/{mode?}/{filename?}', 'Image\ImageController@tempDelete');

//Album-related routes
Route::resource('albums', 'Album\AlbumController', ['except'=>['show', 'edit']]);
Route::get('albums', 'Album\AlbumController@index')->name('albums.index');
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
Route::middleware('admin')->namespace('Admin')->group(function () {
    Route::get('admin', function () {
        return redirect()->route('admin_dash');
    });
    Route::get('admin/dashboard', 'AdminController@index')->name('admin_dash');
    Route::get('admin/users', 'UserManagement@userIndex');
    Route::delete('admin/users', 'UserManagement@userDelete');
    Route::get('admin/users/{id}/roles', 'UserManagement@userRolesList');
    Route::post('admin/users/{id}/roles', 'UserManagement@userRolesUpdate');
    Route::get('admin/jobmonitor', 'JobMonitorController@show')->name('job_monitor');
    Route::get('admin/api/jobstatus', 'JobMonitorController@monitor');
});

//User Routes
Route::get('user/edit', 'UserInfoController@edit')->middleware('auth')->name('user');
Route::get('user/{id}', 'UserInfoController@show');
Route::post('user', 'UserInfoController@update');

/*----------------------------------------------------------------------------*/

/**********************
*    UNUSED ROUTES    *
***********************/

Auth::routes();

Route::get('/phpinfo', function () {
    phpinfo();
});
