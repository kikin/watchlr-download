/**
 * @package com.watchlr.hosts.google.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.google.adapters.VideoAdapter", {}, {

    numberOfVideoElementCandidates: 0,
    viewerPageContainer : null,
    sameDirContainer : null,

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
            // $kat.trackError({from: 'on page scroll on google reader', msg: '', exception: e});
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
                            var imgParent = $(img).parents('tr').get(0);
                            this._addVideo(img, videoUrl);
                            this._listenThumbnailEvents(imgParent);

                            /*var video = {
                                url                 : videoUrl,
                                mouseover           : null,
                                mouseout            : null,
                                saved               : false,
                                videoSelected       : false,
                                saveButtonSelected  : false,
                                coordinates         : null
                            };

                            // calculate the videoId
                            img.watchlrVideoId = (this.videos.length + 1);
                            this.videos.push(video);*/

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

    /**
     * retrieves the coordinates for the video element
     *
     * @param videoElement
     */
    _getVideoCoordinates: function(videoElement) {

    },

    _onVideoThumbnailMouseOver : function(e) {
        try {
            var target = $($(e.target).parents('table').get(0)).find('td a img');
            target = target.get(0);
            this.debug("Mouseover target watchlr video id:" + target.watchlrVideoId);
            this._onVideoElementMouseEnter(target);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOver of google's search VideoAdapter.\nReason: " + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOver of google's search VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailMouseOut : function(e) {
        try {
            var target = $($(e.target).parents('table').get(0)).find('td a img');
            target = target.get(0);
            // this.debug("Mouseover target watchlr video id:" + target.watchlrVideoId);
            this._onVideoElementMouseLeave(target);
        } catch (err) {
            this.debug("From: _onVideoThumbnailMouseOut of google's search VideoAdapter.\nReason: " + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOut of google's search VideoAdapter", exception:err});
        }
    }
});
