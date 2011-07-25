/**
 * @package com.watchlr.hosts.facebook.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.facebook.adapters.VideoAdapter", {}, {
    videoAnchorTagsLength: 0,

	/* @override */
	attach: function() {
        try {
            // this.debug("Get called in Facebook video adapter.");
            if (window.document.body.addEventListener) {
                window.document.body.addEventListener('DOMNodeInserted', $.proxy(this._firePageModifiedEvent, this), false);
            } else {
                // setInterval(this._firePageModifiedEvent.bind(this), 1000);
                window.scroll($.proxy(this._firePageModifiedEvent, this));
                window.document.body.bind("mousewheel", $.proxy(this._firePageModifiedEvent, this));
            }

            this._super();
        } catch (err) {
            // this.debug("Error attaching to scroll events on facebook page. \nReason: " + err);
        }
	},

    _firePageModifiedEvent: function() {
        // this.debug("Page modified event fired.");
        var anchor_tags = $("a.uiVideoThumb");
        // this.debug("Number of video elements found:" + anchor_tags.length);
        // this.debug("Number of video elements already found:" + this.videoAnchorTagsLength);
        if (anchor_tags.length > this.videoAnchorTagsLength) {
            var embeds = this._findVideoCandidates();
            if (embeds) {
                this._findVideos(embeds);
            }
        }
    },

    /**
    * find all the videos on the page
    */
    _findVideoCandidates: function() {
        try {
            var videoAnchors = [];
            var anchor_tags = $("a.uiVideoThumb");
            // this.debug('Found ' + anchor_tags.length + ' anchors');
            this.videoAnchorTagsLength = anchor_tags.length;

            $(anchor_tags).each($.proxy(function(index, elem) {
                if (elem.watchlrVideoId != null) {
                    return;
                }

                var videoUrl = "";
                var anchorAjaxify = this._getNodeValue(elem, "ajaxify");
                // this.debug("Matching against: " + anchorAjaxify);

                var re = /ajax\/flash\/expand_inline\.php\?target_div=u[0-9]+_[0-9]+&share_id=([0-9]+)/;
                var result = re.exec(anchorAjaxify);
                if (result) {
                    // this.debug("Found with video id:" + result[1]);
                    videoUrl = "http://www.facebook.com/?video_id=" + result[1];
                } else {
                    re = /ajax\/flash\/expand_inline\.php\?target_div=u[0-9]+_[0-9]+&v=([0-9]+)/;
                    result = re.exec(anchorAjaxify);
                    if (result) {
                        // this.debug("Found with video id:" + result[1]);
                        videoUrl = "http://www.facebook.com/?video_id=" + result[1];
                    }
                }

                // this.debug("Videos object:" + this.videos.length);
                if (videoUrl) {
                    this._addVideo(elem, videoUrl);
                    this._listenThumbnailEvents(elem);
                    $cws.Tracker.track('VideoAdapterEvt', 'SupportedVideoFound', videoUrl);
                }
            }, this));

            if (this.videos.length > this._videosFound) {
                    this._videosFound = this.videos.length;
                    new $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);
                }

                // this.debug("Number of videos found:" + this.videos.length);

        } catch (err) {
            this.debug("From: findFlashVideoCandidates of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "findFlashVideoCandidates of facebook's VideoAdapater.", msg: "Unable to find flash videos on facebook page.", exception:err});
        }
    },

    _addVideo: function(videoElement, videoUrl) {
        try {
            var anchorTagParent = $(videoElement).parent().get(0);

            var video = {
                url                 : videoUrl,
                mouseover           : null,
                mouseout            : null,
                saved               : false,
                videoSelected       : false,
                saveButtonSelected  : false,
                coordinates         : null,
                parentNode          : anchorTagParent,
                tracked             : false,
                liked               : false,
                likes               : 0,
                saves               : 0,
                id                  : (this.videos.length + 1)
            };

            anchorTagParent.watchlrVideoId = video.id;
            videoElement.watchlrVideoId = video.id;

            // console.log('AnchorTag watchlrVideoId:' + elem.watchlrVideoId);

            var anchorTagChildNodes = $(videoElement).children() ;
            if (anchorTagChildNodes && anchorTagChildNodes.length > 0) {
                for (var j = 0; j < anchorTagChildNodes.length; j++) {
                    $(anchorTagChildNodes[j]).watchlrVideoId = video.id;
                }
            }

            this.videos.push(video);

            return video;

        } catch (err) {
            this.debug("From: findFlashVideoCandidates of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "findFlashVideoCandidates of facebook's VideoAdapater.", msg: "Unable to find flash videos on facebook page.", exception:err});
        }

    },

    _listenThumbnailEvents: function(videoElement) {
        $(videoElement).click($.proxy(this._onVideoImageClicked, this));
        $(videoElement).mouseenter($.proxy(this._onVideoThumbnailMouseOver, this));
        $(videoElement).mouseleave($.proxy(this._onVideoThumbnailMouseOut, this));
    },

    _onVideoImageClicked: function(e) {
        try {
            // hide the existing border, as image is going to be converted into
            // video element.
            this.watchlrVideoBorder.hide();
            try {
                var parentNode = this.selectedVideo.parentNode;
                if (parentNode.addEventListener) {
                    parentNode.addEventListener('DOMNodeInserted', $.proxy(this._onEmbedTagCreated, this), false);
                } else {
                    setTimeout($.proxy(this._fireOnVideoElementInserted, this), 500);
                }
            } catch (er) {
                this.debug("OnImageClicked error: " + er);
            }
        } catch (err) {
            this.debug("From: onVideoImageClicked of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "onVideoImageClicked of facebook's VideoAdapater.", exception:err});
        }
    },

    _fireOnVideoElementInserted: function() {
        try{
            var parentNode = this.selectedVideo.parentNode;
            if ($(parentNode).find('iframe') || $(parentNode).find('object')) {
                this._onEmbedTagCreated();
            } else {
                setTimeout($.proxy(this._fireOnVideoElementInserted, this), 500);
            }
        } catch (err) {
            this.debug("From: fireOnVideoElementInserted of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "fireOnVideoElementInserted of facebook's VideoAdapater.", msg: "Unable to fire the event.", exception:err});
        }
    },

    _onEmbedTagCreated: function() {
        try {
            // this.debug("In onEmbedTagCreated.");
            if (this.selectedVideo) {
                var parentNode = this.selectedVideo.parentNode;
                // this.debug("Selected video id is:" + parentNode.watchlrVideoId);

                var iframe = $(parentNode).find('iframe');
                if (iframe && iframe.length > 0) {
                    // this.debug('Iframe found');
                    iframe = iframe.get(0);
                    this._addMouseEvents(iframe, parentNode.watchlrVideoId);
                    iframe.watchlrVideoId = parentNode.watchlrVideoId;
                    this.selectedVideo.mouseover = iframe.onmouseover;
                    this.selectedVideo.mouseoout = iframe.onmouseout;
                    return;
                }

                var object = $(parentNode).find('object');
                if (object && object.length > 0) {
                    // this.debug('Object found');
                    object = object.get(0);
                    this._addMouseEvents(object, parentNode.watchlrVideoId);
                    object.watchlrVideoId = parentNode.watchlrVideoId;
                    this.selectedVideo.mouseover = object.onmouseover;
                    this.selectedVideo.mouseoout = object.onmouseout;
                    return;
                }

                var embed = $(parentNode).find('embed');
                if (embed && embed.length > 0) {
                    // this.debug('Embed found');
                    embed = embed.get(0);
                    this._addMouseEvents(embed, parentNode.watchlrVideoId);
                    embed.watchlrVideoId = parentNode.watchlrVideoId;
                    this.selectedVideo.mouseover = embed.onmouseover;
                    this.selectedVideo.mouseoout = embed.onmouseout;
                }
            }
        } catch (err) {
            this.debug("From: onEmbedTagCreated of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "onEmbedTagCreated of facebook's VideoAdapater.", exception:err});
        }
    },

    /**
     * retrieves the coordinates for the video
     * @param embed
     */
    _getVideoCoordinates: function(embed) {
        try {
            var videoWidth = embed.clientWidth || embed.width;
            if (!videoWidth) {
                videoWidth = this._getNodeValue(embed, 'width');
            }

            var videoHeight = embed.clientHeight || embed.height;
            if (!videoHeight) {
                videoHeight = this._getNodeValue(embed, 'height');
            }

            var parent = embed.offsetParent;
            var offsetLeft = embed.offsetLeft;
            var offsetTop = embed.offsetTop;

            while (parent && parent != window.document.body) {
                offsetLeft += parent.offsetLeft;
                offsetTop += parent.offsetTop;

                if ("UIImageBlock clearfix" == $(parent).attr('class')) {
                    try {
                        var profileImage = $(parent).find("a.actorPhoto");
                        if (profileImage && profileImage.length == 1) {
                            offsetLeft += $($(profileImage).get(0)).clientWidth + parseInt($(profileImage).get(0)).css('margin-right');
                        } else {
                            // this.debug("Cannot find the profile picture");
                        }
                    } catch (e) {
                        // this.debug(e);
                    }
                }
                parent = parent.offsetParent;
            }

            var coordinates = {
                left    : offsetLeft,
                top     : offsetTop,
                width   : videoWidth,
                height  : videoHeight
            };

            return coordinates;
        } catch (err) {
            this.debug("From: getVideoCoordinates of facebook's VideoAdapater. \nReason:" + err);
            $cws.Tracker.trackError({from: "getVideoCoordinates of facebook's VideoAdapater.", exception:err});
        }

        return null
    },

    _onVideoThumbnailMouseOver : function(e) {
        // this.debug('Anchor tag parent mouse over');
        try {
            var target = e.target;
            if (target) {
                // this.debug('Target node type:' + e.target.nodeName.toLowerCase());

                while (target && target.nodeName.toLowerCase() != 'div') {
                    target = target.parentNode;
                    //this.debug('Target node type:' + target.nodeName.toLowerCase());
                }

                this._onVideoElementMouseEnter(target);
            }
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOver of facebook's VideoAdapter. \nReason:" + err);
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOver of facebook's VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailMouseOut : function(e) {
        // this.debug('Anchor tag parent mouse out');
        try {
            var target = e.target;
            if (target) {
                // this.debug('Target node type:' + target.nodeName.toLowerCase());
                while (target && target.nodeName.toLowerCase() != 'div') {
                    target = target.parentNode;
                    // this.debug('Target node type:' + target.nodeName.toLowerCase());
                }

                this._onVideoElementMouseLeave(target);
            }
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOut of facebook's VideoAdapter. \nReason:" + err);
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOut of facebook's VideoAdapter", exception:err});
        }
    }
});
