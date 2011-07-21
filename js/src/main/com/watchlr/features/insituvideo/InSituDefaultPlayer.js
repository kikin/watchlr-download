/**
 * @package com.watchlr.features.insituvideo
 */

$.Class.extend("com.watchlr.features.insituvideo.InSituDefaultPlayer", {}, {
	
	_src: null,
	_swiff: null,
    _element: null,
	
	init: function(options) {
        this._element = $('<div style="height:100%; width:100%;"></div>');
        /*this.parent('div', {
			style: 'height:100%; width:100%;',
			document: options.document
		});*/
		
		this._src = options.data.src;
		
		// add default swiff inside
        if (options.data.vars) {
            $(this._element).flash({
                swf: this._src,
                width: '100%',
                height: '100%',
                flashvars: options.data.vars
            });
        } else {
            $(this._element).flash({
                swf: this._src,
                width: '100%',
                height: '100%'
            });
        }

	},

    appendTo: function(elem) {
        $(this._element).appendTo($(elem));
    },

    remove: function() {
        $(this._element).remove();
    }

});
