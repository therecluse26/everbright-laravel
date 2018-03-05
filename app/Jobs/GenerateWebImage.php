<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Http\Controllers\ImageTransformController;
use Illuminate\Support\Facades\Storage;

class GenerateWebImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $image_meta;
    protected $image_storage_schema;
    protected $image_url_schema;

    public function __construct(array $image_meta)
    {
        $this->image_meta = $image_meta;
        $this->image_storage_schema = config('file_handling.albums.image_storage_schema');
        $this->image_url_schema = config('file_handling.albums.image_url_schema');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
      $image_id = $this->image_meta['image_id'];

      // Generate web-optimized image
      $web_img = ImageTransformController::generateWeb( $this->image_meta['new_original_file_path'] );

      //Move new image to storage
      if( !Storage::put($this->image_meta['web_dir'] . $this->image_meta['web_file_name'], $web_img) ){

        throw new Exception("Could not web optimized image to " . $this->image_meta['web_dir']);
      }

      //Update image database record
      $image = \App\Image::find($image_id);
      $image->web_file = $image_id . "_web." . $this->image_meta['extension'];
      $image->web_file_url = str_replace("{{image}}", $image_id . "_web", str_replace("{{album}}", $this->image_meta['album_slug'], $this->image_url_schema));
      $image->save();

    }
}
