<?php

use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

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
                    'slug'=>'honeymoon',
                    'cover_image'=>'3',
                    'created_at'=>\Carbon\Carbon::now()

                ],
                [
                    'id'=>'2',
                    'title'=>'Test',
                    'slug'=>'test',
                    'cover_image'=>'1',
                    'created_at'=>\Carbon\Carbon::now()
                ]
            ]
        );

        DB::table('images')->insert(
            [
                [
                    'id'=>UUID::uuid4()->toString(),
                    'album_id'=>'1',
                    'image_slug'=>'chair_kiss',
                    'image_name'=>'Chair Kiss',
                    'image_description'=>'Sadie and Brad in chairs near a beautiful lighthouse',
                    'local_base_uri'=> url('/').':8000/storage/photos/albums/',
                    'local_original_uri'=>'honeymoon/large/ChairKiss_scaled.jpg',
                    'local_optimized_uri'=>'honeymoon/large/ChairKiss_scaled.jpg',
                    'local_thumb_uri'=>'honeymoon/thumbs/ChairKiss_thumb.jpg',
                    'cdn_base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/',
                    'cdn_original_uri'=>'v1493298371/ChairKiss_scaled.jpg',
                    'cdn_optimized_uri'=>'v1493298371/ChairKiss_scaled.jpg',
                    'cdn_thumb_uri'=>'v1493298117/ChairKiss_thumb.jpg',
                    'created_at'=>\Carbon\Carbon::now()
                ],
                [
                    'id'=>UUID::uuid4()->toString(),
                    'album_id'=>'1',
                    'image_slug'=>'lighthouse',
                    'image_name'=>'Lighthouse',
                    'image_description'=>'Beautiful lighthouse',
                    'local_base_uri'=> url('/').':8000/storage/photos/albums/',
                    'local_original_uri'=>'honeymoon/large/Lighthouse_scaled.jpg',
                    'local_optimized_uri'=>'honeymoon/large/Lighthouse_scaled.jpg',
                    'local_thumb_uri'=>'honeymoon/thumbs/Lighthouse_thumb.jpg',
                    'cdn_base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/',
                    'cdn_original_uri'=>'v1493298630/Lighthouse_scaled.jpg',
                    'cdn_optimized_uri'=>'v1493298630/Lighthouse_scaled.jpg',
                    'cdn_thumb_uri'=>'v1493298707/Lighthouse_thumb.jpg',
                    'created_at'=>\Carbon\Carbon::now()
                ],
                [
                    'id'=>UUID::uuid4()->toString(),
                    'album_id'=>'2',
                    'image_slug'=>'peacock',
                    'image_name'=>'Peacock',
                    'image_description'=>'Just a peacock',
                    'local_base_uri'=> url('/').':8000/storage/photos/albums/',
                    'local_original_uri'=>'misc/large/Peacock_scaled.jpg',
                    'local_optimized_uri'=>'misc/large/Peacock_scaled.jpg',
                    'local_thumb_uri'=>'misc/thumbs/Peacock_thumb.jpg',
                    'cdn_base_uri'=>'http://res.cloudinary.com/establishmysteps/image/upload/',
                    'cdn_original_uri'=>'v1493298478/Peacock_scaled.jpg',
                    'cdn_optimized_uri'=>'v1493298478/Peacock_scaled.jpg',
                    'cdn_thumb_uri'=>'v1493298535/Peacock_thumb.jpg',
                    'created_at'=>\Carbon\Carbon::now()
                ]
            ]
        );

        DB::table('users')->insert(
          [
            [
              'id'=>'1',
              'firstname'=>'Brad',
              'lastname'=>'Magyar',
              'email'=>'braddmagyar@gmail.com',
              'password'=>'$2y$10$eP8rEeOG2RIpf0vRscWMKOMajJPD5GKBWJukPK3DpK1HJKR.dOhiC',
              'remember_token'=>'wGRcs8Tfpoq6k0m8oV1A2aM5xKPbJ6peY9HWYposgL3Rj7TeZXM8MUhkjJe7',
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'2',
              'firstname'=>'Sadie',
              'lastname'=>'Magyar',
              'email'=>'sadieemagyar@gmail.com',
              'password'=>'$2y$10$eP8rEeOG2RIpf0vRscWMKOMajJPD5GKBWJukPK3DpK1HJKR.dOhiC',
              'remember_token'=>'wGRcs8Tfpoq6k0m8oV1A2aM5xKPbJ6peY9HWYposgL3Rj7TeZXM8MUhkjJe7',
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );

        /*DB::table('user_infos')->insert(
          [
            [
              'id'=>'1',
              'user_id'=>'1',
              'phone'=>'330-634-4821',
              'pref_contact_method'=>'email',
              'email_notifications'=>1,
              'text_notifications'=>0,
              'billing_street'=>'346 Center Rd',
              'billing_city'=>'New Franklin',
              'billing_state'=>'OH',
              'billing_zip'=>'44319'
            ],
            [
              'id'=>'2',
              'user_id'=>'2',
              'phone'=>'123-123-1234',
              'pref_contact_method'=>'phone',
              'email_notifications'=>1,
              'text_notifications'=>1,
              'billing_street'=>'123 Test Pl',
              'billing_city'=>'Test Town',
              'billing_state'=>'OH',
              'billing_zip'=>'44444'
            ]
          ]
        ); */

        DB::table('admins')->insert(
          [
            [
              'id'=>'1',
              'user_id'=>'1',
              'active'=>1,
              'post_author'=>1,
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'2',
              'user_id'=>'2',
              'active'=>0,
              'post_author'=>0,
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );

        DB::table('authors')->insert(
          [
            [
              'id'=>'1',
              'user_id'=>'1',
              'admin_id'=>'1',
              'firstname'=>'Brad',
              'lastname'=>'Magyar',
              'photo_url'=>'http://res.cloudinary.com/establishmysteps/image/upload/c_thumb,w_200,h_200,g_face,r_max,f_png/v1451527704/DSC00928_ydrtya.png',
              'bio'=>"I'm just a dude from Ohio who builds websites and loves his wife very much!",
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'2',
              'user_id'=>'2',
              'admin_id'=>'2',
              'firstname'=>'Sadie',
              'lastname'=>'Magyar',
              'photo_url'=>'http://res.cloudinary.com/establishmysteps/image/upload/c_thumb,w_200,h_200,g_face,r_max,f_png/v1451527704/DSC00928_ydrtya.png',
              'bio'=>"Herp derp, I used to be an admin, but I was demoted.",
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );

        DB::table('categories')->insert(
          [
            [
              'id'=>'1',
              'name'=>'portraits',
              'tags'=>'photography;people',
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'2',
              'name'=>'wildlife',
              'tags'=>'photography;wildlife',
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'3',
              'name'=>'landscape',
              'tags'=>'photography;outdoors',
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );


        DB::table('posts')->insert(
          [
            [
              'id'=>1,
              'title'=>'Test Post 1',
              'slug'=>'test-post-1',
              'published'=>1,
              'author_id'=>1,
              'cat_id'=>2,
              'post_body'=>'Testing 1234 <br> This is a test post, yo! How you like them apples?',
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>2,
              'title'=>'Test Post 2',
              'slug'=>'test-post-2',
              'published'=>1,
              'author_id'=>1,
              'cat_id'=>3,
              'post_body'=>'This is just another test post... move along',
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );

        DB::table('tags')->insert(
          [
            [
              'id'=>1,
              'tag'=>'Honeymoon'
            ],
            [
              'id'=>2,
              'tag'=>'Misc'
            ],
            [
              'id'=>3,
              'tag'=>'Photography'
            ],
            [
              'id'=>4,
              'tag'=>'Outdoors'
            ]
          ]
        );


        DB::table('post_tag')->insert(
          [
            [
              'post_id'=>1,
              'tag_id'=>1
            ],
            [
              'post_id'=>2,
              'tag_id'=>4
            ],
            [
              'post_id'=>1,
              'tag_id'=>3
            ],
            [
              'post_id'=>1,
              'tag_id'=>4
            ],
            [
              'post_id'=>2,
              'tag_id'=>1
            ],
            [
              'post_id'=>2,
              'tag_id'=>2
            ]
          ]
        );


    }
}
