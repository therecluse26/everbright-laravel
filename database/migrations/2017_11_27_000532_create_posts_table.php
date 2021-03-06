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
            $table->string('title', 100)->unique();
            $table->string('slug', 50)->unique();
            $table->boolean('published')->default(0);
            $table->string('tags')->nullable();
            $table->string('cover_photo')->nullable();
            $table->integer('author_id')->unsigned();
            $table->integer('cat_id')->unsigned();
            $table->integer('album_id')->unsigned()->nullable();
            $table->foreign('author_id')->references('id')->on('authors');
            $table->foreign('cat_id')->references('id')->on('categories');
            $table->foreign('album_id')->references('id')->on('albums');
            $table->text('post_body');
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
