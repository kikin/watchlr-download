/**
 * @package com.watchlr.hosts.cnn.adapters
 */

$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.cnn.adapters.VideoAdapter", {}, {

	/* @override */
	attach: function() {
        //if (/cnn\.com\/video/.test(window.document.location.href)) {
            // $cwutil.Logger.debug("Hooking into cnn.com/video api");
            try {
                if (window.CVP && window.CVP.onCallback) {
                    // for (var i in window.CVP.instances) {
                        var original = window.CVP.onCallback;
                        window.CVP.onCallback = $.proxy(function(id, args) {
                            try {
                                // alert(args[0]);
                                if (args[0] == 'onContentBegin') {
                                    // alert('Video changed for video element: ' + id + ' and video id: ' + args[2]);
                                    // alert(this);
                                    this._onVideoUrlChange(id, args[2]);
                                    // alert('Called on _onVideoUrlChange.');
                                }
                                return original(id, args);
                            } catch (e) {
                                // alert("From: attach of cnn's VideoAdapter.\nReason:" + e);
                                $cws.Tracker.trackError({from:"attach of cnn's VideoAdapter", msg: "Unable to call cnn's original onContentBegin callback", exception:e});
                            }
                        }, this);
                    // }
                }

            } catch (err) {
                $cws.Tracker.trackError({from:"attach of cnn's VideoAdapter", msg: "Unable to wrap onContentBegin callback", exception:err});
            }
        // }
        this._super();
	},

    /**
    * find all the videos on the page
    */
    /*_findVideoCandidates: function() {
        var embeds = this._super();

        var images = $('img');
        // $cwutil.Logger.debug('Found ' + images.length + ' images');
        for (var i = 0; i < images.length; i++) {
            embeds.push(images[i]);
        }

        return embeds;
    },*/

    _onVideoUrlChange : function(target, videoId) {

        try {
            // alert('Changed video id:' + videoId + " for target:" + target);
            if (this.videos) {
                var embed = document.getElementById(target);
                // alert('embed: ' + embed + '\nwatchlr video id:' + embed.watchlrVideoId);
                if (embed) {
                    if (embed.watchlrVideoId) {
                        // alert("Video id associated with changed video target:" + embed.watchlrVideoId);
                        this.videos[embed.watchlrVideoId - 1].url = "http://www.cnn.com/video/?/video/" + videoId;
                        this.videos[embed.watchlrVideoId - 1].saved = false;
                        this.videos[embed.watchlrVideoId - 1].tracked = false;

                        this._videosFound = this.videos.length;
                        $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', this.videos[embed.watchlrVideoId -1].url);

                        new $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);
                    } else {
                        // alert('Adding new video.');
                        var videoUrl = "http://www.cnn.com/video/?/video/" + videoId;
                        this._addVideo(embed, videoUrl);

                        if (this.videos.length > this._videosFound) {
                            this._videosFound = this.videos.length;
                            $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', videoUrl);

                            $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);
                        }
                    }
                }
            }
        } catch (err) {
            $cws.Tracker.trackError({from:"_onVideoUrlChange of cnn's VideoAdapter", msg: "Unable to change video URL on video change", exception:err});
        }
    }
});
