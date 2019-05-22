<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use App\Image;
use Request;
use Illuminate\Support\Facades\Storage;

class ImageLoadController extends Controller
{
    public function showAlbumImage($album_slug, $image_id)
    {
        $img_type = Request::get('img_type');

        $image_meta = Image::select('original_file', 'web_file', 'thumb_file', 'watermark_position', 'album_id')
          ->where('id', $image_id)
          ->first();

        if ($img_type == 'thumb') {
            $image_path = config('file_handling.albums.album_storage_location').$album_slug.'/thumbs/'.$image_meta->thumb_file;

            $ext = pathinfo($image_path, PATHINFO_EXTENSION);

            if (Storage::exists($image_path)) {
                header("Content-Type: image/$ext");
                header('Cache-Control: max-age=84600');
                echo Storage::get($image_path);
            } else {
                header("Content-Type: image/png");
                header('Cache-Control: max-age=84600');
                echo Storage::get('public/photos/site_images/missing_image2.png');
            }
        } elseif ($img_type == 'web') {
            $image_path = config('file_handling.albums.album_storage_location').$album_slug.'/web/'.$image_meta->web_file;
            $this->verifyAndDisplayImage($image_path, $album_slug, $image_meta);
        } else {
            $image_path = config('file_handling.albums.album_storage_location').$album_slug.'/originals/'.$image_meta->original_file;
            $this->verifyAndDisplayImage($image_path, $album_slug, $image_meta);
        }
    }

    public function verifyAndDisplayImage($image_path, $album_slug, $image_meta)
    {
        /*
          // CHECK IF USER HAS RIGHTS TO VIEW ALBUM. IF NOT, ONLY DISPLAY PUBLIC PHOTOS
          $album = \App\Album::select(['id', 'title', 'slug', 'created_at'])
          ->where('slug', $album_slug)
          ->first();
        */

        if (Storage::exists($image_path)) {
            if (\Auth::user()->can('view', $image_meta)  /* || if user has paid for album */) {
                //Display image without watermark
                $ext = pathinfo($image_path, PATHINFO_EXTENSION);
                header('Cache-Control: no-cache');
                header("Content-Type: image/$ext");
                echo Storage::get($image_path);
            } else {
                //Apply watermark to image and output
                echo ImageTransformController::watermark($image_path, $image_meta->watermark_position);
            }
        } else {
            header("Content-Type: image/png");
            echo Storage::get('public/photos/site_images/missing_image2.png');
        }
    }

    /*public static function checkAlbumPermissions($token, $album_id) : array
    {
      $return = [];

      // Validate token
      $status = "";

      switch ($status){

        case 1:
          $return['status'] = true;
          $return['message'] = "Valid share token";
          break;
        default:
          $return['status'] = false;
          $return['message'] = "Invalid or expired share token";
          break;

      }

      return $return;

    }*/
}
