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
            $table->integer('grouping_id')->unsigned();
            $table->string('type');
            $table->integer('album_id')->unsigned();
            $table->string('image_name');
            $table->string('slug');
            $table->string('local_base_uri');
            $table->string('local_file_uri');
            $table->string('local_thumb_uri');
            $table->string('cdn_base_uri');
            $table->string('cdn_file_uri');
            $table->string('cdn_thumb_uri');
            $table->string('md5_checksum')->nullable();
            $table->boolean('use_cdn')->default(true);
            $table->timestamps('timestamp');
        });

        Schema::create('album_image', function (Blueprint $table) {
            $table->integer('image_id')->references('id')->on('images')->onUpdate('cascade')->onDelete('cascade');;
            $table->integer('album_id')->references('id')->on('albums')->onUpdate('cascade')->onDelete('cascade');;
            $table->primary(['image_id', 'album_id']);
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
        Schema::dropIfExists('album_image');
    }
}
