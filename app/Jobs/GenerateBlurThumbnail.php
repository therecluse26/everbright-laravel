<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Http\Controllers\ImageTransformController;
use Illuminate\Support\Facades\Storage;

class GenerateBlurThumbnail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $image_meta;

    public function __construct(array $image_meta)
    {
        $this->image_meta = $image_meta;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
      $image_id = $this->image_meta['image_id'];

      //Update image database record
      $image = \App\Image::find($image_id);
      $image->blur_thumb = ImageTransformController::generateBlurThumb( $this->image_meta['original_file_path'] );
      $image->save();

    }
}
