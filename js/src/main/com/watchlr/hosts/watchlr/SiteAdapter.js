/**
 * @package com.watchlr.hosts.watchlr.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.watchlr.adapters.SiteAdapter", {}, {
	
	run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: watchlr_site_adapter.\nReason: " + e);
            // $kat.trackError({ from: 'vimeo_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
