/**
 * @package com.watchlr.hosts.espn.adapters
 */

$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.espn.adapters.VideoAdapter", {}, {

	/* @override */
	attach: function() {
        // $cwutil.Logger.debug("Hooking into espn.go.com video api");
        try {
            var original = window.espn.video.play;
            window.espn.video.play = $.proxy(function() {
                try {
                    if (arguments.length > 0) {
                        this._onVideoUrlChange(arguments[0]);
                        original.apply(this, arguments);
                    }
                } catch (e) {
                    $cws.Tracker.trackError({from:"attach of espn's VideoAdapter", msg: "Unable to call espn's original espn.video.play function", exception:e});
                }
            }, this);
        } catch (err) {
            $cws.Tracker.trackError({from:"attach of espn's VideoAdapter", msg: "Unable to wrap espn.video.play function", exception:err});
        }

        this._super();
	},

    _onVideoUrlChange : function(videoId) {
        try {
            // $cwutil.Logger.debug("Video Id found:" + videoId);
            if (this.videos && (this.videos.length == 1)) {
                this.videos[0].url = "http://espn.go.com/video/clip?id=" + videoId;
                this.videos[0].saved = false;
                this.videos[0].tracked = false;

                this._videosFound = this.videos.length;
                $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', this.videos[0].url);

                new $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);

            } else {
                setTimeout($.proxy(function() {
                    var embeds = this._findVideoCandidates();
                    if (embeds)
                        this._findVideos(embeds);

                    if (this.videos && (this.videos.length == 1)) {
                        this.videos[0].url = "http://espn.go.com/video/clip?id=" + videoId;
                        this.videos[0].saved = false;
                        this.videos[0].tracked = false;
                    }
                }, this), 1000);
            }
        } catch (err) {
            $cws.Tracker.trackError({from:"_onVideoUrlChange of espn's VideoAdapter", msg: "Unable to change video URL on video change", exception:err});
        }
    }
});
