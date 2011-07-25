/**
 * @package com.watchlr.hosts.espn.adapters
 */

$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.espn.adapters.SiteAdapter", {}, {

    run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: espn_site_adapter. \nReason:" + e);
            $cws.Tracker.trackError({ from: 'espn_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
