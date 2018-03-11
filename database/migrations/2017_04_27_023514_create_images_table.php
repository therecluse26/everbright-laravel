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
            $table->uuid('id')->primary();
            $table->integer('album_id')->unsigned();
            $table->string('image_name', 100)->nullable();
            $table->string('image_description')->nullable();
            $table->string('watermark_position', 20)->nullable();
            $table->string('original_file', 60);
            $table->string('original_file_url')->nullable();
            $table->string('original_url_remote')->nullable();
            $table->string('original_dimensions', 13)->nullable();
            $table->string('web_file', 60)->nullable();
            $table->string('web_file_url')->nullable();
            $table->string('web_url_remote')->nullable();
            $table->string('web_dimensions', 13)->nullable();
            $table->string('thumb_file', 60)->nullable();
            $table->string('thumb_file_url')->nullable();
            $table->string('thumb_url_remote')->nullable();
            $table->string('thumb_dimensions', 9)->nullable();
            $table->string('md5_checksum')->nullable();
            $table->boolean('original_stored_remotely')->default(false);
            $table->boolean('cdn_version_uploaded')->default(false);
            $table->boolean('use_cdn')->default(false);
            $table->timestamps();
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
