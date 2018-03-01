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
            $table->string('image_name')->nullable();
            $table->string('image_description')->nullable();
            $table->string('original_file');
            $table->string('original_file_path')->nullable();
            $table->string('original_url_remote')->nullable();
            $table->string('web_file')->nullable();
            $table->string('web_file_path')->nullable();
            $table->string('web_url_remote')->nullable();
            $table->string('thumb_file')->nullable();
            $table->string('thumb_file_path')->nullable();
            $table->string('thumb_url_remote')->nullable();
            /*
            $table->string('local_base_uri')->nullable();
            $table->string('local_original_uri')->nullable();
            $table->string('local_optimized_uri')->nullable();
            $table->string('local_thumb_uri')->nullable();
            $table->string('cdn_base_uri')->nullable();
            $table->string('cdn_original_uri')->nullable();
            $table->string('cdn_optimized_uri')->nullable();
            $table->string('cdn_thumb_uri')->nullable();
            */
            $table->string('md5_checksum')->nullable();
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
