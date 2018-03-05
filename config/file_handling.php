<?php
return array(
    'albums' => array(
      'album_storage_location' => '/private_albums/',
      'image_url_schema' => '/albums/{{album}}/images/{{image}}',
      'image_storage_schema'=> '/private_albums/{{album}}/{{image}}',
    ),
    'images' => array(
        'watermark_path' => storage_path().'/app/public/photos/site_images/watermark.png',
        'thumb_max_width' => 450,
        'web_max_width' => 1600,
    ),
);
