#!/bin/sh

if [ $# -ne 1 ]
then
  echo "Usage: $0 <version>"
  exit 1
fi

cd Installer/Publisher; sh create_builds.sh; cd -

output=Builds/watchlr_installer_$1.*
scp $output download.watchlr.com:/opt/download_env/static/plugin
