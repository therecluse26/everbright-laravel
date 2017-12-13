<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('album_id')->unsigned();
            $table->string('slug');
            $table->string('photo_name');
            $table->boolean('use_cdn')->default(true);
            $table->string('local_base_uri');
            $table->string('local_file_uri');
            $table->string('local_thumb_uri');
            $table->string('cdn_base_uri');
            $table->string('cdn_file_uri');
            $table->string('cdn_thumb_uri');
            $table->string('tags');
            $table->string('cover_image');
            $table->timestamps('timestamp');
        });

        Schema::table('images', function($table){
            $table->foreign('album_id')->references('id')->on('albums');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('images');
    }
}
