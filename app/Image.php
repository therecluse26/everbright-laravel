<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    public $incrementing = false;

    protected $primaryKey = "id";

    public function albums()
    {
        return $this->belongsTo(Album::class);
    }

    public function owner()
    {
        return \App\Album::select('owner_id')->where('id', $this->album_id)->first()->owner_id;
    }
}
