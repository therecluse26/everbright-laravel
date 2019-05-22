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

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function checkRole($role)
    {
        return in_array($this->role, $role);
    }

    public function author()
    {
        if ($this->isAuthor()) {
            return $this->hasOne('App\Author');
        } else {
            return false;
        }
    }

    //Pulls User Profile Info
    public function userInfo()
    {
        return $this->hasOne('App\UserInfo', 'user_id');
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

    public function isCustomer()
    {
        return $this->roles()->where('name', 'Customer')->exists();
    }

    public function isGuest()
    {
        return $this->roles()->where('name', 'Guest')->exists();
    }
}
