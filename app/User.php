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


    public function Roles()
    {
      return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function Author()
    {
      if ( $this->isAuthor() ) {

        return $this->hasOne('App\Author');

      } else {
        
        return false;
      }
    }

    public function UserInfo()
    {
      return $this->hasOne('App\UserInfo');
    }

    // Role checks
    public function isAdmin()
    {
       return $this->roles()->where('name', 'Administrator')->exists();
    }

    public function isAuthor()
    {
       return $this->roles()->where('name', 'Author')->exists();
    }


}
