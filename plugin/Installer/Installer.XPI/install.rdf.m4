<?xml version="1.0" encoding="UTF-8"?>
<RDF xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:em="http://www.mozilla.org/2004/em-rdf#">
  <Description about="urn:mozilla:install-manifest">
    <em:id>{3C108598-D93F-4606-A3C3-2873B8017A60}</em:id>
    <em:name>watchlr</em:name>
    <em:version>__K_MAJOR_VERSION__.__K_MINOR_VERSION__.__K_BUILD_NUMBER__</em:version>
    <em:creator>watchlr</em:creator>
    <em:description>Discover, save and share video</em:description>
    <em:homepageURL>http://www.watchlr.com</em:homepageURL>
    <em:iconURL>chrome://watchlr/content/icon.png</em:iconURL>
    <em:updateURL>https://download.watchlr.com/updates/update-watchlr.rdf</em:updateURL>

    <em:file>
      <Description about="urn:mozilla:extension:file:watchlr.jar">
        <em:package>content/watchlr/</em:package>
      </Description>
    </em:file>

    <em:targetApplication>
      <Description>
        <em:id>{ec8030f7-c20a-464f-9b0e-13a3a9e97384}</em:id>
        <!-- firefox -->
        <em:minVersion>3.5</em:minVersion>
        <em:maxVersion>9.0a1</em:maxVersion>
      </Description>
    </em:targetApplication>
    <em:targetPlatform>Darwin_x86-gcc3</em:targetPlatform>
    <em:targetPlatform>WINNT</em:targetPlatform>
    <em:targetPlatform>Darwin_x86_64-gcc3</em:targetPlatform>
  </Description>
</RDF>
