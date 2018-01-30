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

  public function tags()
  {
    return $this->belongsToMany(Tag::class);
  }

  //Scopes
  public function scopePublished($query)
  {
    return $query->where('published', 1);
  }
  public function scopeDescending($query)
  {
    return $query->orderBy('created_at', 'desc');
  }
  public function scopeAscending($query)
  {
    return $query->orderBy('created_at', 'asc');
  }
    /*public function User()
    {
        return $this->hasManyThrough('App\User', 'App\Author');
    }*/
}
