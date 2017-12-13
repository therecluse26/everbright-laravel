<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $active = false;

    protected $fillable = [
        'id', 'title', 'slug', 'published', 'tags', 'cover_photo',
        'author_id', 'cat_id', 'album_id', 'post_body', 'created_at', 'updated_at'
    ];

    public function Author()
    {
      return $this->belongsTo('App\Author');
    }
    public function User()
    {
        return $this->hasManyThrough('App\User', 'App\Author');
    }
}
