/**
 * @package com.watchlr.hosts.orkut.adapters
 */
$cwh.adapters.SiteAdapter.extend("com.watchlr.hosts.orkut.adapters.SiteAdapter", {}, {

	run: function() {
		// our callback function everytime the page changes
		var fn = $.proxy(function() { this.injectIntoCommunityPage.delay(1000, this); }, this);
		
		// check for hash changes
		if ($.browser.msie) window.document.body.onhashchange = fn;
		else if ($.browser.mozilla || $.browser.webkit) window.addEventListener('hashchange', fn, false);
		
		// inject in this page
		fn();
	},
	
	injectIntoCommunityPage: function() {
		try {
            var kva = $cwh.adapters.VideoAdapter.getInstance();
            if (kva) kva.attach();
        } catch(e) {
            // alert("From: orkut_site_adapter.\nReason: " + e);
            // $kat.trackError({ from: 'orkut_site_adapter', exception: e, msg: 'unable to create video adapter'});
        }
	}
			
});
