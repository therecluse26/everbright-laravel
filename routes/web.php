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

Route::get('/', function () {
    return view('welcome', [
        'message' => 'Yo, yo!',
        'testarray' => [
            'test1' => 'Test 1',
            'test2' => 'Test 2',
            'test3' => 'Test 3'
        ]
    ]);
});

Route::get('/about', function () {
    return view('about');
});

Route::get('/photos/{album_title?}/{slug?}', 'PhotoDisplayController@getPhotos');

Route::get('/imagerequest/{collection?}/{tag?}', 'ImagePullController@pullApiImages');
