<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('users', function (Blueprint $table) {
          $table->increments('id');
          $table->string('firstname', 30);
          $table->string('lastname', 30);
          $table->string('email')->unique();
          $table->string('phone', 20)->nullable();
          $table->string('pref_contact_method', 15)->default('email');
          $table->boolean('email_notifications')->default(0);
          $table->boolean('text_notifications')->default(0);
          $table->string('password');
          $table->rememberToken();
          $table->timestamps();

      });    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        Schema::dropIfExists('users');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
