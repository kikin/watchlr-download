/**
 * @package com.watchlr.hosts.adapters
 */
$.Class.extend("com.watchlr.hosts.adapters.InSituVideoAdapter", {
    getInstance : function() {
        if (!this._instance) {
            var adapter = $cws.services.getService('HostService').getAdapter('InSituVideoAdapter');
            this._instance = adapter ? new adapter() : null;
        }

        return this._instance;
    },

    stats : {
        reset: function() {
            this.supported = 0;
            this.notSupported = 0;
            this.unsupportedDomains = [];
            return this;
        },
        toLogString: function() {
            if (this.supported == 0 && this.notSupported == 0) {
                return '';
            } else {
                return 'InSituVideoFeature:'+
                        'organic='+(this.supported+this.notSupported)+
                        ',organic_annotated='+this.supported;
            }
        },
        supported: 0,
        notSupported: 0,
        unsupportedDomains: []
    }
}, {
	attach: function() {}
});