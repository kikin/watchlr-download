/**
 * @package com.watchlr.hosts.yahoo.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.yahoo.adapters.VideoAdapter", {}, {
	/* @override */
	attach: function() {
        this._super();
	},

    _findFlashVideoCandidates: function() {
        $('ul.c-thumb.video li').each($.proxy(this._addWatchlrVideoBorder, this));
        return this._super();
    },

    _addWatchlrVideoBorder: function(pos, img) {
        try {
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
                            $(img).mouseover($.proxy(this._onVideoThumbnailMouseOver, this));
                            $(img).mouseleave($.proxy(this._onVideoThumbnailMouseOut, this));


                            var video = {
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
                            this.videos.push(video);
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            // alert("From: _addWatchlrVideoBorder of Yahoo Video adapter. \nReason: " + err);
        }
    },

    getVideoUrl: function(videoDiv) {
        // try to get the link
        var link = $(videoDiv).find('a');
        if(link) {
            // get rurl parameter
            var href = decodeURIComponent($(link).attr('href')),
                    params = href.parseQueryString(),
                    url = (params && params.rurl) ? params.rurl.replace(/&amp;/g, '&') : null;
            return url;
        }
        // alert(link);
        return null;
    },

    _onVideoThumbnailMouseOver : function(e) {
        try {
            var target = e.target;
            this._onVideoElementMouseEnter(target);
        } catch (err) {
            // alert("From: _onVideoThumbnailMouseOver of yahoo's search VideoAdapter.\nReason: " + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOver of yahoo's search VideoAdapter", exception:err});
        }
    },

    _onVideoThumbnailMouseOut : function(e) {
        try {
            var target = e.target;
            this._onVideoElementMouseLeave(target);
        } catch (err) {
            // alert("From: _onVideoThumbnailMouseOut of yahoo's search VideoAdapter.\nReason: " + err);
            // $kat.trackError({from: "_onVideoThumbnailMouseOut of yahoo's search VideoAdapter", exception:err});
        }
    }
});