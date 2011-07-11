## Plugin flow:
1. Fetch `http://download.watchlr.com/jsloc[?callback=foo]` every hour.
2. Server responds with appropriate location of `watchlr-min-<env>-<version>.js` (`env` is inferred from `_WENV` cookie value).

## Javascript library deploy procedure:

    cd js; php deploy.php <version> [<env>=prod]

1. Increment version number.
2. Build js library locally for `env`
3. Push (using script) to `download.watchlr.com`
4. Shell script also updates configuration on server to bump up current version number for `env`.

## Plugin deploy procedure:

    cd plugin
    edit Version.ver
    sh deploy.sh <version>
    git commit Version.ver -m '[plugin-deploy] <env> <version>'; git push origin master

1. Increment version number in `plugin/Version.ver`.
2. `cd plugin/Installer/Publisher; sh create_builds.sh`
3. `scp plugin/Builds/watchlr_installer_<version>.[crx|xpi] download.watchlr.com:/opt/download_env/static/plugin/`
