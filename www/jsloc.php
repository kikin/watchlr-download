<?php

$CONFIG = 'version.json';

$contents = file_get_contents($CONFIG);
$decoded = json_decode($contents);

$environ = $_COOKIE['_WENV'] != '' ? $_COOKIE['_WENV'] : 'prod';
$selected = $decoded->{$environ};

$version = $selected->{'version'};
$base = $selected->{'base'};

$protocol = empty($_SERVER['HTTPS']) ? 'http://' : 'https://';

// URL scheme = http://$base/$version/watchlr-$version.min.js
if ($environ == 'local') {
    $location = $protocol . $base . '/watchlr-' . $version . '.min.js';
} else {
    $location = $protocol . $base . '/' . $version . '/watchlr-' . $version . '.min.js';
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

// Set experiment?
if (isset($_GET['exp'])) {
  setcookie('_WEXP', $_GET['exp'], time()+3600*24*30, '/', '.watchlr.com');
}

?> 
