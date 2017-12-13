<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
  protected $fillable = [
      'bio', 'photo_url'
  ];

  protected $hidden = [
      'admin_id', 'user_id', 'created_at', 'updated_at'
  ];

  public function Posts()
  {
      return $this->hasManyThrough('App\Post', 'App\User');
  }

  public function User()
  {
      return $this->belongsTo('App\User');
  }
}
