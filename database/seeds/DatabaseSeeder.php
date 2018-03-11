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
            ],
            [
              'id'=>'3',
              'firstname'=>'Herp',
              'lastname'=>'Derpington',
              'email'=>'herp@derp.com',
              'password'=>'$2y$10$eP8rEeOG2RIpf0vRscWMKOMajJPD5GKBWJukPK3DpK1HJKR.dOhiC',
              'remember_token'=>'wGRcs8Tfpoq6k0m8oV1A2aM5xKPbJ6peY9HWYposgL3Rj7TeZXM8MUhkjJe7',
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'4',
              'firstname'=>'Walt',
              'lastname'=>'Nobody',
              'email'=>'no@body.com',
              'password'=>'$2y$10$eP8rEeOG2RIpf0vRscWMKOMajJPD5GKBWJukPK3DpK1HJKR.dOhiC',
              'remember_token'=>'wGRcs8Tfpoq6k0m8oV1A2aM5xKPbJ6peY9HWYposgL3Rj7TeZXM8MUhkjJe7',
              'created_at'=>\Carbon\Carbon::now()
            ]
          ]
        );

        DB::table('roles')->insert(
          [
            [
              'id'=>'1',
              'name'=>'Administrator'
            ],
            [
              'id'=>'2',
              'name'=>'Author'
            ],
            [
              'id'=>'3',
              'name'=>'Customer'
            ],
            [
              'id'=>'4',
              'name'=>'Guest'
            ]
          ]
        );

        DB::table('user_roles')->insert(
          [
            [
              'id'=>'1',
              'user_id'=>'1',
              'role_id'=>'1'
            ],
            [
              'id'=>'2',
              'user_id'=>'1',
              'role_id'=>'2'
            ],
            [
              'id'=>'3',
              'user_id'=>'2',
              'role_id'=>'2'
            ],
            [
              'id'=>'4',
              'user_id'=>'3',
              'role_id'=>'3'
            ],
            [
              'id'=>'5',
              'user_id'=>'4',
              'role_id'=>'4'
            ],
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



        DB::table('authors')->insert(
          [
            [
              'id'=>'1',
              'user_id'=>'1',
              'firstname'=>'Brad',
              'lastname'=>'Magyar',
              'photo_url'=>'http://res.cloudinary.com/establishmysteps/image/upload/c_thumb,w_200,h_200,g_face,r_max,f_png/v1451527704/DSC00928_ydrtya.png',
              'bio'=>"I'm just a dude from Ohio who builds websites and loves his wife very much!",
              'created_at'=>\Carbon\Carbon::now()
            ],
            [
              'id'=>'2',
              'user_id'=>'2',
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
