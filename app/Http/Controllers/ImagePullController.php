<?php
namespace App\Http\Controllers;

use Cloudinary;

//To handle image uploads automatically
class ImagePullController extends Controller
{

  //Makes request to Cloudinary API
  public function imageApiRequest($tags = null) {

    Cloudinary::config(array(
      "cloud_name" => env("CLOUDINARY_CLOUD_NAME", null),
      "api_key" => env("CLOUDINARY_API_KEY", null),
      "api_secret" => env("CLOUDINARY_API_SECRET", null)
    ));

    $image_api = new Cloudinary\Api();

    if($tags == null) {

      $image_result = $image_api->resources(array("context"=>true, "tags"=>true));

    } else {

      $image_result = $image_api->resources_by_tag($tags, array("context"=>true, "tags"=>true));

    }

    return $image_result;

  }


  //Still needs work... meant to parse specific tags from API response
  public function parseImages($api_image_array, $tags = null, $context = null) {

    $image_thumbs = array_search('thumb', $api_image_array['resources']);
      
    $parsed_images = $api_image_array;

    return $parsed_images;

  }

  public function pullImages($tags = null, $context = null) {

    $api_response = $this->imageApiRequest($tags);

    $final_result = $this->parseImages($api_response, "header");

    //Perform Database updates here

    return $final_result;

  }
}
