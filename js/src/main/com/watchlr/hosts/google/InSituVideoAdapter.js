/**
 * @package com.watchlr.hosts.google.adapters
 */
$cwh.adapters.InSituVideoAdapter.extend("com.watchlr.hosts.google.adapters.InSituVideoAdapter", {}, {
	_stats: null,
	
	attach: function() {
        try {
            this._stats = $cwh.adapters.InSituVideoAdapter.stats.reset();

            // add needed styles
            $cwutil.Styles.insert('InSituVideoStyles', document);

            // look the page for video images
            $('#res li.videobox a img[id*=vidthumb]').each($.proxy(this._addVideoPlayback, this));
            //single video result - http://www.google.com/search?hl=en&q=ducati+696
            $('#res table a img[id*=vidthumb]').each($.proxy(this._addVideoPlayback, this));

            // track unsupported domains
            if (this._stats.unsupportedDomains.length > 0) {
                $cws.Tracker.track('VideoAdapterEvt','UnsupportedInSitu', this._stats.unsupportedDomains.join(','));
            }
        } catch (err) {
            console.log("From: attach of Google search InSituVideoAdapter. \nReason: " + err);
            $cws.Tracker.trackError({from: 'attach of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	},

	_addVideoPlayback: function(pos, img) {
    	try {
            if ($(img).parents('a').prev('.watchlrIsvGoogleOverlay').get(0))
                return;

            // get the host config (fails if not compatible)
            var videoUrl = this.getVideoUrl(img),
                supportedHosts = $cwc.FeaturesConfig.plugins.InSituVideoFeature.config.supportedHosts,
                hostConfig = videoUrl ? supportedHosts[$cwutil.Url.getHostName(videoUrl)] : null;

            // console.log('videoUrl: ' + videoUrl);
            // console.log('supportedHosts: ' + supportedHosts);
            // console.log('hostConfig: ' + hostConfig);

            if (!hostConfig) {
                this._stats.notSupported++;
                if (videoUrl) this._stats.unsupportedDomains.push($cwutil.Url.getHostName(videoUrl));
                return;
            }

            // create our little beautiful icon
            var name = hostConfig.name; // .toString();
            // console.log('name: ' + name);

            // Create button overlay
            var overlay = $('<div class="watchlrIsvOverlay watchlrIsvGoogleOverlay"></div>').insertBefore($(img).parents('a'));
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
                width: img.offsetWidth,
                height: img.offsetHeight
            });

            button.css({
                'margin-top': (parseInt(button.css('marginTop')) + img.offsetHeight - SMALL_THUMB_Y - BORDER_RAD * 2) + 'px',
                'margin-left': (parseInt(button.css('marginLeft')) + img.offsetWidth - SMALL_THUMB_X - BORDER_RAD * 2) + 'px'
            });

            var handler = $.proxy(this.onClickVideoThumbnail, this);
            var googleLink = overlay.next();
            $(googleLink).unbind('click');
            $(googleLink).click(handler);
            var googlePlay = $(googleLink).find('.play_icon');

            // $ku.Element.setBrowserClasses(button);
            $cwutil.Styles.addCSSHelperClasses(button);

            // Remove google's overlay play button and insert new watchlr button
            if ($(img).next()) $($(img).next()).remove();
            if (googlePlay) $(googlePlay).css('background', 'none');

            // Attach event to button for video play
            overlay.click(handler);

            this._stats.supported++;
        } catch (err) {
            console.log("From: _addVideoPlayback of Google search InSituVideoAdapter. \nReason: " + err);
            $cws.Tracker.trackError({from: '_addVideoPlayback of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	},

	getVideoUrl: function(img) {
        // console.log('Image element received:' + img);
		var imgParentTable = $(img).parents('a').get(0);

        // console.log('Image element parent: ' + imgParentTable);
		if(imgParentTable) {
            var url = imgParentTable.href,
                videoUrl = /url\?url=(.*)&rct=/i.exec(url);

            // console.log('Anchor element URL:' + url);
            // console.log('Video url:' + videoUrl);
            if (videoUrl && videoUrl.length > 1) {
                return decodeURIComponent(videoUrl[1]);
            }
        }

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
            var elContainer = $(e.target).parents('table').get(0),
                elInfoContainer = $(elContainer).find('td:last-child'),
                elRating = $(elInfoContainer).find('font'),
                elTitle = $(elContainer).find('a.l'),
                elVideoLink = $(elContainer).find('td a'),
                elVideoImg = $(elContainer).find('td a img'),
                videoUrl = this.getVideoUrl(elVideoImg),
                supportedHosts = $cwc.FeaturesConfig.plugins.InSituVideoFeature.config.supportedHosts,
                hostConfig = videoUrl ? supportedHosts[$cwutil.Url.getHostName(videoUrl)] : null;

            // set infos in the right panel
            this.videoPanel.setInfos({
                title: $(elTitle).html(),
                rating: '',
                // partnerId: $kf.core.FeaturesDisplayNames.ids.ORGANIC,
                hostName: hostConfig.name,
                url: $(elTitle).attr('href')
            });

            // set the player
            this.videoPanel.setPlayer(
                new $cwf.insituvideo.InSituDefaultPlayer({
                    data: $cwf.insituvideo.InSituVideoFeature.getSwiffData($(elVideoImg).parents('a')),
                    document: document
                })
            );

            var imgHeight = $(elVideoImg).height() || 66;
            /*var relElement = $('#watchlr_top') || $('#center_col') || $(document.body);
            console.log("relElement:" + relElement);
            console.log("$(relElement).offset():" + relElement.position(document.body));*/

            this.videoPanel.css('left', $(elVideoImg).offset().left);
            this.videoPanel.css('top', $(elVideoImg).offset().top + imgHeight);

            // show the panel and start playing
            this.videoPanel.open();
        } catch (err) {
            console.log("From: onClickVideoThumbnail of Google search InSituVideoAdapter. \nReason: " + err);
            $cws.Tracker.trackError({from: 'onClickVideoThumbnail of Google search InSituVideoAdapter', msg: '', exception: err});
        }
	}

});
