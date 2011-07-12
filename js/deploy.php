<?php

function ensure_success($cmd) {
  $code = 0;
  system($cmd, $code);

  if ($code != 0) {
    exit($code);
  }
}

$DEPLOY_HOSTNAME = 'download.watchlr.com';
$VERSION_FILE_PATH = '../www/version.json';
$BASE_PATH = '/opt/download_env/';
$VERSION_PROPERTIES_FILE = 'Version.ver';

$major = system('echo include\(' . $VERSION_PROPERTIES_FILE . '\)__W_MAJOR_VERSION__| m4');
$minor = system('echo include\(' . $VERSION_PROPERTIES_FILE . '\)__W_MINOR_VERSION__| m4');
$build = system('echo include\(' . $VERSION_PROPERTIES_FILE . '\)__W_BUILD_NUMBER__| m4');
$env = system('echo include\(' . $VERSION_PROPERTIES_FILE . '\)__W_BUILD_ENVIRONMENT__| m4');
$version = $major . '.' . $minor . '.' . $build;
echo "Using version number: " . $version . "\n";
echo "Using environment: " . $env . "\n";

$content = file_get_contents($VERSION_FILE_PATH);
$decoded = json_decode($content);

if ($decoded->{$env} == '') {
  exit('Environment: ' . $env . ' invalid');
}

ensure_success('php build.php ' . $version . ' ' . $env);

$file = 'watchlr-' . $version . '.min.js';
$path = $BASE_PATH . 'static/js/' . $env . '/' . $version;

ensure_success('ssh ' . $DEPLOY_HOSTNAME . ' mkdir -p ' . $path);
ensure_success('scp '. $file . ' ' . $DEPLOY_HOSTNAME . ':' . $path . '/'. $file);
ensure_success('scp watchlr_bookmarklet.html ' . $DEPLOY_HOSTNAME . ':' . $path);

$decoded->{$env}->{'version'} = $version;
file_put_contents($VERSION_FILE_PATH, json_encode($decoded));

ensure_success('git commit ' . $VERSION_FILE_PATH . ' -m "[js-deploy] ' . $env . ' - ' . $version . '"');
ensure_success('git push origin master');

ensure_success('ssh ' . $DEPLOY_HOSTNAME . ' "cd ' . $BASE_PATH . 'src; git pull origin master"');

?>
