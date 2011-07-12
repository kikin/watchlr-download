$.Class.extend("com.watchlr.hosts.adapters.VideoAdapter", {
    getInstance : function() {
        if (!this._instance) {
            var adapter = $cws.services.getService('HostService').getAdapter('VideoAdapter');
            this._instance = adapter ? new adapter() : null;
        }

        return this._instance;
    },
    stats : {
        reset: function() {
            this.enabled = 0;
            return this;
        },
        toLogString: function() {
            if (this.enabled == 0) {
                return '';
            } else {
                return 'VideoAdapter:annotated='+this.enabled;
            }
        }
    },

    WATCHLR_COM : 'http://www.watchlr.com/'

}, {

    _popupMonitor : null,
    _connectionPopup : null,

    /**
    * list of videos on the page
    */
    videos: [],

    /** currently selected video. */
    selectedVideo: null,

    /** number of watchlr supported videos found on page. */
    _videosFound : 0,

    /** div tag to create border around video. */
    watchlrVideoBorder: null,

    _showFbPushDialog: false,

    /** list of services supported by watchlr. */
    services : $cwc.VideoProvidersConfig.services,

    /** Run method for video adapter. */
    attach: function() {
        var fn = $.proxy(function() { setTimeout($.proxy(this._onHashChange, this), 1000); }, this);
        /*$(window).hashchange()
        if (window.addEventListener) {
            window.addEventListener('hashchange', fn, false);
        } else {
            window.onhashchange = fn;
        } */

        // $(window).addEvent("load", fn);
        fn();
    },

    _onHashChange: function(e) {
        var embeds = this._findFlashVideoCandidates();
        if (embeds)
            this._findFlashVideos(embeds);

        if ((this.videos.length > 0) && !this.watchlrVideoBorder) {
            this._createWatchlrVideoBorder();
        }
    },

    debug : function(str) {
        //if (!$ks.__PRODUCTION__) {
            try {
                //console.log(str);
                // alert(str);
            } catch (e) {}
        //}
    },

    /**
    * find all the videos on the page
    */
    _findFlashVideoCandidates: function() {
        try {
            var embeds = [];

            var embed_tags = $('embed');
            this.debug('Found ' + embed_tags.length + ' embeds');
            for (var i = 0; i < embed_tags.length; i++) {
                embeds.push(embed_tags[i]);
            }

            var objects = $('object');
            this.debug('Found ' + objects.length + ' objects');
            for (var i = 0; i < objects.length; i++) {
                if (!/<embed/i.test(objects[i].innerHTML) || (!/<object/i.test(objects[i].innerHTML))) {
                    embeds.push(objects[i]);
                }
            }

            var iframes = $('iframe');
            this.debug('Found ' + iframes.length + ' iframes');
            for (var i = 0; i < iframes.length; i++) {
                embeds.push(iframes[i]);
            }

            var videos = $('video');
            this.debug('Found ' + videos.length + ' videos');
            for (var i = 0; i < videos.length; i++) {
                embeds.push(videos[i]);
            }

            return embeds;
        } catch (err) {
            this.debug("from: _findFlashVideoCandidates of base VideoAdapter. \n Reason:" + err);
            //$kat.trackError({from: "_findFlashVideoCandidates of base VideoAdapter.", exception:err});
        }

        return null;
    },

    _findFlashVideos: function(embeds) {
        try {
            // this.debug('Searching through ' + embeds.length + ' candidates');
            for (var i = 0; i < embeds.length; i++) {
                var embedTag = $(embeds[i]);
                if (embedTag.watchlrVideoId != null) {
                    continue;
                }

                var videoUrl = this._findVideoUrl(embeds[i]);
                // this.debug("Adding video for embed:" + embeds[i] + " and url: " + videoUrl);
                if (videoUrl) {
                    this._addVideo(embeds[i], videoUrl);
                }
            }

            if (this.videos.length > this._videosFound) {
                this._videosFound = this.videos.length;
                /*$kat.track('VideoAdapterEvt', 'SupportedVideoFound', {
                    campaign: window.location.host
                });*/

                //TODO: Enable this part for getting info

                $cws.WatchlrRequests.sendVideosInfoRequest($.proxy(this._onVideosInfoReceived, this), this.videos);
            }

            // this.debug("Number of videos found:" + this.videos.length);
        } catch (err) {
            this.debug("from: _findFlashVideos of base VideoAdapter. \nReason:" + err);
            // $kat.trackError({from: "_findFlashVideos of base VideoAdapter.", exception:err});
        }
    },

    _findVideoUrl: function(embed) {
        var src = this._getNodeValue(embed, 'src') || this._getNodeValue(embed, 'data');
        var flashvars = this._getNodeValue(embed, 'flashvars');

        if (src.indexOf('/') == 0) {
            src = this._qualifyURL(src);
        } else if (src.indexOf('http://') == -1) {
            src = this._qualifyURL('/' + src);
        }

        // this.debug('Flashvars:' + flashvars);
        // this.debug('src:' + src);

        for (var j = 0; j < this.services.length; j++) {
            if (src && this._isSupportedDomain(src, this.services[j].domains)) {
                var match = { passed: false },
                	oService = this.services[j];

                if (flashvars) {
                    this._extractId(flashvars, oService.flash_regex, match);
                }

                if (!match.passed && !match.video_id) {
                    // this.debug('oService.source_regex: ' + oService.source_regex);
                    this._extractId(src, oService.source_regex, match);
                }

                if (match.passed) {
                    if (oService.use_location != undefined) {
                        if (oService.use_location && oService.location_regex.test(window.location.href)) {
                            // this.debug('Using location: ' + window.location.href);
                            return window.location.href;
                        }
                    } else if (match.video_id) {
                        // this.debug('Found video with id: ' + match.video_id);
                        if (typeof(oService.url) == 'function') {
                            this.debug('Using URL:' + oService.url(match.video_id));
                            return oService.url(match.video_id);
                        } else {
                            // this.debug("Video ids:" + match.video_id);
                            // this.debug("Video id:" + match.video_id[1]);
                            // this.debug('Using URL:' + (oService.url + match.video_id[1]));
                            return oService.url + match.video_id[1];
                        }
                    }
                }
            }
        }

        return "";
    },

    _addVideo : function(embed, videoUrl) {
        try {
            // create the video object
            var onmouseout= (embed ? embed.onmouseout : null);
            var onmouseover = (embed ? embed.onmouseover : null);
            var video = {
                url                 : videoUrl,
                mouseover           : onmouseover,
                mouseout            : onmouseover,
                saved               : false,
                videoSelected       : false,
                saveButtonSelected  : false,
                coordinates         : null,
                tracked             : false,
                liked               : false,
                likes               : 0,
                saves               : 0,
                id                  : (this.videos.length + 1)
            };

            if (embed)
                this._addMouseEvents(embed);

            // assign the video id to embed object
            embed.watchlrVideoId = video.id;

            // push the video object to list.
            this.videos.push(video);

            return video;
        } catch (err) {
            this.debug("from: _addVideo of base VideoAdapter. \n Reason:" + err);
            // $kat.trackError({from: "_addVideo of base VideoAdapter.", msg:"Error while adding video.", exception:err});
        }
    },

    _addMouseEvents : function(embed) {
        // add mouse events to the object
        var _onVideoMouseOver = $.proxy(this._onVideoMouseOver, this);
        var _onVideoMouseOut = $.proxy(this._onVideoMouseOut, this);

        // We try to listen mouse events for video in all the possible ways.
        // Different players fire events in different way. For eg.
        // 1. Youtube will fire the event on 'onmouseover'
        // 2. Collegehumour will fire event on 'addEventListener' in Firefox/Chrome and 'attachEvent' in IE
        // 3. Vimeo will always fire the event on 'addEventListener' (even for IE7 and IE8)
        try {
            embed.onmouseover = _onVideoMouseOver;
            embed.onmouseout = _onVideoMouseOut;
            // this.debug('Added mouse events successfully for embed:' + embed);
        } catch (e) {
            this.debug("From: _addMouse events. \n Reason:" + e);
        }

        // If attachEvent is supported listen mouse events using attachEvent
        if (embed.attachEvent) {
            try {
                embed.attachEvent('onmouseover', _onVideoMouseOver);
                embed.attachEvent('onmouseout', _onVideoMouseOut);
                // this.debug('Attached mouse events successfully for embed:' + embed);
            } catch (e) {
                this.debug("From: _addMouse events. \n Reason:" + e);
            }
        }

        // If addEventListener is supported listen mouse events using addEventListener
        if (embed.addEventListener) {
            try {
                embed.addEventListener('mouseover', _onVideoMouseOver, false);
                embed.addEventListener('mouseoout', _onVideoMouseOut, false);
                // this.debug('Added events listeners for mouse events successfully for embed:' + embed);
            } catch (e) {
                this.debug("From: _addMouse events. \n Reason:" + e);
            }
        }
    },

    _getNodeValue: function (obj, id) {
        //var value = $(obj).attr(id);
        var value = "";
        for (var i = 0; i < obj.attributes.length; i++) {
            if (obj.attributes[i].nodeName.toLowerCase() == id) {
                value += obj.attributes[i].nodeValue;
                break;
            }
        }

        var params = $(obj).find('param');
        if (params) {
            for (var i = 0; i < params.length; i++) {
                if (params[i].name.toLowerCase() == id) {
                    value += params[i].value;
                    break;
                }
            }
        }

        return decodeURIComponent(value);
    },

    _isSupportedDomain: function(src, domains) {
        for (var i = 0; i < domains.length; i++) {
            // this.debug('Testing against domain: ' + domains[i] + ' with src: ' + src);
            if (src.indexOf(domains[i]) != -1) {
                // this.debug('Matched domain ' + domains[i]);
                return true;
            }
        }
        return false;
    },

    _extractId: function(str, patterns, match) {
        for (var i = 0; i < patterns.length; i++) {
            // this.debug('Matching: ' + patterns[i] + ' against ' + str);
            var videoId = patterns[i].exec(str);
            if (videoId) {
                // this.debug('Matched: ' + str + " \tfor pattern:" + patterns[i]);
                match.passed = true;
                match.video_id = videoId;
                return;
            }
        }
    },

    _escapeHTML: function(s) {
        return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
    },

    _qualifyURL: function(url) {
        var el = document.createElement('div');
        el.innerHTML = '<a href="' + this._escapeHTML(url) + '">x</a>';
        return el.firstChild.href;
    },

    _createWatchlrVideoBorder : function() {
        try {
            this.watchlrVideoBorder = new $cwui.WatchlrVideoBorder();
            this.watchlrVideoBorder.create(document);
            this.watchlrVideoBorder.bind($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_OPTIONS_BUTTON_MOUSE_ENTER, $.proxy(this._onOptionsButtonMouseEnter, this));
            this.watchlrVideoBorder.bind($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_OPTIONS_BUTTON_MOUSE_LEAVE, $.proxy(this._onOptionsButtonMouseLeave, this));
            this.watchlrVideoBorder.bind($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_SAVE_BUTTON_CLICKED, $.proxy(this._onSaveButtonClicked, this));
            this.watchlrVideoBorder.bind($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_LIKE_BUTTON_CLICKED, $.proxy(this._onLikeButtonClicked, this));

        } catch (e) {
            this.debug("from: _createWatchlrVideoBorder of base VideoAdapter. \nReason:" + e);
            // $kat.trackError({from:"_createWatchlrVideoBorder of base VideoAdapter", msg: "Unable to create the border around video.", exception:e});
        }
    },

    /**
     * retrieves the coordinates for the video
     * @param embed
     */
    _getVideoCoordinates: function(embed) {
        try {
            // this.debug("Get called in base class getVideoCoordinates");
            var videoWidth = embed.clientWidth || embed.width;
            if (!videoWidth) {
                videoWidth = this._getNodeValue(embed, 'width');
            }

            var videoHeight = embed.clientHeight || embed.height;
            if (!videoHeight) {
                videoHeight = this._getNodeValue(embed, 'height');
            }

            var parent = embed;
            var offsetLeft = 0;
            var offsetTop = 0;

            this.debug('Embed element: ' + parent);
            // Calculate the absolute position of the video
            while (parent && (parent != document.body)) {
                offsetLeft += parent.offsetLeft;
                offsetTop += parent.offsetTop;
                var oldParent = parent;
                parent = parent.offsetParent;

                // if the element has set the scroll property,
                // then calculate the relative position of video in the view port.
                // relative position of video in context of view port can be calculated using
                // offsetLeft = element.scrollLeft - (absolute position of video in the element)
                // offsetTop = element.scrollTop - (absolute position of video in the element)
                var parentElement = oldParent;
                while (parentElement && (parentElement != parent)) {
                    // this.debug('Parent element: ' + parentElement.tagName);
                    var overFlow = $(parentElement).css('overflow');
                    if (overFlow && (overFlow == "scroll" || overFlow == "auto")) {
                        if (parentElement.scrollLeft) {
                            // this.debug('Left scroll is:' + parentElement.scrollLeft);
                            offsetLeft -= parentElement.scrollLeft;
                        }
                        if (parentElement.scrollTop) {
                            // this.debug('Top scroll is:' + parentElement.scrollTop);
                            offsetTop -= parentElement.scrollTop;
                        }

                    } else {
                        var overFlowX = $(parentElement).css('overflow-x');
                        if (overFlowX && (overFlowX == "scroll" || overFlowX == "auto")  && parentElement.scrollLeft) {
                            // this.debug("scroll left position is: " + parentElement.scrollLeft);
                            offsetLeft -= parentElement.scrollLeft;
                        }

                        var overFlowY = $(parentElement).css('overflow-y');
                        if (overFlowY && (overFlowY == "scroll" || overFlowY == "auto") && parentElement.scrollTop) {
                            // this.debug("scroll top position is: " + parentElement.scrollTop);
                            offsetTop -= parseInt(parentElement.scrollTop);
                        }
                    }

                    parentElement = $(parentElement).parent().get(0);
                }

                // this.debug("Offset Left:" + offsetLeft + " \t Offset Top: " + offsetTop);
            }

            var coordinates = {
                left    : offsetLeft,
                top     : offsetTop,
                width   : videoWidth,
                height  : videoHeight
            };

            return coordinates;
        } catch (e) {
            this.debug('from: getVideoCoordinates of base VideoAdapter. \nReason:' + e);
            // $kat.trackError({from: "getVideoCoordinates of base VideoAdapter", msg: "Unable to calculate the coordinates for video.", exception:e});
        }

        return null;
    },

    /**
     * When user mouse overs the video element.
     * It is generally a video object, but in some cases like
     * Facebook, Google search, Yahho search, etc., it is an image element.
     * So identify the target mouse over in the site specific implementation
     * and do the business logic in this function.
     *
     * @param target
     * @param watchlrVideoId
     */
    _onVideoElementMouseEnter: function(target, watchlrVideoId) {
        try {
            if (!target) return;
            if (!watchlrVideoId) watchlrVideoId = target.watchlrVideoId;
            if (!watchlrVideoId) return;

            var selectedVideo = this.videos[watchlrVideoId - 1];
            try {
                if (!selectedVideo.tracked) {
                    /*$kat.track('VideoAdapterEvt', 'VideoMouseOver', {
                        campaign: window.location.host
                    });*/
                    selectedVideo.tracked = true;
                }
            } catch (tarckError) {}

            // if selected video is different than the video saved in the object
            // hide the saved object video if it is visible
            if (this.selectedVideo && this.selectedVideo != selectedVideo) {
                this.watchlrVideoBorder.hide();
                this.selectedVideo.videoSelected = false;
                this.selectedVideo.saveButtonSelected = false;
            }

            // set the new selected video
            this.selectedVideo = selectedVideo;

            if (!this.watchlrVideoBorder) {
                this._createWatchlrVideoBorder();
            }
            if (this.watchlrVideoBorder.isHidden()) {
                // calculate the coordinates for video
                selectedVideo.coordinates = this._getVideoCoordinates(target);

                if (selectedVideo.coordinates) {
                    this.debug("Coordinates for video:" + selectedVideo.coordinates.left + ", " +
                        selectedVideo.coordinates.top + ", " +
                        selectedVideo.coordinates.width + ", " +
                        selectedVideo.coordinates.height);

                    // draw the border around video
                    this.watchlrVideoBorder.show(selectedVideo.coordinates.left,
                                          selectedVideo.coordinates.top,
                                          selectedVideo.coordinates.width,
                                          selectedVideo.coordinates.height,
                                          selectedVideo.saved,
                                          selectedVideo.liked,
                                          selectedVideo.likes,
                                          document);
                }
            }

            selectedVideo.videoSelected = true;

            try {
                // call the original mouseover event
                if (selectedVideo.onmouseover) {
                    selectedVideo.onmouseover();
                }
            } catch (e) {}
        } catch (err) {
            this.debug('from: _onVideoElementMouseOver of base VideoAdapter. \nReason:' + e);
            // $kat.trackError({from: "_onVideoElementMouseOver of base VideoAdapter", msg: "Unable to show watchlr video border.", exception:e});
        }
    },

    /**
     * When user mouse outs the video element.
     * It is generally a video object, but in some cases like
     * Facebook, Google search, Yahho search, etc., it is an image element.
     * So identify the target mouse over in the site specific implementation
     * and do the business logic in this function.
     *
     * @param target
     * @param watchlrVideoId
     */
    _onVideoElementMouseLeave: function(target, watchlrVideoId) {
        try {
            if (!target) return;
            if (!watchlrVideoId) watchlrVideoId = target.watchlrVideoId;
            if (!watchlrVideoId) return;

            // set the selected video property to false
            var selectedVideo = this.videos[parseInt(watchlrVideoId, 10) - 1];
            selectedVideo.videoSelected = false;

            // hide the border after a second
            setTimeout($.proxy(function() {
                var selectedVideo = this.selectedVideo;

                // if mouse is not over the video or share button of the video
                // hide the video
                this.debug('selected video: ' + selectedVideo +
                    '\nShare Button Selected: ' + selectedVideo.saveButtonSelected +
                    '\nVideo selected: ' + selectedVideo.videoSelected +
                    '\nSaving video: ' + selectedVideo.savingVideo +
                    '\nLiking video: ' + selectedVideo.likingVideo
                );
                if (selectedVideo &&
                    !selectedVideo.saveButtonSelected &&
                    !selectedVideo.videoSelected &&
                    !selectedVideo.savingVideo &&
                    !selectedVideo.likingVideo)
                {
                    this.watchlrVideoBorder.hide();
                }
            }, this), 1000);


            try {
                if (selectedVideo.onmouseout) {
                    selectedVideo.onmouseout();
                }
            }  catch (e) {}
        } catch (err) {
            this.debug('from: _onVideoElementMouseLeave of base VideoAdapter. \nReason:' + e);
            // $kat.trackError({from: "_onVideoElementMouseLeave of base VideoAdapter", msg: "Unable to hide watchlr video border.", exception:e});
        }
    },

    /**
     * when user mouse overs the video
     * @param e
     */
    _onVideoMouseOver: function(e) {
        try {
            var evt = e;
            if (!evt)
                evt = window.event;

            // If there is no event, we cannot find the target, and thus, we cannot find the video ID
            // associated with the target. So ignore the event
            if (!evt)
                return;

            var target = evt.target;
            if (!target)
                target = evt.srcElement;

            // this.debug("Video mouse over for target:" + (target ? target.nodeName : "not found"));

            if (target) {
                if (target.nodeType == 3) {
                    target = target.parentNode;
                }

                // get the watchlr video id
                var watchlrVideoId = target.watchlrVideoId;
                if (watchlrVideoId === null || watchlrVideoId == undefined) {
                    var embedTags = target.getElementsByTagName('embed');
                    if (embedTags.length == 1) {
                        watchlrVideoId = embedTags[0].watchlrVideoId;
                    }
                }

                // this.debug("Video id associated with target:" + watchlrVideoId);

                this._onVideoElementMouseEnter(target, watchlrVideoId);
            }
        } catch (err) {
            this.debug('from: onVideoMouseOver of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "onVideoMouseOver of base VideoAdapter", exception:err});
        }
    },

    /**
     * on mouse out from video
     * @param e
     */
    _onVideoMouseOut: function(e) {
        try {

            var evt = e;
            if (!evt)
                evt = window.event;

            // If there is no event, we cannot find the target, and thus, we cannot find the video ID
            // associated with the target. So ignore the event
            if (!evt)
                return;

            var target = evt.target;
            if (!target)
                target = evt.srcElement;

            // this.debug("Video mouse out for target:" + (target ? target.nodeName : "not found"));

            if (target) {
                if (target.nodeType == 3) {
                    target = target.parentNode;
                }

                // fetch the watchlr video id
                var watchlrVideoId = target.watchlrVideoId;
                if (watchlrVideoId === null || watchlrVideoId == undefined) {
                    var embedTags = target.getElementsByTagName('embed');
                    if (embedTags.length == 1) {
                        watchlrVideoId = embedTags[0].watchlrVideoId;
                    }
                }

                // this.debug("Video id associated with target:" + watchlrVideoId);

                this._onVideoElementMouseLeave(target, watchlrVideoId);
            }
        } catch (err) {
            this.debug('from: onVideoMouseOut of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "onVideoMouseOut of base VideoAdapter", exception:err});
        }
    },

    /**
     * on mouse over share button
     * @param e
     */
    _onOptionsButtonMouseEnter: function(e) {
        try {
            // this.debug("On button mouse over");
            if (e) e.stopPropagation();

            this.selectedVideo.saveButtonSelected = true;
        } catch (err) {
            this.debug('from: onSaveButtonMouseOver of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "onSaveButtonMouseOver of base VideoAdapter", exception:err});
        }
    },

    /**
     * on mouse out of share button
     * @param e
     */
    _onOptionsButtonMouseLeave: function(e) {
        try {
            if (e) e.stopPropagation();

            // this.debug("On button mouse out");

            this.selectedVideo.saveButtonSelected = false;

            // hide the border after 1 second
            setTimeout($.proxy(function() {
                var selectedVideo = this.selectedVideo;

                // if mouse is not over share button or video,
                // hide the border
                this.debug('selected video: ' + selectedVideo +
                    '\nShare Button Selected: ' + selectedVideo.saveButtonSelected +
                    '\nVideo selected: ' + selectedVideo.videoSelected +
                    '\nSaving video: ' + selectedVideo.savingVideo +
                    '\nLiking video: ' + selectedVideo.likingVideo
                );
                if (selectedVideo &&
                    !selectedVideo.saveButtonSelected &&
                    !selectedVideo.videoSelected &&
                    !selectedVideo.savingVideo &&
                    !selectedVideo.likingVideo)
                {
                    this.watchlrVideoBorder.hide();
                }
            }, this), 1000);
        } catch (err) {
            this.debug('from: onSaveButtonMouseOut of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "onSaveButtonMouseOut of base VideoAdapter", exception:err});
        }
    },

    /**
     * when user clicks the share button
     * share the video
     *
     * @param e
     */
    _onSaveButtonClicked: function(e) {
        try {
            if (e) e.stopPropagation();
            // this.debug("Is video saved:" + this.selectedVideo.saved);
            if (!this.selectedVideo.saved) {
                this.watchlrVideoBorder.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.SAVING);
                this.selectedVideo.savingVideo = true;
                $cws.WatchlrRequests.sendSaveVideoRequest($.proxy(this._updateButtonState, this), this.selectedVideo.url);
                /*$kat.track('Video', 'SaveVideoClk', {
                    campaign: window.location.host
                });*/
            } else {
                window.open($cwh.adapters.VideoAdapter.WATCHLR_COM);
                /*$kat.track('Video', 'ToWatchlrCom', {
                    campaign: window.location.host
                });*/
            }
        } catch (err) {
            this.debug('from: onSaveButtonClicked of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "onSaveButtonClicked of base VideoAdapter", exception:err});
        }
    },

    /**
     * when user clicks the like button
     * like the video
     *
     * @param e
     */
    _onLikeButtonClicked: function(e) {
        try {
            if (e) e.stopPropagation();
            // If we don't have to show the push to facebook dialog, then make the request to server
            // else we are going to make the call when user closes the push to facebook dialog.

            if (!this.selectedVideo.liked) {
                this.selectedVideo.likingVideo = true;
                this.watchlrVideoBorder.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.LIKING);
                if (this._showFbPushDialog) {
                    this.watchlrVideoBorder.createVideoLikedDialog();
                    this.watchlrVideoBorder.bind($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_CLOSE,  $.proxy(this._onPushToFacebookWindowClosed, this));
                    this.watchlrVideoBorder.bind($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_HOME_PAGE_LINK_CLICKED,  $.proxy(this._handleVisitingVideoPageRequested, this));
                    this.watchlrVideoBorder.showVideoSavedDialog();
                    /*$kat.track('VideoAdapterEvt', 'FirstLike', {
                        campaign: window.location.host
                    });*/
                } else {
                    $cws.WatchlrRequests.sendVideoLikedRequest($.proxy(this._onVideoLiked, this), this.selectedVideo.url);
                }
                //$kat.track('Video', 'LikeVideoClk', {
                //    campaign: window.location.host
                //});
            } else {
                window.open($cwh.adapters.VideoAdapter.WATCHLR_COM + '#!/liked_queue');
                /*$kat.track('Video', 'ToWatchlrCom', {
                    campaign: window.location.host
                });*/
            }
        } catch (err) {
            this.debug('from: onLikeButtonClicked of base VideoAdapter. \nReason:' + err);
        }
    },

    /**
	 * determine if the popup window is closed, when it is call the commonCallback
	 */
	_monitorPopup: function() {
        // this.debug("Window is created:" + (this._connectionPopup==null));
        // this.debug("Window is closed:" + (this._connectionPopup.closed));
		if(this._connectionPopup==null || this._connectionPopup.closed){
			this._popupMonitor = false;
			this._commonCallback();
		} else if(this._popupMonitor){
            // console.log("Checking again");
			setTimeout($.proxy(this._monitorPopup, this), 600);
		}
	},

    _commonCallback: function() {
        this.watchlrVideoBorder.hideLoginDialog();
        // this.debug('get called in common callback');
        if (this.selectedVideo.savingVideo) {
            $cws.WatchlrRequests.sendSaveVideoRequest($.proxy(this._updateButtonState, this), this.selectedVideo.url);
        } else if (this.selectedVideo.likingVideo) {
            // this.debug('making the request for fetching user info');
            $cws.WatchlrRequests.sendUserProfileRequest($.proxy(this.onUserProfileReceived, this));
        }
    },

    _handleFacebookConnectionCancelled: function() {
        this.watchlrVideoBorder.hideLoginDialog();
        this.debug("Liking video:" + this.selectedVideo.likingVideo);
        if (this.selectedVideo.savingVideo) {
            this.selectedVideo.savingVideo = false;

            // change the save button state to watch later
            this.watchlrVideoBorder.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER);


        } else if (this.selectedVideo.likingVideo) {
            this.selectedVideo.likingVideo = false;

            // change the like button state to unliked
            this.watchlrVideoBorder.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED);
        }

        /*$kat.track('VideoAdapterEvt', 'LoginCancel', {
            campaign: window.location.host
        });*/
    },

    _handleFacebookConnectionRequested: function() {
        var url = $cwh.adapters.VideoAdapter.WATCHLR_COM + 'login/facebook?next=' + encodeURIComponent($cwh.adapters.VideoAdapter.WATCHLR_COM+'static/html/connectWindow.html?connected=true&code=200');
        this._connectionPopup = window.open(url, '_blank', 'location=1, width=' + 800 + ',height=' + 600 + ',left=' + 200 + ',top=' + 200);
        this._popupMonitor = true;
        this._monitorPopup();
    },

    _handleVisitingVideoPageRequested: function() {
        window.open($cwh.adapters.VideoAdapter.WATCHLR_COM);
        /*$kat.track('Video', 'ToWatchlrCom', {
            campaign: window.location.host
        });*/
    },

    /** When video is saved. */
    _updateButtonState: function(data) {
        try {
            // this.debug("Data received from server:" + data);
            if(this.selectedVideo){
                var buttonText = "";
                var res = null;
                if (typeof data == "object") {
                    res = data;
                } else {
                    res = JSON.decode(data);
                }

                var videoSavedSuccessfully = false;
                if (res && res.success && res.result && res.result.saved) {
                    videoSavedSuccessfully = true;
                } else {
                    if (res) {
                        switch (res.code) {

                            case 400: {
                                videoSavedSuccessfully = true;
                                break;
                            }

                            case 401: {
                                // this.debug("Session sent was an invalid session");
                                this.watchlrVideoBorder.createLoginDialog();
                                this.watchlrVideoBorder.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_CLOSE_BUTTON_CLICKED, $.proxy(this._handleFacebookConnectionCancelled, this));
                                this.watchlrVideoBorder.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_FACEBOOK_CONNECT_CLICKED, $.proxy(this._handleFacebookConnectionRequested, this));
                                this.watchlrVideoBorder.showLoginDialog();
                                return;
                            }

                            default: {
                                alert(this._localize('errorDlgTitle') + "\n\n" + this._localize('errorDlgMsg'));
                                // $kat.trackError({from: "updateButtonState of base VideoAdapter", msg:"Unable to save video. Error code:" + res.code + ", Error:" + res.error});
                            }
                        }
                    } else {
                        alert(this._localize('errorDlgTitle') + "\n\n" + this._localize('errorDlgMsg'));
                        //$kat.trackError({from: "updateButtonState of base VideoAdapter", msg:"Unable to save video. Reason:" + (res ? res.error : "Result is null")});
                    }
                }

                if (videoSavedSuccessfully) {
                    this.watchlrVideoBorder.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.SAVED);
                    this.selectedVideo.savingVideo = false;
                    this.selectedVideo.saved = true;
                    // video Id can be 0;
                    if (res.result) {
                        var oResult = res.result;
                        if (oResult.id != null && oResult.id != undefined)
                            this.selectedVideo.videoId = oResult.id;
                        if(oResult.emptyq) {
                            this.watchlrVideoBorder.createVideoSavedDialog();
                            this.watchlrVideoBorder.bind($cwui.VideoSavedDialog.VideoSavedDialogEvents.ON_CLOSE,  $.proxy(this._onSavedWindowClosed, this));
                            this.watchlrVideoBorder.bind($cwui.VideoSavedDialog.VideoSavedDialogEvents.ON_HOME_PAGE_LINK_CLICKED,  $.proxy(this._handleVisitingVideoPageRequested, this));
                            this.watchlrVideoBorder.showVideoSavedDialog();
                        }
                    }

                } else {
                    this.watchlrVideoBorder.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER);
                }

                // hide the border after 1 second
                setTimeout($.proxy(function() {
                    var selectedVideo = this.selectedVideo;

                    // if mouse is not over share button or video,
                    // hide the border
                    this.debug('selected video: ' + selectedVideo +
                        '\nShare Button Selected: ' + selectedVideo.saveButtonSelected +
                        '\nVideo selected: ' + selectedVideo.videoSelected +
                        '\nSaving video: ' + selectedVideo.savingVideo +
                        '\nLiking video: ' + selectedVideo.likingVideo
                    );
                    if (selectedVideo &&
                        !selectedVideo.saveButtonSelected &&
                        !selectedVideo.videoSelected &&
                        !selectedVideo.savingVideo &&
                        !selectedVideo.likingVideo)
                    {
                        this.watchlrVideoBorder.hide();
                    }
                }, this), 1000);
            }
        } catch (err) {
            this.debug('from: updateButtonState of base VideoAdapter. \nReason:' + err);
            // $kat.trackError({from: "updateButtonState of base VideoAdapter", exception:err});
        }
	},

    /** When video is liked. */
    _onVideoLiked: function(data) {
        try {
            // this.debug("Data received from server:" + data);
            if(this.selectedVideo){

                var res = null;
                if (typeof data == "object") {
                    res = data;
                } else {
                    res = JSON.decode(data);
                }

                // this.debug("On video liked:" + JSON.encode(res));

                var videoLikedSuccessfully = false;
                if (res && res.success) {
                    videoLikedSuccessfully = true;
                } else {
                    if (res) {
                        switch (res.code) {

                            case 400: {
                                videoLikedSuccessfully = true;
                                break;
                            }

                            case 401: {
                                this.watchlrVideoBorder.createLoginDialog();
                                this.watchlrVideoBorder.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_CLOSE_BUTTON_CLICKED, $.proxy(this._handleFacebookConnectionCancelled, this));
                                this.watchlrVideoBorder.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_FACEBOOK_CONNECT_CLICKED, $.proxy(this._handleFacebookConnectionRequested, this));
                                this.watchlrVideoBorder.showLoginDialog();
                                return;
                            }

                            default: {
                                alert(this._localize('errorDlgLikeTitle') + "\n\n" + this._localize('errorDlgLikeMsg'));
                                // $kat.trackError({from: "_onVideoLiked of base VideoAdapter", msg:"Unable to like video. Error code:" + res.code + ", Error:" + res.error});
                            }
                        }
                    } else {
                        alert(this._localize('errorDlgLikeTitle') + "\n\n" + this._localize('errorDlgLikeMsg'));
                        // $kat.trackError({from: "_onVideoLiked of base VideoAdapter", msg:"Unable to like video. Reason:" + (res ? res.error : "Result is null")});
                    }
                }

                if (videoLikedSuccessfully) {
                    this.selectedVideo.likingVideo = false;
                    this.watchlrVideoBorder.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.LIKED);

                    if (res.result) {
                        var oResult = res.result;
                        if (typeof oResult.liked == 'boolean')
                            this.selectedVideo.liked = oResult.liked;

                        if (typeof oResult.likes == 'number')
                            this.selectedVideo.likes = oResult.likes;
                    }
                } else {
                    this.watchlrVideoBorder.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED);
                }

                // hide the border after 1 second
                setTimeout($.proxy(function() {
                    var selectedVideo = this.selectedVideo;

                    // if mouse is not over share button or video,
                    // hide the border
                    this.debug('selected video: ' + selectedVideo +
                        '\nShare Button Selected: ' + selectedVideo.saveButtonSelected +
                        '\nVideo selected: ' + selectedVideo.videoSelected +
                        '\nSaving video: ' + selectedVideo.savingVideo +
                        '\nLiking video: ' + selectedVideo.likingVideo
                    );
                    if (selectedVideo &&
                        !selectedVideo.saveButtonSelected &&
                        !selectedVideo.videoSelected &&
                        !selectedVideo.savingVideo &&
                        !selectedVideo.likingVideo)
                    {
                        this.watchlrVideoBorder.hide();
                    }
                }, this), 1000);
            }
        } catch (err) {
            this.debug("From: _onVideoLiked of base VideoAdapter. \nReason:" + err);
            //$kat.trackError({from: "_onVideoLiked of base VideoAdapter", exception:err});
        }
	},

    _onSavedWindowClosed: function(evt, showMessageUnchecked) {
        try {
            if (showMessageUnchecked) {
                 $cws.WatchlrRequests.sendUpdateUserProfileRequest($.proxy(this._onUserProfileUpdated, this));
            }
        } catch (err) {
            this.debug("From: _onSavedWindowClosed of base VideoAdapter. \nReason:" + err);
            // $kat.trackError
        }
    },

    _onPushToFacebookWindowClosed: function(evt, pushToFcaebook) {
        try {
            if (pushToFcaebook == '0' || pushToFcaebook == '1') {
                $cws.WatchlrRequests.sendUpdateUserPreferenceRequest($.proxy(this._onUserProfileUpdated, this), pushToFcaebook);
            }

            if (!this.selectedVideo.liked) {
                $cws.WatchlrRequests.sendVideoLikedRequest($.proxy(this._onVideoLiked, this), this.selectedVideo.url);
                /*$kat.track('Video', 'LikeVideoClk', {
                    campaign: window.location.host
                });*/
            } else {
                $cws.WatchlrRequests.sendVideoUnlikedRequest($.proxy(this._onVideoLiked, this), this.selectedVideo.url);
                /*$kat.track('Video', 'UnlikeVideoClk', {
                    campaign: window.location.host
                });*/
            }
        } catch (err) {
            this.debug("From: _onPushToFacebookWindowClosed of base VideoAdapter. \nReason:" + err);
            // $kat.trackError
        }
    },

    _onUserProfileUpdated: function(data) {
        var str = "";
        for (var i in data) {
            str += i + ": " + data[i] + "\r\n";
        }
        // this.debug(str);
    },

	onUserProfileReceived: function(data) {
        // this.debug("User profile info received.");
        var res = null;
        if (typeof data == 'object') {
            res = data;
        } else {
            res = JSON.decode(data);
        }

        if (res && res.success && res.result && res.result.preferences && res.result.preferences.syndicate == 2) {
            this._showFbPushDialog = true;
        }

        // It may happen that user is not signed in and try to like the
        // video. At that time we have to make a call to server to fetch user info
        // so that we can decide whether we want to show the first liked video message
        if (this.selectedVideo && this.selectedVideo.likingVideo) {
            // If we don't have to show the push to facebook dialog, then make the request to server
            // else we are going to make the call when user closes the push to facebook dialog.
            if (this._showFbPushDialog) {
                this.watchlrVideoBorder.createVideoLikedDialog();
                this.watchlrVideoBorder.bind($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_CLOSE,  $.proxy(this._onPushToFacebookWindowClosed, this));
                this.watchlrVideoBorder.bind($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_HOME_PAGE_LINK_CLICKED,  $.proxy(this._handleVisitingVideoPageRequested, this));
                this.watchlrVideoBorder.showVideoSavedDialog();
            } else {
                if (!this.selectedVideo.liked) {
                    $cws.WatchlrRequests.sendVideoLikedRequest($.proxy(this._onVideoLiked, this), this.selectedVideo.url);
                    /*$kat.track('Video', 'LikeVideoClk', {
                        campaign: window.location.host
                    });*/
                } else {
                    $cws.WatchlrRequests.sendVideoUnlikedRequest($.proxy(this._onVideoLiked, this), this.selectedVideo.url);
                    /*$kat.track('Video', 'UnlikeVideoClk', {
                        campaign: window.location.host
                    });*/
                }
            }
        }
    },

    _onVideosInfoReceived: function(data) {
        var res = null;
        if (typeof data == 'object') {
            res = data;
        } else {
            res = JSON.decode(data);
        }

        // this.debug("Received video info:" + str);

        if (res && res.success && res.result) {
            if (res.result.videos && res.result.videos.length > 0) {
                for (var i = 0; i < res.result.videos.length; i++) {
                    var videoInfo = res.result.videos[i];
                    if (typeof videoInfo.id == 'number') {
                        var videoIndex = videoInfo.id - 1;
                        if (typeof videoInfo.liked == 'boolean') {
                            this.videos[videoIndex].liked = videoInfo.liked;
                        }

                        if (typeof videoInfo.saved == 'boolean') {
                            this.videos[videoIndex].saved = videoInfo.saved;
                        }

                        if (typeof videoInfo.likes == 'number') {
                            this.videos[videoIndex].likes = videoInfo.likes;
                        }

                        if (typeof videoInfo.saves == 'number') {
                            this.videos[videoIndex].saves = videoInfo.saves;
                        }
                    }
                }
            }

            if (res.result.user && res.result.user.preferences && res.result.user.preferences.syndicate == 2) {
                this._showFbPushDialog = true;
            }
        }
    }

});