{
   "background_page": "background.html",
   "content_scripts": [ 
      {
         "js": [ "content_script.js" ],
         "matches": [ "http://*/*", "https://*/*" ],
         "run-at": [ "document_start" ],
	     "all_frames": true
      },
	  {
         "js": [ "watchlr_domain.js" ],
         "matches": [ "http://*.watchlr.com/*", "https://*.watchlr.com/*" ],
         "run-at": [ "document_start" ]
      }
   ],
   "description": "Discover, save and share video",
   "icons": {
      "24": "icon_24.PNG",
      "48": "icon.png"
   },
   "name": "Watchlr",
   "permissions": [ "tabs",  "http://*/*" , "https://*/*" ],
   "version": "__K_MAJOR_VERSION__.__K_MINOR_VERSION__.__K_BUILD_NUMBER__",
   "update_url": "http://download.watchlr.com/updates/update-watchlr.xml"
}
