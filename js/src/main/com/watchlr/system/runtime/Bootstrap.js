/**
 * @package com.watchlr.system.runtime
 * @author kapil@watchlr.com
 */

$.Class.extend('com.watchlr.system.runtime.Bootstrap', {}, {

	run: function() {
        try {
            $cwss = $cws.services = new $cws.ServiceDaemon();
            $cws.controllers = {};
            $cws.controllers.HostController = new com.watchlr.hosts.HostController();

	    	var ksa = $cwh.adapters.SiteAdapter.getInstance();
            if (ksa)
                ksa.run();
    	} catch(e) {
            // $cwutil.Logger.debug("from: bootstrap. \nReason:" + e);
    		// $cwat.trackError({ from: 'bootstrap', exception: e, msg: 'SiteAdapter failed'});
    	}
    }

});