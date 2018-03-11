<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AlbumAltered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    //Invokes ReloadAlbumCache listener to refresh server cache of album on change

    public $slug;

    public function __construct($slug)
    {
        $this->slug = $slug;
    }
}
