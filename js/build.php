<?php

function getAllFiles($directory, $extension) {
  $ret = array();
  if ($handle = opendir($directory)) {
      while (false !== ($file = readdir($handle))) {
        if ($file == '.' || $file == '..') {
          continue;
        } else if (substr($file, -1*strlen($extension)) == $extension) {
            array_push($ret, $directory.'/'.$file);
        } else if (!is_file($directory.'/'.$file)) {
          $result = getAllFiles($directory.'/'.$file, $extension);
          $ret = array_merge($ret, $result);
        }
      }
      closedir($handle);
  } else {
    die("could not find directory $directory");
  }
  return $ret;
}

function jsPrioritiesCmp($a, $b) {
	$priorities = array(
		'src/main/com/jquery/jquery.js' => 100,
		'src/main/com/jquery/jquery.class.js' => 99,
        'src/main/com/jquery/jquery.swfobject.js' => 98,

        'src/main/com/watchlr/system/runtime/main.js' => 97,

        'src/main/com/watchlr/util/Error.js' => 90,
        'src/main/com/watchlr/util/Styles.js' => 89,
        'src/main/com/watchlr/util/String.js' => 88,
        'src/main/com/watchlr/util/Url.js' => 87,

        'src/main/com/watchlr/config/FeaturesConfig.js' => 86,
        'src/main/com/watchlr/config/HostsConfig.js' => 85,
        'src/main/com/watchlr/config/Locale.js' => 84,
        'src/main/com/watchlr/config/VideoProvidersConfig.js' => 83,

        'src/main/com/watchlr/system/Config.js' => 80,
        'src/main/com/watchlr/system/Service.js' => 79,
        'src/main/com/watchlr/system/ServiceDaemon.js' => 78,
        'src/main/com/watchlr/system/WatchlrRequests.js' => 77,
        'src/main/com/watchlr/system/Tracker.js' => 76,

        'src/main/com/watchlr/ui/FacebookConnectDialog.js' => 70,
        'src/main/com/watchlr/ui/VideoSavedDialog.js' => 69,
        'src/main/com/watchlr/ui/VideoLikedDialog.js' => 68,
        'src/main/com/watchlr/ui/WatchlrVideoBorder.js' => 67,

        'src/main/com/watchlr/features/insituvideo/InSituDefaultPlayer.js' => 66,
        'src/main/com/watchlr/features/insituvideo/InSituVideoFeature.js' => 65,
        'src/main/com/watchlr/features/insituvideo/InSituVideoPanel.js' => 64,

        'src/main/com/watchlr/hosts/Host.js' => 60,
        'src/main/com/watchlr/hosts/HostController.js' => 59,

        'src/main/com/watchlr/hosts/adapters/SiteAdapter.js' => 58,
        'src/main/com/watchlr/hosts/adapters/VideoAdapter.js' => 57,
        'src/main/com/watchlr/hosts/adapters/InSituVideoAdapter.js' => 56,

        'src/main/com/watchlr/hosts/bing/SiteAdapter.js' => 31,
        'src/main/com/watchlr/hosts/bing/VideoAdapter.js' => 30,

        'src/main/com/watchlr/hosts/cbsnews/SiteAdapter.js' => 28,
        'src/main/com/watchlr/hosts/cbsnews/VideoAdapter.js' => 27,

        'src/main/com/watchlr/hosts/cnn/SiteAdapter.js' => 26,
        'src/main/com/watchlr/hosts/cnn/VideoAdapter.js' => 25,

        'src/main/com/watchlr/hosts/defaultEngine/SiteAdapter.js' => 24,
        'src/main/com/watchlr/hosts/defaultEngine/VideoAdapter.js' => 23,

        'src/main/com/watchlr/hosts/espn/SiteAdapter.js' => 22,
        'src/main/com/watchlr/hosts/espn/VideoAdapter.js' => 21,

        'src/main/com/watchlr/hosts/facebook/SiteAdapter.js' => 20,
        'src/main/com/watchlr/hosts/facebook/VideoAdapter.js' => 19,

        'src/main/com/watchlr/hosts/foxsports/SiteAdapter.js' => 18,
        'src/main/com/watchlr/hosts/foxsports/VideoAdapter.js' => 17,

        'src/main/com/watchlr/hosts/google/SiteAdapter.js' => 16,
        'src/main/com/watchlr/hosts/google/VideoAdapter.js' => 15,
        'src/main/com/watchlr/hosts/google/InSituVideoAdapter.js' => 14,

        'src/main/com/watchlr/hosts/orkut/SiteAdapter.js' => 13,
        'src/main/com/watchlr/hosts/orkut/VideoAdapter.js' => 12,

        'src/main/com/watchlr/hosts/vimeo/SiteAdapter.js' => 11,
        'src/main/com/watchlr/hosts/vimeo/VideoAdapter.js' => 10,

        'src/main/com/watchlr/hosts/watchlr/SiteAdapter.js' => 8,
        'src/main/com/watchlr/hosts/watchlr/VideoAdapter.js' => 7,

        'src/main/com/watchlr/hosts/yahoo/SiteAdapter.js' => 6,
        'src/main/com/watchlr/hosts/yahoo/VideoAdapter.js' => 5,
        'src/main/com/watchlr/hosts/yahoo/InSituVideoAdapter.js' => 4,

        'src/main/com/watchlr/hosts/youtube/SiteAdapter.js' => 3,
        'src/main/com/watchlr/hosts/youtube/VideoAdapter.js' => 2,
        'src/main/com/watchlr/hosts/youtube/InSituVideoAdapter.js' => 1,

        'src/main/com/watchlr/system/runtime/Bootstrap.js' => -1
	);

	$aPriority = 0;
	$bPriority = 0;

	if (array_key_exists($a, $priorities)) $aPriority = $priorities[$a];
	if (array_key_exists($b, $priorities)) $bPriority = $priorities[$b];

    return $aPriority < $bPriority;
}

function getJavascriptTree($files) {
  $tree = array();

  // create the tree
  for ($i=0; $i<count($files); $i++) {
    $file = $files[$i];
    $name = substr($file, 0, strrpos($file, '/'));

    $cur = &$tree;
    $packages = explode('/', $name);
    for ($j=0; $j<count($packages); $j++) {
      $package = $packages[$j];
      if (!$cur[$package]) {
        // create package
        $cur[$package] = array();
      }
      $cur = &$cur[$package];
    }
  }
  return $tree;
}

function createTreeString($tree, $level = 0) {
  $ret = '';

  if ($level == 0) $ret .= 'var ';
  foreach ($tree as $key => $value) {
    if ($ret != '' && $level != 0) $ret .= ',';
    $ret .= $key.($level==0?'=':':').'{';
    $ret .= createTreeString($value, $level+1);
    $ret .= '}';
  }
  if ($level == 0) $ret .= ';';

  return $ret;
}

function getJavascriptTreeString($files) {
  //TODO: fix this
  return '';

  // get the tree
  $tree = getJavascriptTree($files);

  // make the output
  return createTreeString($tree);
}

if (!isset($_GET['rebuild']) || $_GET['rebuild'] == 'true') {
  $servers = array("dev" => "http://dev.watchlr.com/", "prod" => "http://www.watchlr.com/", "local" => "http://local.watchlr.com:8000/");
    if ($argc < 2) {
        echo "Version number is not specified.\n";
        exit(1);
    }

    $version = $argv[1];
    $environ = "prod";
    if($argc > 2){
        if(array_key_exists($argv[2], $servers)){
            $environ = $argv[2];
        }
    }
    $server = $servers[$environ];

    $result = '';

  // get css/html/js files
  $cssFiles = getAllFiles('src/main', '.css');
  $htmlFiles = getAllFiles('src/main', '.html');
  $jsFiles = getAllFiles('src/main', '.js');

    // just concat javascript files
  $temp = usort($jsFiles, "jsPrioritiesCmp");
  for ($i=0; $i<count($jsFiles); $i++) {
    $result .= file_get_contents($jsFiles[$i]);
  }

    // Add CSS files
  if(count($cssFiles)){
        $result .= "\ncom.watchlr.system.css = {};";
    // convert css files to variables
    $result .= getJavascriptTreeString($cssFiles)."\n";
    for ($i=0; $i<count($cssFiles); $i++) {
      $content = file_get_contents($cssFiles[$i]);
      $content = str_replace("'", "\\'", $content);
      $content = str_replace("\n", "", $content);
      $content = str_replace("\r", "", $content);
      $content = str_replace("\t", "", $content);
      $content = str_replace("    ", "", $content);

      $name = basename($cssFiles[$i], ".css");

      $result .= "com.watchlr.system.css['$name']='$content';\n";
    }
  }

    // Add HTML files
  if(count($htmlFiles)){
    $result .= "\ncom.watchlr.system.html = {};";
    // convert css files to variables
    $result .= getJavascriptTreeString($htmlFiles)."\n";
    for ($i=0; $i<count($htmlFiles); $i++) {
      $content = file_get_contents($htmlFiles[$i]);
      $content = str_replace("'", "\\'", $content);
      $content = str_replace("\n", "", $content);
      $content = str_replace("\r", "", $content);
      $content = str_replace("\t", "", $content);
      $content = str_replace("    ", "", $content);

      $name = basename($htmlFiles[$i], ".html");

      $result .= "com.watchlr.system.html['$name']='$content';\n";
    }
  }

    $result .= "var bootstrap = new com.watchlr.system.runtime.Bootstrap(); bootstrap.run();";
    $result = str_replace("http://www.watchlr.com/", $server, $result);
    if ($environ != "local") {
      $static_path = $server . "static/images/";
      $result = str_replace("http://local.watchlr.com/watchlr/img/", $static_path, $result);
    }

    // Add JS library version
    $result = str_replace('__W_VERSION__', $version, $result);

    $result = "(function() {" . $result . "})();";
    file_put_contents('watchlr-' . $version . '.min.js', $result);
}

?>
