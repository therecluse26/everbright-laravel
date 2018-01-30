<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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
}
