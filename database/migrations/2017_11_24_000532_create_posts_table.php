<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100);
            $table->boolean('active')->default(0);
            $table->string('tags');
            $table->string('cover_photo');
            $table->integer('user_id')->unsigned();
            $table->integer('cat_id')->unsigned();
            $table->integer('album_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('cat_id')->references('id')->on('categories');
            $table->foreign('album_id')->references('id')->on('albums');
            $table->string('post_body', 15000);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
