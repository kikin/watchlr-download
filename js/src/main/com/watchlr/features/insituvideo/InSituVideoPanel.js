/**
 * @package com.watchlr.features.insituvideo
 */
$.Class.extend("com.watchlr.features.insituvideo.InSituVideoPanel", {
    openedInstance : null
}, {
	player: null,
	infos: null,
	loader: null,
	_element: null,
	
	init: function(options) {
        try {
            $('<div id="watchlrIsvfContainer"></div>').prependTo($(options.document.body));
            this._element = $('#watchlrIsvfContainer');
            $(this._element).html($cws.html['InSituVideoMarkup']);

            $cwutil.Styles.addCSSHelperClasses(this._element);
            $cwutil.Styles.insert('InSituVideoPopupStyles', options.document);

            $(this._element).hide();
            this.setContainerEvents();
        } catch (err) {
            $cws.Tracker.trackError({from: 'init of InSituVideoPanel', msg: '', exception: err});
        }
	},
	
	isOpen: function() {
		var visibility = $(this._element).css('display');
        return visibility && visibility != 'none';
	},
	
	setInfos: function(infos) {
		this.infos = infos;
	},
	
	setPlayer: function(player) {
		this.player = player;
	},	
	
	setContainerEvents: function() {
        try {
            // add the action on the close button
            $($(this._element).find('.watchlrIsvfxBtn')).click($.proxy(this.onClickClose, this));

            // add the action on the "watch on youtube"
            $($(this._element).find('.watchlrIsvfsrcRef')).click($.proxy(this.onClickGoToWebsite, this));
        } catch (err) {
            $cws.Tracker.trackError({from: 'setContainerEvents of InSituVideoPanel', msg: '', exception: err});
        }
	},
	
	onClickClose: function(e) {
		try {
            e.stopPropagation();
            this.close();
        } catch (err) {
            $cws.Tracker.trackError({from: 'onClickClose of InSituVideoPanel', msg: '', exception: err});
        }
	},
	
	onClickGoToWebsite: function(e) {
		try {
            e.stopPropagation();

            $cws.Tracker.track('VideoAdapterEvt', 'ClickThroughVideoPlayer', this.infos.url);

            window.open(this.infos.url, '_balnk');

        } catch (err) {
            $cws.Tracker.trackError({from: 'onClickGoToWebsite of InSituVideoPanel', msg: '', exception: err});
        }

	},

    /**
     * Make dialog visible in viewport.
     */
    _makeInSituPlayerVisibleInViewPort: function() {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(this._element).offset().top;
        var elemBottom = elemTop + $(this._element).height();

        if (elemBottom >= docViewBottom) {
            $(window).scrollTop(docViewTop + (elemBottom - docViewBottom) + 20);
        }
    },
	
	open: function(clickSrc) {
		this._element.show();
		
		// close other instances so we only have one displayed
		var thisStatic = $cwf.insituvideo.InSituVideoPanel;
		if (thisStatic.openedInstance && thisStatic.openedInstance != this && thisStatic.openedInstance.isOpen()) {
			thisStatic.openedInstance.close();
		}
		thisStatic.openedInstance = this;
		
		// change the text/links displayed
		var infos = this.infos;
		if (infos) {
			$($(this._element).find('.watchlrIsvfTitle strong')).html(infos.title);
			$($(this._element).find('.watchlrIsvfsrcRef')).attr('href', infos.url);
			$($(this._element).find('.watchlrRtng')).html(infos.rating);
			$($(this._element).find('.watchlrIsvHostName')).html(infos.hostName);
		} else {
			// TODO: hide the right bar
		}
		
		// inject the player
		$($(this._element).find('div[id=watchlrIsvfPlayer]')).html('');
		this.player.appendTo($(this._element).find('div[id=watchlrIsvfPlayer]'));

		this.show();
        this._makeInSituPlayerVisibleInViewPort();

		// track that
		// $kat.f_clk('InSituVideo', this.infos.url, (clickSrc?clickSrc:'image'), this.infos.partnerId);
	},
	
	close: function() {
		this.player.remove();
		this.hide();

	},
	
	hide: function() {
		this._element.fadeOut();
		this._element.trigger('close');
	},
	
	show: function() {
		this._element.show();
		// this.fireEvent('show');
	},
	
	css: function(prop, propVal) {
        if (!propVal) {
            return $(this._element).css(prop);
        } else {
            $(this._element).css(prop, propVal);
        }
    }
});
