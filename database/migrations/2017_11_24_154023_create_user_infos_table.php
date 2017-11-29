<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_infos', function (Blueprint $table) {
          //Fields
          $table->increments('id');
          $table->integer('user_id')->unsigned()->nullable(false);
          $table->string('billing_street', 60)->nullable();
          $table->string('billing_street2', 60)->nullable();
          $table->string('billing_city', 60)->nullable();
          $table->string('billing_state', 30)->nullable();
          $table->string('billing_zip', 20)->nullable();
          $table->boolean('same_ship_bill')->default(0)->nullable();
          $table->string('shipping_street', 60)->nullable();
          $table->string('shipping_street2', 60)->nullable();
          $table->string('shipping_city', 60)->nullable();
          $table->string('shipping_state', 30)->nullable();
          $table->string('shipping_zip', 20)->nullable();
          $table->timestamps();
          //Constraints
          $table->foreign('user_id')->references('id')->on('users');
        });

        // Creates empty user_infos row
        DB::unprepared('
          CREATE TRIGGER tr_User_Insert_UserInfo AFTER INSERT ON `users` FOR EACH ROW
              BEGIN
                  INSERT INTO user_infos (`user_id`)
                  VALUES (NEW.id);
              END
          ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_infos');
        DB::unprepared('DROP TRIGGER IF EXISTS `tr_User_Insert_UserInfo`');
    }
}
