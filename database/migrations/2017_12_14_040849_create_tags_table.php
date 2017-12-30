<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tag', 50)->unique();
        });

        Schema::create('post_tag', function (Blueprint $table) {
            $table->integer('post_id')->references('id')->on('posts')->onUpdate('cascade')->onDelete('cascade');;
            $table->integer('tag_id')->references('id')->on('tags')->onUpdate('cascade')->onDelete('cascade');;
            $table->primary(['post_id', 'tag_id']);
        });

        Schema::create('image_tag', function (Blueprint $table) {
            $table->integer('image_id')->references('id')->on('images')->onUpdate('cascade')->onDelete('cascade');;
            $table->integer('tag_id')->references('id')->on('tags')->onUpdate('cascade')->onDelete('cascade');;
            $table->primary(['image_id', 'tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::dropIfExists('tags');
      Schema::dropIfExists('post_tag');
      Schema::dropIfExists('image_tag');
    }
}
