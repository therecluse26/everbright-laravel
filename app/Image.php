<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
  public function images(){

    return $this->belongsTo(Album::class);

  }
}
