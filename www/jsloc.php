<?php

$CONFIG = 'version.json';

$contents = file_get_contents($CONFIG);
$decoded = json_decode($contents);

$environ = $_COOKIE['_WENV'] != '' ? $_COOKIE['_WENV'] : 'prod';
$selected = $decoded->{$environ};

$version = $selected->{'version'};
$base = $selected->{'base'};

// URL scheme = http://$base/$version/watchlr-$version.min.js
if ($environ == 'local') {
    $location = $base . '/watchlr-' . $version . '.min.js';
} else {
    $location = $base . '/' . $version . '/watchlr-' . $version . '.min.js';
}

// Cache for 1 hour
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 3600));

$callback = $_GET['callback'];
if ($callback != '') {
    header('Content-type: application/javascript');
    echo $callback . '({"js_url": "' . $location . '"});';
} else {
    header('Content-type: application/json');
    echo '{"js_url": "' . $location . '"}';
}

?> 
