/**
 * @package com.watchlr.hosts.youtube.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.youtube.adapters.SiteAdapter", {}, {
	
	run: function() {

        try {

            //if (0 == window.location.pathname.indexOf('/results')) {
                var isva = $cwh.adapters.InSituVideoAdapter.getInstance();
                if (isva) isva.attach();
	    	// }

            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();

        } catch(e) {
            console.log("From: youtube_site_adapter.\nReason: " + e);
            // $kat.trackError({ from: 'youtube_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
	
});
