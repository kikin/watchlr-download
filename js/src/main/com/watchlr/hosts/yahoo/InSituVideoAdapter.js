/**
 * @package com.watchlr.hosts.yahoo.adapters
 */
$cwh.adapters.InSituVideoAdapter.extend("com.watchlr.hosts.yahoo.adapters.InSituVideoAdapter", {}, {
	_stats: null,
	
	attach: function() {
        try {
            this._stats = $cwh.adapters.InSituVideoAdapter.stats.reset();

            // add needed styles
            $cwutil.Styles.insert('InSituVideoStyles', document);

            // look the page for video images
            $('ul.c-thumb.video li').each($.proxy(this._addVideoPlayback, this));

            // track unsupported domains
            if (this._stats.unsupportedDomains.length > 0) {
                $cws.Tracker.track('VideoAdapterEvt','UnsupportedInSitu', this._stats.unsupportedDomains.join(','));
            }

        } catch (err) {
            $cws.Tracker.trackError({from: 'attach of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	},

	_addVideoPlayback: function(pos, videoDiv) {
    	try {
            if ($(videoDiv).parents('a').prev('.watchlrIsvGoogleOverlay').get(0))
                return;

            // get the host config (fails if not compatible)
            var videoUrl = this.getVideoUrl(videoDiv),
                supportedHosts = $cwc.FeaturesConfig.plugins.InSituVideoFeature.config.supportedHosts,
                hostConfig = videoUrl ? supportedHosts[$cwutil.Url.getHostName(videoUrl)] : null;

            // $cwutil.Logger.debug('videoUrl: ' + videoUrl);
            // $cwutil.Logger.debug('supportedHosts: ' + supportedHosts);
            // $cwutil.Logger.debug('hostConfig: ' + hostConfig);

            if (!hostConfig) {
                this._stats.notSupported++;
                if (videoUrl) this._stats.unsupportedDomains.push($cwutil.Url.getHostName(videoUrl));
                return;
            }

            // create our little beautiful icon
            var name = hostConfig.name; // .toString();
            // $cwutil.Logger.debug('name: ' + name);

            var imgLink = $(videoDiv).find('.thm').get(0);

            // Create button overlay
            var overlay = $('<div class="watchlrIsvOverlay watchlrIsvGoogleOverlay"></div>').insertBefore(imgLink);
                /*overlay = new Element('div', {
                    'class': 'kikinIsvOverlay kikinIsvGoogleOverlay'
                }).inject(img.getParent('a'), 'before'),*/

            var button = $('<div class="watchlrIsvButton"></div>').appendTo(overlay);
                /*button = new Element('div', {
                    'class': 'kikinIsvButton'
                }).inject(overlay),*/

            var arrow = $('<div class="watchlrIsvOverlayArrow"></div>').appendTo(button);
                /*arrow = new Element('div', {
                    'class': 'kikinIsvOverlayArrow'
                }).inject(button);                 */

            var SMALL_THUMB_X = 73,
                SMALL_THUMB_Y = 58,
                BORDER_RAD = 2;

            overlay.css({
                width: videoDiv.offsetWidth,
                height: videoDiv.offsetHeight
            });

            button.css({
                'margin-top': (parseInt(button.css('marginTop')) + img.offsetHeight - SMALL_THUMB_Y - BORDER_RAD * 2) + 'px',
                'margin-left': (parseInt(button.css('marginLeft')) + img.offsetWidth - SMALL_THUMB_X - BORDER_RAD * 2) + 'px'
            });

            $cwutil.Styles.addCSSHelperClasses(button);
            var handler = $.proxy(this.onClickVideoThumbnail, this);

            // Remove yahoo's overlay play button
			$(imgLink).find('em').remove();

            // Attach event to button for video play
            overlay.click(handler);

            this._stats.supported++;

        } catch (err) {
            $cws.Tracker.trackError({from: '_addVideoPlayback of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	},

	getVideoUrl: function(videoDiv) {
        // try to get the link
        try {
            var link = $(videoDiv).find('a');
            // $cwutil.Logger.debug('Link: ' + link);
            if(link) {
                // get rurl parameter
                var href = decodeURIComponent($(link).attr('href')),
                        params = $cwutil.String.parseQueryString(href),
                        url = (params && params.rurl) ? decodeURIComponent(params.rurl.replace(/&amp;/g, '&')) : null;
                return url;
            }
        } catch (err) {
            $cws.Tracker.trackError({from: "getVideoUrl of yahoo's search InSituVideoAdapter", exception:err});
        }
        // alert(link);
        return null;
	},

    onClickVideoThumbnail: function(e) {
	    try {
            // e.stopPropagation();

            // create once the video panel that will show the videos
            if (!this.videoPanel) {
                this.videoPanel = new $cwf.insituvideo.InSituVideoPanel({
                    document: document
                });
            }

            // get some infos
            var videoDiv = $(e.target).parents('li').get(0),
	    	imgLink = $(videoDiv).find('.thm').get(0),
	    	img = $(imgLink).find('img').get(0),
	    	elTitle = $(videoDiv).find('a:not(.thm)').get(0),
	    	url = this.getVideoUrl(videoDiv),
            supportedHosts = $cwc.FeaturesConfig.plugins.InSituVideoFeature.config.supportedHosts,
	        hostConfig = url ? supportedHosts[$cwutil.Url.getHostName(url)] : null;

            $cws.Tracker.track('Video','instu-view', url);

            // set infos in the right panel
            this.videoPanel.setInfos({
                title: $(elTitle).text(),
                rating: '',
                // partnerId: $kf.core.FeaturesDisplayNames.ids.ORGANIC,
                hostName: hostConfig.name,
                url: url
            });

            // set the player
            this.videoPanel.setPlayer(
                new $cwf.insituvideo.InSituDefaultPlayer({
                    data: $cwf.insituvideo.InSituVideoFeature.getSwiffData(url),
                    document: document
                })
            );

            var imgHeight = $(imgLink).height() || 90;
            /*var relElement = $('#watchlr_top') || $('#center_col') || $(document.body);
            $cwutil.Logger.debug("relElement:" + relElement);
            $cwutil.Logger.debug("$(relElement).offset():" + relElement.position(document.body));*/

            this.videoPanel.css('left', $(imgLink).offset().left);
            this.videoPanel.css('top', $(imgLink).offset().top + imgHeight);

            // show the panel and start playing
            this.videoPanel.open();
        } catch (err) {
            $cws.Tracker.trackError({from: 'onClickVideoThumbnail of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	}

});
