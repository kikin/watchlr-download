#!/bin/sh

cd Installer/Publisher; sh create_builds.sh; cd -

major=$(echo include\($version_properties_file\)__K_MAJOR_VERSION__| m4)
minor=$(echo include\($version_properties_file\)__K_MINOR_VERSION__| m4)
build=$(echo include\($version_properties_file\)__K_BUILD_NUMBER__| m4)
watchlr_plugin_version=$major.$minor.$build
echo Using version string $watchlr_plugin_version

output=Builds/watchlr_installer_$watchlr_plugin_version.*
scp $output download.watchlr.com:/opt/download_env/static/plugin
