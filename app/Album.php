<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Album extends Model
{
    //protected $active = false;

    protected $fillable = [
      'id', 'owner_id', 'active'
    ];

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function owner()
    {
        return $this->hasOne(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', 1);
    }

    //Pulls album data by slug
    public static function pullBySlug($slug)
    {
        return static::with(
            array(
              'images' => function ($query) {
                  $query->select(
                      'id',
                      'album_id',
                      'image_name',
                      'image_description',
                      'thumb_file_url',
                      'thumb_dimensions',
                      'web_file_url',
                      'web_dimensions',
                      'created_at'
                  );
              }
            )
        )->select(['id', 'owner_id', 'title', 'slug', 'created_at'])
           ->where('slug', $slug)
           ->first();
    }
}
