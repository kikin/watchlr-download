/**
 * @package com.watchlr.hosts.vimeo.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.vimeo.adapters.SiteAdapter", {}, {
	
	run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: vimeo_site_adapter.\nReason: " + e);
            $cws.Tracker.trackError({ from: 'vimeo_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
