<?php

$CONFIG = 'version.json';

$contents = file_get_contents($CONFIG);
$decoded = json_decode($contents);

$environ = $_COOKIE['_WENV'] != '' ? $_COOKIE['_WENV'] : 'prod';
$selected = $decoded->{$environ};

$version = $selected->{'version'};
$base = $selected->{'base'};

$timestamp = new Date().getTime();

// URL scheme = http://$base/$version/watchlr-$version.min.js
$location = $base . '/' . $version . '/watchlr-' . $version . '.min.js?v=' . $timestamp;

$callback = $_GET['callback'];
if ($callback != '') {
    header('Content-type: application/javascript');
    echo $callback . '({"js_url": "' . $location . '"});';
} else {
    header('Content-type: application/json');
    echo '{"js_url": "' . $location . '"}';
}

?> 
