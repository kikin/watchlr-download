/**
 * @package com.watchlr.hosts.google.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.google.adapters.VideoAdapter", {}, {

    numberOfVideoElementCandidates: 0,
    viewerPageContainer : null,
    sameDirContainer : null,
    isInSituVideoPanelOpen: false,
    inSituVideoPanel: null,

	/* @override */
	attach: function() {
        if (window.location.href.match(/^http:\/\/www\.google\.com\/reader\/.*/)) {
            // this.debug("Called in google reader implementation.");
            this.viewerPageContainer = $("#viewer-page-container");
            if (this.viewerPageContainer) {
                this._applyPageModifyEvent(this.viewerPageContainer);
            }

            this.sameDirContainer = $("#entries");
            if (this.sameDirContainer) {
                this._applyPageModifyEvent(this.viewerPageContainer);
            }
        }

        this.frameBorderTimeout = 100;

        this._super();
	},

    _applyPageModifyEvent: function(container) {
        if (container) {
            if (window.document.body.addEventListener) {
                window.document.body.addEventListener('DOMNodeInserted', $.proxy(this._firePageModifiedEvent, this), false);
            } else {
                $($(container).parent().get(0)).scroll($.proxt(this._firePageModifiedEvent, this));
                $(document.body).bind("mousewheel", $.proxy(this._firePageModifiedEvent, this));
                var nextEntryButton = $("#entries-down");
                $(nextEntryButton).click($.proxy(this._firePageModifiedEvent, this));
            }
        }
    },

    _firePageModifiedEvent: function() {
        try {
            // this.debug("google reader page modified event fired.");
            var target = null;
            // this.debug("ViewerPageContainer display style:" + $(this.viewerPageContainer).getStyle('display'));
            if (this.viewerPageContainer && $(this.viewerPageContainer).css('display') != "none") {
                target = $(this.viewerPageContainer);
            } else if (this.sameDirContainer) {
                target = $(this.sameDirContainer);
            }

            if (target) {
                // this.debug("Tagrget in _firePageModifiedEvent:" + target);
                var flashVideoCandidatesLength = $(target).find("iframe").length +
                                                 $(target).find("object").length +
                                                 $(target).find("embed").length;
                if (flashVideoCandidatesLength > this.numberOfVideoElementCandidates) {
                    var embeds = this._findVideoCandidates();
                    if (embeds) {
                        this._findVideos(embeds);
                    }
                }
            }
        } catch (e) {
            this.debug("From: on page scroll on google reader. \nReason: " + e);
            $cws.Tracker.trackError({from: 'on page scroll on google reader', msg: '', exception: e});
        }
    },

    /**
    * find all the videos on the page
    */
    _findVideoCandidates: function() {
        var embeds = [];
        if (window.location.href.match(/^http:\/\/www\.google\.com\/reader\/.*/)) {
            // this.debug("Finding flash video candidates in google reader implementation.");
            var target = null;
            if (this.viewerPageContainer && $(this.viewerPageContainer).css('display') != "none") {
                target =  $(this.viewerPageContainer);
            } else if (this.sameDirContainer) {
                target = $(this.sameDirContainer);
            }

            if (target) {
                var embed_tags = $(target).find('embed');
                // this.debug('Found ' + embed_tags.length + ' embeds');
                for (var i = 0; i < embed_tags.length; i++) {
                    embeds.push(embed_tags[i]);
                }

                var objects = $(target).find('object');
                // this.debug('Found ' + objects.length + ' objects');
                for (var i = 0; i < objects.length; i++) {
                    if (!/<embed/i.test(objects[i].innerHTML) || (!/<object/i.test(objects[i].innerHTML))) {
                        embeds.push(objects[i]);
                    }
                }

                var iframes = $(target).find('iframe');
                // this.debug('Found ' + iframes.length + ' iframes');
                for (var i = 0; i < iframes.length; i++) {
                    embeds.push(iframes[i]);
                }

                this.numberOfVideoElementCandidates = (iframes.length + objects.length + embed_tags.length);
            }
        } else {
            // look the page for video images
            $('#res li.videobox a img[id*=vidthumb]').each($.proxy(this._addWatchlrVideoBorder, this));
            //single video result - http://www.google.com/search?hl=en&q=ducati+696
            $('#res table a img[id*=vidthumb]').each($.proxy(this._addWatchlrVideoBorder, this));

            embeds = this._super();
        }

        return embeds;
    },

    _addWatchlrVideoBorder: function(pos, img) {
        try {
            // this.debug("Creating watchlr video border for img:" + img);
            var videoUrl = this.getVideoUrl(img);
            // this.debug("URL for image element:" + videoUrl);
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
                            var imgParent = $(img).parents('a').prev('.watchlrIsvGoogleOverlay').get(0);
                            this._addVideo(img, videoUrl);
                            this._listenThumbnailEvents(imgParent);
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            this.debug("From: _addWatchlrVideoBorder of Google Video adapter. \nReason: " + err);
        }
    },

    _listenThumbnailEvents: function(videoElement) {
        $(videoElement).mouseover($.proxy(this._onVideoThumbnailMouseOver, this));
        $(videoElement).mouseleave($.proxy(this._onVideoThumbnailMouseOut, this));
        $(videoElement).click($.proxy(this._onVideoThumbnailClick, this));
    },

    _listenInSituVideoEvents: function(inSituVideElement) {
        $(inSituVideElement).mouseover($.proxy(this._onInSituVideElementMouseOver, this));
        $(inSituVideElement).mouseleave($.proxy(this._onInSituVideElementMouseOut, this));
        $(inSituVideElement).bind('close', $.proxy(this._onInSituVideElementClosed, this));
    },

    getVideoUrl: function(img) {
        var imgParentTable = $(img).parents('a').get(0);

        // this.debug('Image element parent: ' + imgParentTable);
		if(imgParentTable) {
            var url = imgParentTable.href,
                videoUrl = /url\?url=(.*)&rct=/i.exec(url);

            // this.debug('Anchor element URL:' + url);
            // this.debug('Video url:' + videoUrl);
            if (videoUrl && videoUrl.length > 1) {
                return decodeURIComponent(videoUrl[1]);
            }
        }

		return null;
    },

    _onVideoThumbnailMouseOver : function(e) {
        try {
            var target = $(e.target).parents('table').get(0);
            var originalTarget = $(target).find('td a img');
            var watchlrVideoId = originalTarget.get(0).watchlrVideoId;

            // if video panel is open for the video then
            // show the mouse over action for the video.
            if (this.inSituVideoPanel && this.isInSituVideoPanelOpen && (this.inSituVideoPanel.watchlrVideoId == watchlrVideoId)) {
                target = this.inSituVideoPanel;
            }
            // this.debug("Mouseover target watchlr video id:" + watchlrVideoId);
            this._onVideoElementMouseEnter(target, watchlrVideoId);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOver of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOver of google's search VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailMouseOut : function(e) {
        try {
            var target = $(e.target).parents('table').get(0);
            var originalTarget = $(target).find('td a img');
            var watchlrVideoId = originalTarget.get(0).watchlrVideoId;

            // if video panel is open for the video then
            // show the mouse over action for the video.
            if (this.inSituVideoPanel && this.isInSituVideoPanelOpen && (this.inSituVideoPanel.watchlrVideoId == watchlrVideoId)) {
                target = this.inSituVideoPanel;
            }
            // this.debug("Mouseover target watchlr video id:" + watchlrVideoId);
            this._onVideoElementMouseLeave(target, watchlrVideoId);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOut of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onVideoThumbnailMouseOut of google's search VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailClick: function(e) {
        try {
            var originalTarget = $($(e.target).parents('table').get(0)).find('td a img');
            var watchlrVideoId = $(originalTarget).get(0).watchlrVideoId;
            // var selectedVideo = this.videos[watchlrVideoId - 1];

            // calculate the coordinates for video
            if (!this.inSituVideoPanel) {
                this.inSituVideoPanel = $('#watchlrIsvfContainer').get(0);
                this._listenInSituVideoEvents(this.inSituVideoPanel);
            }

            this.inSituVideoPanel.watchlrVideoId = watchlrVideoId;
            this._onVideoElementMouseEnter(this.inSituVideoPanel, watchlrVideoId, true);
            this.isInSituVideoPanelOpen = true;

        } catch (err) {
            this.debug("From: _onVideoThumbnailClick of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onVideoThumbnailClick of google's search VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementMouseOver: function(e) {
        try {
            this.debug('On insitu video element mouse enter');
            this._onVideoElementMouseEnter(this.inSituVideoPanel);
        } catch (err) {
            this.debug("From: _onInSituVideElementMouseOver of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOver of google's search VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementMouseOut: function(e) {
        try {
            this.debug('On insitu video element mouse leave');
            this._onVideoElementMouseLeave(this.inSituVideoPanel);
        } catch (err) {
            this.debug("From: _onInSituVideElementMouseOut of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOut of google's search VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementClosed: function(e) {
        try {
            this.debug('On insitu video element close');
            this._onVideoElementMouseLeave(this.inSituVideoPanel);
            this.isInSituVideoPanelOpen = false;
        } catch (err) {
            this.debug("From: _onInSituVideElementMouseOut of google's search VideoAdapter.\nReason: " + err);
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOut of google's search VideoAdapter", exception:err});
        }
    }
});
