# Everbright Photography Site

A photography website built in Laravel with photo management, blogging, user management (WIP), etc.

Dependencies
------------
`PHP` 7.1+

`Imagick` PHP extension

`Redis` Caching server

Running
--------
Two helper scripts are included:

`start_dev.sh` - Starts the actual Laravel site

`start_queues.sh` - Starts the job queues for processing uploaded images (generates thumbnails and web versions from originals)