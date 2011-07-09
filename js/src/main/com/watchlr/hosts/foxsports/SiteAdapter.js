/**
 * @package com.watchlr.hosts.foxsports.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.foxsports.adapters.SiteAdapter", {}, {
	run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: fox_sports_site_adapter. \nReason: " + e);
            // $kat.trackError({ from: 'fox_sports_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
