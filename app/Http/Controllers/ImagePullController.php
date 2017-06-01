<?php
namespace App\Http\Controllers;

use Cloudinary;
use Route;
use DB;

//To handle image uploads automatically
class ImagePullController extends Controller
{

  public $collection = null;
  public $tag = null;

  public function __construct(){
    $this->collection = Route::current()->parameter('collection');
    $this->tag = Route::current()->parameter('tag');
  }

  //Makes request to Cloudinary API
  public function imageApiRequest($type = "collection") {

    Cloudinary::config(array(
      "cloud_name" => env("CLOUDINARY_CLOUD_NAME", null),
      "api_key" => env("CLOUDINARY_API_KEY", null),
      "api_secret" => env("CLOUDINARY_API_SECRET", null)
    ));

    $image_api = new Cloudinary\Api();

    if($type == "collection") {

      $image_result = $image_api->resources_by_context("album", $this->collection, array("context"=>true, "tags"=>true));

    } else {

      $image_result = $image_api->resources_by_tag($this->tag, array("context"=>true, "tags"=>true));

    }

    return $image_result;

  }

  //Still needs work... meant to parse specific tags from API response
  public function parseApiImages($api_image_array, $search_term = null, $search_type = "type") {

    $parsed_images = array();
    $this->search_term = $search_term;

    // print_r($api_image_array["resources"]);


    //Filters result by tag
    $filtered_result = array_where($api_image_array["resources"], function ($value, $key) {

      print_r($value);


    if ($search_type = "type") {

      if($value["context"]["custom"]["type"] == $this->search_term) {

        return $value["context"]["custom"]["type"];

      }

    } elseif ($search_type = "tag") {

      //if(array_search($this->search_term, $value["tags"])) {


        return array_search($this->search_term, $value["tag"]);

      //}

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

    //print_r($parsed_images);

    //$parsed_images = $filtered_result;

    return $parsed_images;

  }

  public function pullApiImages($tags = null, $context = null) {

    // echo $this->tag;

    $api_response = $this->imageApiRequest("collection");

    $honeymoon_images = array($this->tag . "_images" => $this->parseApiImages($api_response, $this->tag, "tag"));

    $header_images = array("header_images" => $this->parseApiImages($api_response, "header", "type"));

    $thumb_images = array("thumb_images" => $this->parseApiImages($api_response, "thumb", "type"));



    $final_result = /*$header_images + $thumb_images + */$honeymoon_images;

    //Perform Database updates here

    return $final_result;

  }
}
