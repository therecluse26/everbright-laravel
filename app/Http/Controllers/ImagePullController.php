<?php
namespace App\Http\Controllers;

use Cloudinary;
use DB;

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

    $parsed_images = array();
    $this->tags = $tags;

    //Filters result by tag
    $filtered_result = array_where($api_image_array["resources"], function ($value, $key) {

      if($value["context"]["custom"]["type"] == $this->tags) {

        return $value["context"]["custom"]["type"];

      }

      //return array_search($this->tags, $value["context"]["custom"]);

    });

    foreach ($filtered_result as $image) {

      $tag_list = '';

      foreach ($image["tags"] as $tag) {
        $tag_list = $tag_list . $tag . ";";
      }

      $tag_list = rtrim($tag_list, ";");


      array_push($parsed_images,
        array(
          "type" => $image["context"]["custom"]["type"],
          "photo_name" => $image["context"]["custom"]["alt"],
          "slug" => $image["context"]["custom"]["slug"],
          "album_title" => $image["context"]["custom"]["album"],
          "file_uri" => $image["url"],
          "tags" => $tag_list,
          "cover_image" => $image["context"]["custom"]["cover_image"]
          )
        );
      //print_r($image);
      // array_push("");

    }

    print_r($parsed_images);

    $parsed_images = $filtered_result;

    return $parsed_images;

  }

  public function pullImages($tags = null, $context = null) {

    $api_response = $this->imageApiRequest("everbright");

    $header_images = array("header_images" => $this->parseImages($api_response, "header"));

    $thumb_images = array("thumb_images" => $this->parseImages($api_response, "thumb"));

    $final_result = $header_images + $thumb_images;

    //Perform Database updates here

    return $final_result;

  }
}
