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

if ($argc < 2) {
  exit('Usage: php ' . $argv[0] . ' version [env=prod]');
}
$version = $argv[1];

$env = 'prod';
if ($argc > 2) {
  $env = $argv[2];
}

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

$decoded->{$env}->{'version'} = $version;
file_put_contents($VERSION_FILE_PATH, json_encode($decoded));

ensure_success('git commit ' . $VERSION_FILE_PATH . ' -m "[js-deploy] ' . $env . ' - ' . $version);
ensure_success('git push origin master');

ensure_success('ssh ' . $DEPLOY_HOSTNAME . ' "cd ' . $BASE_PATH . 'src; git pull origin master"');

?>
