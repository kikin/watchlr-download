/**
 * @package com.watchlr.hosts.youtube.adapters
 */
$cwh.adapters.InSituVideoAdapter.extend("com.watchlr.hosts.youtube.adapters.InSituVideoAdapter", {}, {
	attach: function() {
        try {
            console.log("Get called in youtube insitu video adapter");

            // add needed styles
            $cwutil.Styles.insert('InSituVideoStyles', document);

            // look for videos on search page
            $('a.ux-thumb-wrap').each($.proxy(this._addVideoPlayback, this));

            // look for side panel recommended videos
            $('a.video-list-item-link').each($.proxy(this._addVideoPlayback, this));

        } catch (err) {
            console.log("From: attach of Youtube search InSituVideoAdapter. \nReason: " + err);
            // $kat.trackError({from: 'attach of Youtube search InSituVideoAdapter', msg: '', exception: err});
        }
	},

	_addVideoPlayback: function(pos, link) {
    	try {
            // console.log('link.href: ' + link.href);
            // is this link useful?
        	var match = link.href.match(/watch\?(.*)/);
            if (!match || match.length == 0) return;

        	// is there a action menu?
        	var actions = $(link).find('.video-actions').get(0);
            // console.log('actions: ' + actions);
        	if (!actions) return;

            var handler = $.proxy(this.onClickVideoThumbnail, this);
            var overlayButton = $($cws.html['YoutubeOverlayButton']);
            $(actions).prepend(overlayButton);
            $(overlayButton).click(handler);

            var elContainer = null,
                elVideoImg = null;
             // case1: result page videos
            if (elContainer = $(overlayButton).parents('.result-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case2: watch page videos
            } else if (elContainer = $(overlayButton).parents('.video-list-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case3: homepage
            } else if (elContainer = $(overlayButton).parents('.video-entry').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
            }

            if (elVideoImg) {
                $(elVideoImg).unbind('click');
                $(elVideoImg).parents('a').unbind('click');
                $(elVideoImg).click(handler);
            }

        } catch (err) {
            console.log("From: _addVideoPlayback of Youtube search InSituVideoAdapter. \nReason: " + err);
            // $kat.trackError({from: '_addVideoPlayback of Youtube search InSituVideoAdapter', msg: '', exception: err});
        }
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
            var elContainer = null,
                videoUrl = null,
                videoTitle = null,
                target = e.target;

            // console.log('target: ' + target);

            // case1: result page videos
            if (elContainer = $(target).parents('.result-item').get(0)) {
                var elTitle = $(elContainer).find('h3 a').get(0),
                    elVideoImg = $(elContainer).find('.video-thumb img').get(0);

                videoUrl = $(elTitle).attr('href');
                videoTitle = $(elTitle).html();

            // case2: watch page videos
            } else if (elContainer = $(target).parents('.video-list-item').get(0)) {
                var elTitle = $(elContainer).find('span.title').get(0),
                    elVideoLink = $(elContainer).find('a.video-list-item-link').get(0),
                    elVideoImg = $(elContainer).find('.video-thumb img').get(0);

                videoUrl = $(elVideoLink).attr('href');
                videoTitle = $(elTitle).html();

            // case3: homepage
            } else if (elContainer = $(target).parents('.video-entry').get(0)) {
                 var elTitle = $(elContainer).find('div.video-short-title a').get(0),
                    elVideoImg = $(elContainer).find('.video-thumb img').get(0);

                videoUrl = $(elTitle).attr('href');
                videoTitle = $(elTitle).html();
            } else {
                return;
            }

            // console.log('Video URL: ' + videoUrl);
            // console.log('Video Title: ' + videoTitle);
            // console.log('Video Title: ' + videoTitle);

            // set infos in the right panel
            this.videoPanel.setInfos({
                title: videoTitle,
                rating: '',
                // partnerId: $kf.core.FeaturesDisplayNames.ids.ORGANIC,
                hostName: 'Youtube',
                url: videoUrl
            });

            var videoId = $cwutil.String.parseQueryString(videoUrl.match(/watch\?(.*)/)[1]).v,
			src = 'http://www.youtube.com/v/'+videoId+'?border=0&fs=1&autoplay=1';

            // set the player
            this.videoPanel.setPlayer(
                new $cwf.insituvideo.InSituDefaultPlayer({
                    data: {
                        src: src,
                        vars: { autoplay: true }
                    },
                    document: document
                })
            );

            var imgWidth = $(elVideoImg).width(),
    		imgHeight = $(elVideoImg).height() || 66,
    		winWidth = $(window).width(),
    		imgPosX = $(elVideoImg).offset().left,
    		left = (imgPosX + 660 < winWidth) ? imgPosX : winWidth - 660 - 20,
    		top = $(elVideoImg).offset().top + imgHeight;


            this.videoPanel.css('left', left);
            this.videoPanel.css('top', top);

            // show the panel and start playing
            this.videoPanel.open();

            return false;
        } catch (err) {
            console.log("From: onClickVideoThumbnail of Youtube search InSituVideoAdapter. \nReason: " + err);
            // $kat.trackError({from: 'onClickVideoThumbnail of Youtube search InSituVideoAdapter', msg: '', exception: err});
        }
	}

});