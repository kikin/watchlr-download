/**
 * @package com.watchlr.hosts.adapters
 * Site specific stuff
 */

$.Class.extend("com.watchlr.hosts.adapters.SiteAdapter", {
    getInstance: function() {
        try {
            if (!this._instance) {
                var adapter = $cws.services.getService('HostService').getAdapter('SiteAdapter');
                this._instance = adapter ? new adapter() : null;
            }

            return this._instance;
        }
        catch (err) {}
    }
}, {

});