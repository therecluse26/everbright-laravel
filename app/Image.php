<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
  public $incrementing = false;

  protected $primaryKey = "id";

  public function albums(){

    return $this->belongsToMany(Album::class);

  }
}
