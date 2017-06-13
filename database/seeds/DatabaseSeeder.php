<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        DB::table('albums')->insert(
            [
                [
                        'id'=>'1',
                        'title'=>'Honeymoon',
                ],
                [
                        'id'=>'2',
                        'title'=>'Test',
                ]
            ]
        );
        
        DB::table('images')->insert(
            [
                [
                    'id'=>'1',
                    'album_id'=>'1',
                    'slug'=>'chair_kiss',
                    'photo_name'=>'Chair Kiss',
                    'base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/', 
                    'file_uri'=>'v1493298371/ChairKiss_scaled.jpg',
                    'thumb_uri'=>'v1493298117/ChairKiss_thumb.jpg',
                    'tags'=>'kiss',
                    'cover_image'=>'0'
                ],
                [
                    'id'=>'2',
                    'album_id'=>'1',
                    'slug'=>'lighthouse',
                    'photo_name'=>'Lighthouse',
                    'base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/', 
                    'file_uri'=>'v1493298630/Lighthouse_scaled.jpg',
                    'thumb_uri'=>'v1493298707/Lighthouse_thumb.jpg',
                    'tags'=>'people;landscape',
                    'cover_image'=>'1'
                ],            
                [
                    'id'=>'3',
                    'album_id'=>'2',
                    'slug'=>'peacock',
                    'photo_name'=>'Peacock',
                    'base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/', 
                    'file_uri'=>'v1493298478/Peacock_scaled.jpg',
                    'thumb_uri'=>'v1493298535/Peacock_thumb.jpg',
                    'tags'=>'animals',
                    'cover_image'=>'0'
                ]
            ]
        );
    }
}
