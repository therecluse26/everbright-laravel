<?php

namespace App\Listeners;

use App\Events\AlbumAltered;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use \Cache;

class ReloadAlbumCache
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Forgets server-side cache for album (reloads upon next access)
     *
     * @param  AlbumAltered  $event
     * @return void
     */
    public function handle(AlbumAltered $event)
    {
      $album_slug = $event->slug;

      Cache::forget('album_'.$album_slug);

    }
}
