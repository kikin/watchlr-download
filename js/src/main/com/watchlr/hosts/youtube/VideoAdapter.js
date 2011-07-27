/**
 * @package com.watchlr.hosts.youtube.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.youtube.adapters.VideoAdapter", {}, {

    isInSituVideoPanelOpen: false,
    inSituVideoPanel: null,

	/* @override */
	attach: function() {
        this.frameBorderTimeout = 500;
        this._super();
	},

    /**
    * find all the videos on the page
    */
    _findVideoCandidates: function() {
        // look for videos on search page
        $('a.ux-thumb-wrap').each($.proxy(this._addPotentialVideo, this));

        // look for side panel recommended videos
        $('a.video-list-item-link').each($.proxy(this._addPotentialVideo, this));

        return this._super();
    },

    /**
     * @override
     *
     * this function checks if we cannot determine the URL for the youtube
     * video in HTML5, then we use this function.
     *
     * @param videoElement
     */
    _findVideoUrl: function(videoElement) {
        try {
            var videoUrl = this._super(videoElement);
            if (!videoUrl) {
                var videoId = this._getNodeValue(videoElement, 'data-youtube-id');
                if (videoId) {
                    videoUrl = 'http://www.youtube.com/watch?v=' + videoId;
                }
            }

            return videoUrl;
        } catch (err) {
            $cws.Tracker.trackError({from: "_findVideoUrl of youtube's VideoAdapter.", msg:"Error while finding video url for video tag.", exception:err});
        }

        return null;
    },

    /**
     * Check if we can detect the URL for the video
     * @param pos
     * @param videoElement
     */
    _addPotentialVideo: function(pos, link) {
        try {
            var match = link.href.match(/watch\?(.*)/);
            if (!match || match.length == 0) return;

            // is there a action menu?
            var actions = $(link).find('.video-actions').get(0);
            // $cwutil.Logger.debug('actions: ' + actions);
            if (!actions) return;

            var playButtonClickHandler = $.proxy(this._onVideoThumbnailClick, this);
            var overlayButton = $(actions).find('.watchlrIsvYoutubeOverlay').get(0);
            // $cwutil.Logger.debug('overlayButton: ' + overlayButton);

            var elContainer = null,
                elVideoImg = null,
                url = null;

            // case1: result page videos
            if (elContainer = $(overlayButton).parents('.result-item').get(0)) {

                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
                var elVideoLink = $(elContainer).find('h3 a').get(0);
                url = $(elVideoLink).attr('href');

            // case2: watch page videos
            } else if (elContainer = $(overlayButton).parents('.video-list-item').get(0)) {

                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
                var elVideoLink = $(elContainer).find('a.video-list-item-link').get(0);
                url = $(elVideoLink).attr('href');

            // case3: homepage
            } else if (elContainer = $(overlayButton).parents('.video-entry').get(0)) {

                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
                var elVideoLink = $(elContainer).find('div.video-short-title a').get(0);
                url = $(elVideoLink).attr('href');
            }

            // $cwutil.Logger.debug('url:' + url);

            if (url) {
                url = this._qualifyURL(url);

                // listen for click events on video thumbnail
                $(overlayButton).click(playButtonClickHandler);
                if (elVideoImg) {
                    $(elVideoImg).click(playButtonClickHandler);

                    var video = this._addVideo(elVideoImg, url);
                    if (video && (0 == window.location.pathname.indexOf('/results'))) {

                        // listen for mouse events on video thumbnail
                        $(actions).mouseenter($.proxy(this._onThumbnailMouseOver, this));
                        $(actions).mouseleave($.proxy(this._onThumbnailMouseLeave, this));
                    }
                }
            }
        } catch (err) {
            $cws.Tracker.trackError({from: "_addPotentialVideo of youtube's VideoAdapter.", msg:"", exception:err});
        }
    },

    /**
     * Listen for the mouse enter and leave events for
     * the video.
     *
     * @param videoElement
     */
    _addMouseEvents : function(videoElement, watchlrVideoId) {
        if (videoElement.nodeName.toLowerCase() == 'video') {

            var parent = $(videoElement).parents('div.video-container').get(0);
            $(parent).mouseenter($.proxy(this._onHtml5VideoMouseOver, this));
            $(parent).mouseleave($.proxy(this._onHtml5VideoMouseOut, this));

        } else if (videoElement.nodeName.toLowerCase() == 'img') {

            if (0 == window.location.pathname.indexOf('/results')) {
                $(videoElement).mouseenter($.proxy(this._onThumbnailMouseOver, this));
                $(videoElement).mouseleave($.proxy(this._onThumbnailMouseLeave, this));
            }

        } else {
            this._super(videoElement, watchlrVideoId);
        }
    },

    _onHtml5VideoMouseOver: function(e) {
        try {
            var originalTarget = $(e.target).parents('div.video-container').get(0);
            if (!originalTarget) {
                originalTarget = e.target;
            }

            originalTarget = $(originalTarget).find('video').get(0);

            if (originalTarget) {
                this._onVideoElementMouseEnter(originalTarget);
            }

        } catch (err) {
            $cws.Tracker.trackError({from: "_onHtml5VideoMouseOver of youtube's VideoAdapter.", msg:"", exception:err});
        }
    },

    _onHtml5VideoMouseOut: function(e) {
        try {
            var originalTarget = $(e.target).parents('div.video-container').get(0);
            if (!originalTarget) {
                originalTarget = e.target;
            }

            originalTarget = $(originalTarget).find('video').get(0);

            if (originalTarget) {
                this._onVideoElementMouseEnter(originalTarget);
            }

        } catch (err) {
            $cws.Tracker.trackError({from: "_onHtml5VideoMouseOut of youtube's VideoAdapter.", msg:"", exception:err});
        }
    },

    _onThumbnailMouseOver: function(e) {
        try {
            var elContainer = null,
                elVideoImg = null;

            // case1: result page videos
            if (elContainer = $(e.target).parents('.result-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case2: watch page videos
            } else if (elContainer = $(e.target).parents('.video-list-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case3: homepage
            } else if (elContainer = $(e.target).parents('.video-entry').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
            }

            if (elVideoImg) {
                var watchlrVideoId = elVideoImg.watchlrVideoId;
                var target = elContainer;

                // if video panel is open for the video then
                // show the mouse over action for the video.
                if (this.inSituVideoPanel && this.isInSituVideoPanelOpen && (this.inSituVideoPanel.watchlrVideoId == watchlrVideoId)) {
                    target = this.inSituVideoPanel;
                }

                // $cwutil.Logger.debug("Mouseover target watchlr video id:" + watchlrVideoId);
                this._onVideoElementMouseEnter(target, watchlrVideoId);
            }

        } catch (err) {
            $cws.Tracker.trackError({from: "_onThumbnailMouseOver of youtube's VideoAdapter.", msg:"", exception:err});
        }
    },

    _onThumbnailMouseLeave: function(e) {
        try {
            var elContainer = null,
                elVideoImg = null;

            // case1: result page videos
            if (elContainer = $(e.target).parents('.result-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case2: watch page videos
            } else if (elContainer = $(e.target).parents('.video-list-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case3: homepage
            } else if (elContainer = $(e.target).parents('.video-entry').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
            }

            if (elVideoImg) {
                var watchlrVideoId = elVideoImg.watchlrVideoId;
                var target = elContainer;

                // if video panel is open for the video then
                // show the mouse over action for the video.
                if (this.inSituVideoPanel && this.isInSituVideoPanelOpen && (this.inSituVideoPanel.watchlrVideoId == watchlrVideoId)) {
                    target = this.inSituVideoPanel;
                }

                // $cwutil.Logger.debug("Mouseover target watchlr video id:" + watchlrVideoId);
                this._onVideoElementMouseLeave(target, watchlrVideoId);
            }

        } catch (err) {
            $cws.Tracker.trackError({from: "_onThumbnailMouseLeave of youtube's VideoAdapter.", msg:"", exception:err});
        }
    },

    _onVideoThumbnailClick: function(e) {
        try {
            var elContainer = null,
                elVideoImg = null;

            // case1: result page videos
            if (elContainer = $(e.target).parents('.result-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case2: watch page videos
            } else if (elContainer = $(e.target).parents('.video-list-item').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);

            // case3: homepage
            } else if (elContainer = $(e.target).parents('.video-entry').get(0)) {
                elVideoImg = $(elContainer).find('.video-thumb img').get(0);
            }

            if (elVideoImg) {
                this._onVideoElementMouseLeave(elVideoImg);
            }

            var watchlrVideoId = elVideoImg.watchlrVideoId;
            // var selectedVideo = this.videos[watchlrVideoId - 1];

            // calculate the coordinates for video
            if (!this.inSituVideoPanel) {
                this.inSituVideoPanel = $('#watchlrIsvfContainer').get(0);
                $(this.inSituVideoPanel).mouseover($.proxy(this._onInSituVideElementMouseOver, this));
                $(this.inSituVideoPanel).mouseleave($.proxy(this._onInSituVideElementMouseOut, this));
                $(this.inSituVideoPanel).bind('close', $.proxy(this._onInSituVideElementClosed, this));
            }

            this.inSituVideoPanel.watchlrVideoId = watchlrVideoId;
            this._onVideoElementMouseEnter(this.inSituVideoPanel, watchlrVideoId, true);
            this.isInSituVideoPanelOpen = true;

        } catch (err) {
            $cws.Tracker.trackError({from: "_onVideoThumbnailClick of youtube VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementMouseOver: function(e) {
        try {
            // $cwutil.Logger.debug('On insitu video element mouse enter');
            this._onVideoElementMouseEnter(this.inSituVideoPanel);
        } catch (err) {
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOver of google's search VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementMouseOut: function(e) {
        try {
            // $cwutil.Logger.debug('On insitu video element mouse leave');
            this._onVideoElementMouseLeave(this.inSituVideoPanel);
        } catch (err) {
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOut of google's search VideoAdapter", exception:err});
        }
    },

    _onInSituVideElementClosed: function(e) {
        try {
            // $cwutil.Logger.debug('On insitu video element close');
            this._onVideoElementMouseLeave(this.inSituVideoPanel);
            this.isInSituVideoPanelOpen = false;
        } catch (err) {
            $cws.Tracker.trackError({from: "_onInSituVideElementMouseOut of google's search VideoAdapter", exception:err});
        }
    }
});
