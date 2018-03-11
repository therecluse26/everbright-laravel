<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuthorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('authors', function (Blueprint $table) {
          //Fields
          $table->increments('id');
          $table->integer('user_id')->unsigned()->nullable(false);
          $table->string('firstname', 30);
          $table->string('lastname', 30);
          $table->string('bio', 4000)->nullable();
          $table->string('photo_url', 500)->nullable();
          $table->timestamps();
          //Constraints
          $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('authors');
    }
}
