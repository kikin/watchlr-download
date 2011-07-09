/**
 * @package com.watchlr.hosts.cbsnews.adapters
 */

$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.cbsnews.adapters.SiteAdapter", {}, {

    run: function() {
        try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: cbs_news_site_adapter. \nReason:" + e);
            //$kat.trackError({ from: 'cbs_news_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
});
