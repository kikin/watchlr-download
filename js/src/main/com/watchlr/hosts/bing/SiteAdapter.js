/**
 * @package com.watchlr.hosts.bing.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.bing.adapters.SiteAdapter", {}, {

	run: function() {
		try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: bing_site_adapter. \nReason:" + e);
            // $kat.trackError({ from: 'bing_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
	
});
