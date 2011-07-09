/**
 * @package com.watchlr.hosts.defaultEngine.adapters
 */

$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.defaultEngine.adapters.SiteAdapter", {}, {

	init: function() {
    },

	run: function() {

        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("from: default_site_adapter. \nReason:" + e);
            // $kat.trackError({ from: 'default_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});

