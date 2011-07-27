/**
 * @package com.watchlr.hosts.yahoo.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.yahoo.adapters.VideoAdapter", {}, {
	/* @override */
	attach: function() {
        this._super();
	},

    _findVideoCandidates: function() {
        // $cwutil.Logger.debug('Finding video elements on yahoo page.');
        $('ul.c-thumb.video li').each($.proxy(this._addWatchlrVideoBorder, this));
        return this._super();
    },

    _addWatchlrVideoBorder: function(pos, img) {
        try {
            var videoUrl = this.getVideoUrl(img);
            // $cwutil.Logger.debug("URL for image element:" + videoUrl);
            if (videoUrl) {
                for (var i = 0; i < this.services.length; i++) {
                    if (!this.services[i].url_regex)
                        continue;
                    var match = {passed: false};
                    this._extractId(videoUrl, this.services[i].url_regex, match);
                    if (match.passed && match.video_id && match.video_id.length > 1) {
                        if (typeof(this.services[i].url) == 'function') {
                            videoUrl = this.services[i].url(match.video_id);
                        } else {
                            videoUrl = this.services[i].url + match.video_id[1];
                        }

                        if (videoUrl) {
                            this._addVideo(img, videoUrl);
                            this._listenThumbnailEvents(img);
                        }
                    }
                }
            }
        } catch (err) {
            $cws.Tracker.trackError({from: "_addWatchlrVideoBorder of Yahoo Video adapter.", exception:err});
        }
    },

    _listenThumbnailEvents: function(videoElement) {
        $(videoElement).mouseover($.proxy(this._onVideoThumbnailMouseOver, this));
        $(videoElement).mouseleave($.proxy(this._onVideoThumbnailMouseOut, this));
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
                // $cwutil.Logger.debug('href: ' + href);
                // $cwutil.Logger.debug('params: ' + params);
                // $cwutil.Logger.debug('rurl: ' + params[rurl]);
                // $cwutil.Logger.debug('url: ' + url);
                return url;
            }
        } catch (err) {
            $cws.Tracker.trackError({from: "getVideoUrl of yahoo's search VideoAdapter", exception:err});
        }
        // alert(link);
        return null;
    },

    _onVideoThumbnailMouseOver : function(e) {
        try {
            // var target = e.target;
            var target = $(e.target).parents('li').get(0);
            // $cwutil.Logger.debug('Mouse over target: ' + target);
            this._onVideoElementMouseEnter(target);
        } catch (err) {
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOver of yahoo's search VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailMouseOut : function(e) {
        try {
            var target = e.target;
            this._onVideoElementMouseLeave(target);
        } catch (err) {
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOut of yahoo's search VideoAdapter", exception:err});
        }
    }
});
