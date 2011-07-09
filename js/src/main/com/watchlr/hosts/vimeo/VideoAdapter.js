/**
 * @package com.watchlr.hosts.vimeo.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.vimeo.adapters.VideoAdapter", {}, {

	/* @override */
	attach: function() {
        this._super();
	},

    _findFlashVideos: function(embeds) {
        try {
            this._super(embeds);
            if (this.videos && (this.videos.length == 0)) {
                var div = $('.a').get(0);
                // this.debug('Found div for video:' + div);
                if (div) {
                    var divParent = $(div.parentNode);
                    // this.debug('Found video div parent:' + divParent + " with id:" + divParent.id)
                    if (divParent && divParent.id) {
                        var videoId = /player_([0-9]+)_[0-9]+/i.exec(divParent.id);
                        if (videoId && videoId.length > 1)
                            videoId = videoId[1];
                        // this.debug('Found video ID:' + videoId);
                        if (videoId) {
                            div.watchlrVideoId = (this.videos.length + 1);
                            $(div).mouseenter($.proxy(this._onVideoThumbnailMouseOver, this));
                            $(div).mouseleave($.proxy(this._onVideoThumbnailMouseOut, this));
                            var videoUrl = 'http://www.vimeo.com/' + videoId;
                            this._addVideo(div, videoUrl);
                        }
                    }
                }
            }

            if (this.videos.length > this._videosFound) {
                this._videosFound = this.videos.length;
                /*$kat.track('VideoAdapterEvt', 'SupportedVideoFound', {
                    campaign: $win.location.host
                });*/

                new $ks.WatchlrtRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);

            }
        } catch (err) {
            this.debug("From: _findFlashVideos of vimeo's VideoAdapter..\nReqason: " + err);
            // $kat.trackError({from: "_findFlashVideos of vimeo's VideoAdapter.", exception:err});
        }
    },

    _hasClassName: function(target, classname) {
        var classnames = $(target).attr('class');
        if (classnames) {
            var classnamesarray = classnames.split();
            for (var i = 0; i < classnamesarray.length; i++) {
                // this.debug('class names found:' + classnamesarray);
                if (classname == classnamesarray[i].toLowerCase())
                    return true;
            }
        }

        return false;
    },

    _onVideoThumbnailMouseOver: function(e) {
        try {
            var target = $(e.target);
            while (target && !this._hasClassName(target, 'a')) {
                target = $(target.parentNode);
            }

            this._onVideoElementMouseEnter(target);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOver of vimeo's VideoAdapter.\nReason:" + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOver of vimeo's VideoAdapter.", exception:err});
        }
    },

    _onVideoThumbnailMouseOut: function(e) {
        try {
            var target = $(e.target);
            while (target && !this._hasClassName(target, 'a')) {
                target = $(target.parentNode);
            }

            this._onVideoElementMouseLeave(target);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOut of vimeo's VideoAdapter.\nReason:" + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOut of vimeo's VideoAdapter.", exception:err});
        }
    }
});