/**
 * @package com.watchlr.features.insituvideo
 */
$.Class.extend("com.watchlr.features.insituvideo.InSituVideoPanel", {
    openedInstance : null
}, {
	animate: true,
	player: null,
	infos: null,
	loader: null,
	_element: null,
	
	init: function(options) {
        try {
            $('<div id="watchlrIsvfContainer"></div>').prependTo($(options.document.body));
            this._element = $('#watchlrIsvfContainer');
            $(this._element).html($cws.html['InSituVideoMarkup']);
            /*this.parent('div', {
                id: 'kikinIsvfContainer',
                html: $ku.Localize.apply($ks.html.InSituVideoMarkup, 'InSituVideoFeature'),
                document: options.document
            });*/

            $cwutil.Styles.addCSSHelperClasses(this._element);
            $cwutil.Styles.insert('InSituVideoPopupStyles', options.document);

            $(this._element).hide();
            // this.inject(options.document.body, 'top');

            this.setAnimate(true);
            this.setContainerEvents();
        } catch (err) {
            console.log("From: init of InSituVideoPanel. \nReason: " + err);
            // $kat.trackError({from: 'init of InSituVideoPanel', msg: '', exception: err});
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
	
	setAnimate: function(animate) {
		this.animate = animate;
		$($(this._element).find('div[id=watchlrIsvfWrapper]')).css('top', (animate ? -348 : 0) + 'px');
	},
	
	setContainerEvents: function() {
        try {
            // add the action on the close button
            $($(this._element).find('.watchlrIsvfxBtn')).click($.proxy(this.onClickClose, this));

            // add the action on the "watch on youtube"
            $($(this._element).find('.watchlrIsvfsrcRef')).click($.proxy(this.onClickGoToWebsite, this));
        } catch (err) {
            console.log("From: setContainerEvents of InSituVideoPanel. \nReason: " + err);
            // $kat.trackError({from: 'setContainerEvents of InSituVideoPanel', msg: '', exception: err});
        }
	},
	
	onClickClose: function(e) {
		try {
            e.stopPropagation();
            this.close();
        } catch (err) {
            console.log("From: onClickClose of InSituVideoPanel. \nReason: " + err);
            // $kat.trackError({from: 'onClickClose of InSituVideoPanel', msg: '', exception: err});
        }
	},
	
	onClickGoToWebsite: function(e) {
		try {
            e.stopPropagation();

            /*$ka.Tracker.track('Video', 'ClickThroughVideoPlayer', {
                    kpi: $ks.View.getCurrentKpi(),
                    sync: true,
                    feature: this.infos.url
                });*/

            window.location = this.infos.url;

        } catch (err) {
            console.log("From: onClickGoToWebsite of InSituVideoPanel. \nReason: " + err);
            // $kat.trackError({from: 'onClickGoToWebsite of InSituVideoPanel', msg: '', exception: err});
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
		// only for smarclipvideo
		// if (this.player.play) this.player.play(435, 240);
		
		// do the sliding animation
		if (this.animate) {
			/*$($(this._element).find('div[id=watchlrIsvfWrapper]')).animate({
                'left' : $(this._element).css('left'),
                'top': ($(this._element).css('top') + $(this._element).css('height')),
                'link': 'cancel'
            }, 1000, 'linear', $.proxy(this.onShowAnimComplete, this));*/
            this.show();
		}
		
		// track that
		// $kat.f_clk('InSituVideo', this.infos.url, (clickSrc?clickSrc:'image'), this.infos.partnerId);
	},
	
	close: function() {
		this.player.remove();
		// do the sliding animation
		if (this.animate) {
			/*$($(this._element).find('div[id=watchlrIsvfWrapper]')).animate({
                'top': "-=348",
                'link': 'cancel'
            }, 1000, 'linear', $.proxy(this.onHideAnimComplete, this));*/
            this.hide();
		} else {
			this.hide();
		}
	},
	
	hide: function() {
		this._element.fadeOut();
		this._element.trigger('close');
	},
	
	show: function() {
		this._element.show();
		// this.fireEvent('show');
	},
	
	onHideAnimComplete: function() {
		this.hide();
		// this.fireEvent('hideAnimComplete');
	},
	
	onShowAnimComplete: function() {
		// this.fireEvent('showAnimComplete');
	},

    css: function(prop, propVal) {
        if (!propVal) {
            return $(this._element).css(prop);
        } else {
            $(this._element).css(prop, propVal);
        }
    }
});