/**
 * @package com.watchlr.hosts.cnn.adapters
 */

$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.cnn.adapters.SiteAdapter", {}, {

    run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: cnn_site_adapter. \nReason:" + e);
            $cws.Tracker.trackError({ from: 'cnn_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
