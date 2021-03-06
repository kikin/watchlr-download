/**
 * @package com.watchlr.hosts.cbsnews.adapters
 */

$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.cbsnews.adapters.VideoAdapter", {}, {

	/* @override */
	attach: function() {
        // $cwutil.Logger.debug("Hooking into CBS news video api");
        this._super();
	},

    /**
    * find all the videos on the page
    */
    _findVideoCandidates: function() {
        var embeds = this.parent();

        try {
            if (!this.videos || (this.videos.length == 0)) {
                var videoElement = window.CBSVideo.playerId ? $("#" + window.CBSVideo.playerId) : null;
                if (!videoElement) {
                    this._addOnClickEvent($('#flashvideocontent'));
                } else {
                    try {
                        var videoFlashVars = decodeURIComponent(window.CBSVideo.getFlashVars());
                        var re = /&contentValue=([0-9,]+)&/;
                        var videoId = re.exec(videoFlashVars)[1];

                        // $cwutil.Logger.debug('Video Id found:' + videoId);
                        if (!videoId || videoId.indexOf(',') != -1) {
                            videoId = window.CBSVideo.activeId;
                        }

                        // var embed = window.CBSVideo.playerId ? $('#' + window.CBSVideo.playerId) : null;
                        // $cwutil.Logger.debug('Embed tag found:' + videoElement);

                        if (videoId) {
                            var url = "http://www.cbsnews.com/video/watch/?video_id=" + videoId;
                            this._addVideo(videoElement, url);
                            $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', url);
                        }
                    } catch (err) {
                        // $cwutil.Logger.debug("From: _findVideoCandidates of CBS news. \nReason:" + err);
                        $cws.Tracker.trackError({from:"_findVideoCandidates of CBS news", msg: "Unable to get falshvars using CBS JS API.", exception:err})
                    }
                }

                if (this.videos.length > this._videosFound) {
                    this._videosFound = this.videos.length;
                    new $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived.bind, this), this.videos);
                }

                if (window.cbsiPlayer) {
                    window._onVideoPlayerStateChange = $.proxy(this._onVideoPlayerStateChange.bind, this);
                    window.cbsiPlayer.addEventJSCallback('onStateChange_cbsi', '_onVideoPlayerStateChange');
                }
            }

        } catch (outerErr) {
            // $cwutil.Logger.debug('From: _findVideoCandidates of CBS news. \nReason:' + outerErr);
            $cws.Tracker.trackError({from:"_findVideoCandidates of CBS news", msg: "Unable to find CBS video element.", exception:outerErr})
        }

        return embeds;
    },

    /**
     * Adds onClick event to all the child nodes of the element
     * @param elem
     */
    _addOnClickEvent: function(elem) {
        var childNodes = elem.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var node = $(childNodes[i]);
            $(node).click($.proxy(this._onVideoElementClicked.bind, this));
            if (node.childNodes && node.childNodes.length > 0) {
                this._addOnClickEvent(node);
            }
        }
    },

    /**
     * When user clicks on an image element to play video
     */
    _onVideoElementClicked: function() {
        var videoElement = $('#flashvideocontent');
        if (videoElement) {
            setTimeout($.proxy(this._onEmbedTagInserted, this, videoElement), 500);
        }
    },

    /**
     * When Image element is converted to video element
     * @param videoElement
     */
    _onEmbedTagInserted: function(videoElement) {
        var hasnewVideos = false;
        var objectTags = videoElement.getElementsByTagName('object');
        if (objectTags.length > 0) {
            hasnewVideos = true;
        } else {
            var embedTags = videoElement.getElementsByTagName('embed');
            if (embedTags.length > 0) {
                hasnewVideos = true;
            } else {
                var iframes = videoElement.getElementsByTagName('iframe');
                if (iframes.length > 0) {
                    hasnewVideos = true;
                } else {
                    setTimeout($.proxy(this._onEmbedTagInserted.bind, this, videoElement), 500);
                }
            }
        }

        if (hasnewVideos) {
            var embeds = this._findVideoCandidates();
            if (embeds) {
                this._findVideos(embeds);
            }
        }
    },

    /** When CBS video player state changes. */
    _onVideoPlayerStateChange : function() {
        if (arguments.length > 1 && (arguments[0] == 1) && window.CBSVideo.activeId) {
            this._onVideoUrlChange(window.CBSVideo.activeId);
        }
    },

    /**
     * When CBS
     * @param videoId
     */
    _onVideoUrlChange : function(videoId) {
        try {
            // $cwutil.Logger.debug("Video Id found:" + videoId);
            if (this.videos && (this.videos.length == 1)) {
                var lastSavedUrl = this.videos[0].url;
                this.videos[0].url = "http://www.cbsnews.com/video/watch/?video_id=" + videoId;
                if (lastSavedUrl != this.videos[0].url) {
                    this.videos[0].saved = false;
                    this.videos[0].tracked = false;

                    this._videosFound = this.videos.length;
                    $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', this.videos[0].url);

                    new $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);

                }
            }
        } catch (err) {
            // alert("From: _onVideoUrlChange of CBS news VideoAdapter. \nReason:" + err);
            $cws.Tracker.trackError({from:"_onVideoUrlChange of CBS news VideoAdapter", msg: "Unable to change video URL on video change", exception:err});
        }
    }
});
