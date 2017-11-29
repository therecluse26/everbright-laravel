<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'lastname', 'email', 'password', 'phone',
        'email_notifications', 'text_notifications', 'pref_contact_method'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', '_token',
    ];

    public function UserInfo()
    {
      return $this->hasOne('App\UserInfo');
    }

    public function Admin()
    {
      return $this->hasOne('App\Admin');
    }

    public function Author()
    {
      return $this->hasOne('App\Author');
    }
}
