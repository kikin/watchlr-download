/**
 * @package com.watchlr.hosts.yahoo.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.yahoo.adapters.SiteAdapter", {}, {
	
	run: function() {
		try {
            var isva = new $cwh.adapters.InSituVideoAdapter.getInstance();
            if (isva) isva.attach();

            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            $cws.Tracker.trackError({ from: 'yahoo_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
