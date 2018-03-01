<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
  public $incrementing = false;

  protected $primaryKey = "id";

  public function albums(){

    return $this->belongsTo(Album::class);

  }

  public function getOriginalUrlAttribute($image)
  {
    return $image->blah = $this->album->slug;

    /*return env("PRIVATE_ALBUM_DIR", "")."/".
      Image::with(
        array('albums'=>function($query){
            $query->select('slug')->where('id', $this->album_id);
          }
        )
      )->get()->first()."/".$image->original_file;*/
  }

}
