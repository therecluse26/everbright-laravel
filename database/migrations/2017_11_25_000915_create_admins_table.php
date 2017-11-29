<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
          //Fields
          $table->increments('id');
          $table->integer('user_id')->unsigned()->nullable(false);
          $table->boolean('active');
          $table->boolean('post_author');
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
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        Schema::dropIfExists('admins');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
