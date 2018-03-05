<?php

namespace App\Http\Controllers;

use Imagick;
use Illuminate\Http\Request;

class ImageTransformController extends Controller
{
    public static function watermark($image_path, $position = null)
    {
      $watermark_path = config('file_handling.images.watermark_path');

      // Reads original image
      $image = new Imagick;
      $image->readImage(storage_path()."/app".$image_path);

      // Reads watermark
      $watermark = new Imagick;
      $watermark->readImage($watermark_path);

      $iWidth = $image->getImageWidth();
      $iHeight = $image->getImageHeight();
      $wWidth = $watermark->getImageWidth();
      $wHeight = $watermark->getImageHeight();

      if ($iHeight < $wHeight || $iWidth < $wWidth) {
          // Scales the watermark based on image width
          $watermark->scaleImage($iWidth / 2, 0);
          $wWidth = $watermark->getImageWidth();
          $wHeight = $watermark->getImageHeight();
      }

      // Sets watermark based on position variable
      switch($position) {
        case "center middle":
          $x = ($iWidth - $wWidth) / 2;
          $y = ($iHeight - $wHeight) / 2;
          break;
        case "center right":
          $x = ($iWidth - $wWidth) - 10;
          $y = ($iHeight - $wHeight) / 2;
          break;
        case "center left":
          $x = 10;
          $y = ($iHeight - $wHeight) / 2;
          break;
        case "top middle":
          $x = ($iWidth - $wWidth) / 2;
          $y = 10;
          break;
        case "top right":
          $x = ($iWidth - $wWidth) - 10;
          $y = 10;
          break;
        case "top left":
          $x = 10;
          $y = 10;
          break;
        case "bottom middle":
          $x = ($iWidth - $wWidth) / 2;
          $y = ($iHeight - $wHeight);
          break;
        case "bottom right":
          $x = ($iWidth - $wWidth) - 10;
          $y = ($iHeight - $wHeight) - 10;
          break;
        case "bottom left":
          $x = 10;
          $y = ($iHeight - $wHeight) - 10;
          break;
        default:
          $x = ($iWidth - $wWidth) / 2;
          $y = ($iHeight - $wHeight) / 2;
          break;
      }

      // Overlay the watermark on the original image
      $image->compositeImage($watermark, imagick::COMPOSITE_OVER, $x, $y);

      // Returns watermarked image with proper header
      header("Content-Type: image/" . $image->getImageFormat());
      return $image->getImageBlob();

    }

    public static function generateThumb($image_path)
    {
      $thumb_max_width = config('file_handling.images.thumb_max_width');

      $image = new Imagick(storage_path()."/app/".$image_path);

      // Resize based on width
      $image->resizeImage($thumb_max_width, 0, Imagick::FILTER_SINC, 1);

      //$image->setImageFormat("jpg");
      $image->setImageCompression(Imagick::COMPRESSION_JPEG);
      $image->setImageCompressionQuality(80);

      // Strip out unneeded meta data
      $image->stripImage();

      header("Content-Type: image/" . $image->getImageFormat());

      //$image->writeImage(storage_path()."/app".dirname($image_path)."/" . rand(1, 100000000000) . ".jpg");

      return $image->getImageBlob();

      /*$thumb = new Imagick;
      $thumb->readImage(storage_path()."/app".$image_path);
      //$thumb->setImageFormat("jpg");
      $thumb->thumbnailImage(400, 1000000, true, false);

      // Returns thumbnail with proper header
      header("Content-Type: image/" . $thumb->getImageFormat());
      return $thumb->getImageBlob;*/

    }

    public static function generateWeb($image_path)
    {
      $web_max_width = config('file_handling.images.web_max_width');
      $image = new Imagick(storage_path()."/app/".$image_path);
      $image->resizeImage($web_max_width, 0, Imagick::FILTER_LANCZOS, 1);

      //$image->setImageFormat("jpg");
      $image->setImageCompression(Imagick::COMPRESSION_JPEG);
      $image->setImageCompressionQuality(80);

      header("Content-Type: image/" . $image->getImageFormat());

      return $image->getImageBlob();

    }

    public static function stripMetadata(array $dataToRemove = [])
    {

    }

    public static function setMetaData(array $dataToAdd = [])
    {

    }

}
