<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Album extends Model
{

  protected $active = false;

  protected $fillable = [
      'id',
  ];

  public function images()
  {
    return $this->hasMany(Image::class);
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
        'images' => function($query)
        {
          $query->select(
            'id',
            'album_id',
            'image_name',
            'image_description',
            'original_file',
            'original_file_path',
            'original_url_remote',
            'created_at'
          );
        }
      )
    )->select(['id', 'title', 'created_at'])
     ->where('slug', $slug)
     ->first();
  }

}
