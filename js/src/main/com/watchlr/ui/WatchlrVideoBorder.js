/**
 * @package com.watchlr.ui
 */

$.Class.extend("com.watchlr.ui.WatchlrVideoBorder", {
    /*
     * Static members
     */
    LikeButtonState : {
        UNLIKED : 1,
        LIKING: 2,
        LIKED: 3,
        MOUSE_OVER_UNLIKED: 4,
        MOUSE_LEAVE_UNLIKED: 5,
        MOUSE_OVER_LIKED: 6,
        MOUSE_LEAVE_LIKED: 7
    },

    SaveButtonState : {
        WATCH_LATER : 1,
        SAVING: 2,
        SAVED: 3,
        MOUSE_OVER_WATCH_LATER: 4,
        MOUSE_LEAVE_WATCH_LATER: 5,
        MOUSE_OVER_SAVED: 6,
        MOUSE_LEAVE_SAVED: 7
    },

    WatchlrVideoBorderEvents : {
        ON_OPTIONS_BUTTON_MOUSE_ENTER : 'optionsbuttonmouseenter',
        ON_OPTIONS_BUTTON_MOUSE_LEAVE : 'optionsbuttonmouseleave',
        ON_LIKE_BUTTON_CLICKED : 'likebuttonclicked',
        ON_SAVE_BUTTON_CLICKED : 'savebuttonclicked'
    },

    BORDER_WIDTH : 5

}, {
    /*
     * Local variables
     */
    watchlrVideoBorder : null,
    topBorder: null,
    bottomBorder: null,
    leftBorder: null,
    rightBorder: null,
    optionsButton: null,
    watchlrLogo: null,
    likeButtonImage: null,
    likeButtonText: null,
    saveButtonImage: null,
    saveButtonText: null,
    saveButtonState: null,
    likeButtonState: null,
    loginDialog: null,

    // ---------------------------------------------------------------------------
    //                              PRIVATE FUNCTIONS
    // ---------------------------------------------------------------------------

    /**
     * Utility for debugging
     * @param msg
     */
    debug: function(msg) {
        try {
            console.log(msg);
        } catch (err) {}
    },

    /**
     * Utility for binding events to this class.
     * @param eventName
     * @param _callback
     */
    bind: function(eventName, _callback) {
        $(this.watchlrVideoBorder).bind(eventName, _callback);
    },

    /**
     * Utility for firing events
     * @param eventName
     * @param paramArray
     */
    trigger: function(eventName, paramArray) {
        if (paramArray) {
            $(this.watchlrVideoBorder).trigger(eventName, paramArray);
        } else {
            $(this.watchlrVideoBorder).trigger(eventName);
        }
    },

    /**
     * Returns the localized string
	 * @param {String}
	 */
	_localize: function(_key){
		return $cwc.Locale.get('Watchlr', _key);
	},

    // ---------------------------------------------------------------------------
    //                              PUBLIC FUNCTIONS
    // ---------------------------------------------------------------------------

    /**
     * create the watchlr video border
     * @param doc - document in which watchlr border should be inserted
     */
    create: function(doc) {
        try {
            if (!doc) {
                doc = document;
            }

            $($(doc).find('head').get(0)).append('<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=PT%20Sans">');
            $cwutil.Styles.insert('VideoBorderStyles', doc);

            // create a div tag for the video
            $(doc.body).append($cws.html['VideoBorder']);
            this.watchlrVideoBorder = $('#watchlr-video-border');
            $cwutil.Styles.addCSSHelperClasses(this.watchlrVideoBorder);

            // save all the elements in the video border
            // so that we don't have to find them every time.
            this.topBorder =  $(this.watchlrVideoBorder).find('#watchlr-top-border');
            this.bottomBorder = $(this.watchlrVideoBorder).find('#watchlr-bottom-border');
            this.leftBorder = $(this.watchlrVideoBorder).find('#watchlr-left-border');
            this.rightBorder = $(this.watchlrVideoBorder).find('#watchlr-right-border');
            this.optionsButton = $(this.watchlrVideoBorder).find('#watchlr-options-button');
            this.watchlrLogo = $(this.watchlrVideoBorder).find('#watchlr-logo');
            this.likeButtonImage = $(this.watchlrVideoBorder).find('#watchlr-like-btn-img');
            this.likeButtonText = $(this.watchlrVideoBorder).find('#watchlr-like-btn-text');
            this.saveButtonImage = $(this.watchlrVideoBorder).find('#watchlr-watch-later-btn-img');
            this.saveButtonText = $(this.watchlrVideoBorder).find('#watchlr-watch-later-btn-text');

            $(this.likeButtonText).html(this._localize('like'));
            $(this.saveButtonImage).click($.proxy(this._onSaveButtonClicked, this));
            $(this.saveButtonText).click($.proxy(this._onSaveButtonClicked, this));
            $(this.likeButtonImage).click($.proxy(this._onLikeButtonClicked, this));
            $(this.likeButtonText).click($.proxy(this._onLikeButtonClicked, this));

            $(this.optionsButton).mouseenter($.proxy(this._onOptionsButtonMouseEnter, this));
            $(this.optionsButton).mouseleave($.proxy(this._onOptionsButtonMouseLeave, this));

            $(this.watchlrLogo).mouseenter($.proxy(this._onWatclrLogoMouseEnter, this));
            $(this.saveButtonImage).mouseenter($.proxy(this._onSaveButtonMouseEnter, this));
            $(this.saveButtonText).mouseenter($.proxy(this._onSaveButtonMouseEnter, this));
            $(this.likeButtonImage).mouseenter($.proxy(this._onLikeButtonMouseEnter, this));
            $(this.likeButtonText).mouseenter($.proxy(this._onLikeButtonMouseEnter, this));

            $(this.watchlrLogo).mouseleave($.proxy(this._onWatclrLogoMouseLeave, this));
            $(this.saveButtonImage).mouseleave($.proxy(this._onSaveButtonMouseLeave, this));
            $(this.saveButtonText).mouseleave($.proxy(this._onSaveButtonMouseLeave, this));
            $(this.likeButtonImage).mouseleave($.proxy(this._onLikeButtonMouseLeave, this));
            $(this.likeButtonText).mouseleave($.proxy(this._onLikeButtonMouseLeave, this));

        } catch (e) {
            this.debug("from: create of WatchlrVideoBorder. \nReason:" + e);
            // $kat.trackError({from:"create of WatchlrVideoBorder", msg: "Unable to create the border around video.", exception:e});
        }
    },

    /**
     * draws the watchlr border relative to these coordinates
     * @param left
     * @param top
     * @param width
     * @param height
     * @param saved
     * @param liked
     * @param likes
     * @param doc - document in which watchlr border should be drawn
     */
    show: function(left, top, width, height, saved, liked, likes, doc) {
        if (!this.watchlrVideoBorder) {
            this.create(doc);
        }

        if ((left >= 0 )&& (top >= 0) && width && height && this.watchlrVideoBorder) {
            try {
                // set the position and dimensions for the left border
                var leftBorderStyle = {
                    'left'   : '' + (left - $cwui.WatchlrVideoBorder.BORDER_WIDTH) + 'px',
                    'top'    : '' + top + 'px',
                    'width'  : '' + $cwui.WatchlrVideoBorder.BORDER_WIDTH + 'px',
                    'height' : '' + height + 'px'
                };
                $(this.leftBorder).css(leftBorderStyle);
                /* this.debug("Left border is created with dimensions:" +
                              leftBorderStyle.left + "," +
                              leftBorderStyle.top + ", " +
                              leftBorderStyle.width + ", " +
                              leftBorderStyle.height);*/

                // set the position and dimensions for the right border
                var rightBorderStyle = {
                    'left'   : '' + (left + width) + 'px',
                    'top'    : '' + top + 'px',
                    'width'  : '' + $cwui.WatchlrVideoBorder.BORDER_WIDTH + 'px',
                    'height' : '' + height + 'px'
                };
                $(this.rightBorder).css(rightBorderStyle);
                /* this.debug("right border is created with dimensions:" +
                              rightBorderStyle.left + "," +
                              rightBorderStyle.top + ", " +
                              rightBorderStyle.width + ", " +
                              rightBorderStyle.height);*/

                // set the position and dimensions for the top border
                var topBorderStyle = {
                    'left'   : '' + (left - $cwui.WatchlrVideoBorder.BORDER_WIDTH) + 'px',
                    'top'    : '' + (top - $cwui.WatchlrVideoBorder.BORDER_WIDTH) + 'px',
                    'width'  : '' + (width + (2 * $cwui.WatchlrVideoBorder.BORDER_WIDTH)) + 'px',
                    'height' : '' + $cwui.WatchlrVideoBorder.BORDER_WIDTH + 'px'
                };
                $(this.topBorder).css(topBorderStyle);
                /* this.debug("top border is created with dimensions:" +
                              topBorderStyle.left + "," +
                              topBorderStyle.top + ", " +
                              topBorderStyle.width + ", " +
                              topBorderStyle.height);*/

                // set the position and dimensions for the bottom border
                var bottomBorderStyle = {
                    'left'   : '' + (left - $cwui.WatchlrVideoBorder.BORDER_WIDTH) + 'px',
                    'top'    : '' + (top + height) + 'px',
                    'width'  : '' + (width + (2 * $cwui.WatchlrVideoBorder.BORDER_WIDTH)) + 'px',
                    'height' : '' + $cwui.WatchlrVideoBorder.BORDER_WIDTH + 'px'
                };
                $(this.bottomBorder).css(bottomBorderStyle);
                /* this.debug("bottom border is created with dimensions:" +
                              bottomBorderStyle.left + "," +
                              bottomBorderStyle.top + ", " +
                              bottomBorderStyle.width + ", " +
                              bottomBorderStyle.height);*/

                if (saved) {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.SAVED);
                } else {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER);
                }

                if (liked) {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.LIKED);
                } else {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED);
                }

                // If value was added by css, there is no method to get it in FF3.6 when
                // position=absolute and display=none
                // because of this stupid bug in jquery for FF3.6, we have to show the element
                // first and then calculate the position of bottom border
                $(this.watchlrVideoBorder).show();

                var saveButtonTop = parseInt($(this.bottomBorder).css('top'));
                var saveButtonLeft = parseInt($(this.bottomBorder).css('left')) +
                                     parseInt($(this.bottomBorder).css('width')) -
                                     (parseInt($(this.optionsButton).css('width')) + /*paddign*/23);

                $(this.optionsButton).css({
                    'left' : '' + saveButtonLeft + 'px',
                    'top'  : '' + saveButtonTop + 'px'
                });


            } catch (e) {
                this.debug('from: show of WatchlrVideoBorder. \nReason:' + e);
                // $kat.trackError({from: "show of WatchlrVideoBorder", msg: "Unable to reposition border around video.", exception:e});
            }
        }
    },

    /**
     * hide the watchlr video border.
     */
    hide: function() {
        $(this.watchlrVideoBorder).fadeOut();
    },

    /**
     * returns whether the watchlr video border is hidden
     */
    isHidden: function() {
        var visibility = $(this.watchlrVideoBorder).css('display');
        return !visibility || visibility == 'none';
    },

    /**
     * Changes the state of like button
     * @param state
     */
    setLikeButtonState: function(state) {
        try {
            if (!state) {
                state = $cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED;
            }

            switch (state) {
                case $cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED: {
                    this.likeButtonState = $cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED;
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-unlike-button-image');
                    $(this.likeButtonText).html(this._localize('like'));
                    $(this.likeButtonText).css('margin', '0 10px 0 5px');
                    $(this.likeButtonText).css('color', '#ffffff');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.LIKING: {
                    this.likeButtonState = $cwui.WatchlrVideoBorder.LikeButtonState.LIKING;
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass("watchlr-image watchlr-spinner-image");
                    $(this.likeButtonText).html(this._localize('liking'));
                    $(this.likeButtonText).css('margin', '0 5px 0 5px');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.LIKED: {
                    this.likeButtonState = $cwui.WatchlrVideoBorder.LikeButtonState.LIKED;
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-like-button-image');
                    $(this.likeButtonText).html(this._localize('liked'));
                    $(this.likeButtonText).css('margin', '0 5px 0 5px');
                    $(this.likeButtonText).css('color', '#ffffff');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_OVER_UNLIKED: {
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-unlike-button-hover-image');
                    $(this.likeButtonText).css('color', '#000000');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_LEAVE_UNLIKED: {
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-unlike-button-image');
                    $(this.likeButtonText).css('color', '#ffffff');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_OVER_LIKED: {
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-like-button-hover-image');
                    $(this.likeButtonText).css('color', '#000000');
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_LEAVE_LIKED: {
                    $(this.likeButtonImage).removeClass();
                    $(this.likeButtonImage).addClass('watchlr-image watchlr-like-button-image');
                    $(this.likeButtonText).css('color', '#ffffff');
                    break;
                }

                default: {
                    this.debug('from: setLikeButtonState of WatchlrVideoBorder. \nReason: Invalid state is sent to the function');
                    // $kat.trackError({from: "setLikeButtonState of WatchlrVideoBorder", msg: "Invalid state is sent to the function."});
                }
            }
        } catch (err) {
            this.debug('from: setLikeButtonState of WatchlrVideoBorder. \nReason:' + e);
            // $kat.trackError({from: "setLikeButtonState of WatchlrVideoBorder", msg: "Unable to change the state of like button.", exception:e});
        }
    },

    /**
     * Changes the state of watch save button
     * @param state
     */
    setSaveButtonState: function(state) {
        try {
            if (!state) {
                state = $cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER;
            }

            switch (state) {
                case $cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER: {
                    this.saveButtonState = $cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER;
                    $(this.saveButtonText).html(this._localize('btnSave'));
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass("watchlr-image watchlr-watch-later-button-image");
                    $(this.saveButtonText).css('color', '#ffffff');
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.SAVING: {
                    this.saveButtonState = $cwui.WatchlrVideoBorder.SaveButtonState.SAVING;
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass("watchlr-image watchlr-spinner-image");
                    $(this.saveButtonText).html(this._localize('btnSaving'));
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.SAVED: {
                    this.saveButtonState = $cwui.WatchlrVideoBorder.SaveButtonState.SAVED;
                    $(this.saveButtonText).html(this._localize('btnSaved'));
                    $(this.saveButtonText).css('color', '#ffffff');
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass("watchlr-image watchlr-saved-button-image");
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_OVER_WATCH_LATER: {
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass('watchlr-image watchlr-watch-later-button-hover-image');
                    $(this.saveButtonText).css('color', '#000000');
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_LEAVE_WATCH_LATER: {
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass('watchlr-image watchlr-watch-later-button-image');
                    $(this.saveButtonText).css('color', '#ffffff');
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_OVER_SAVED: {
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass('watchlr-image watchlr-saved-button-hover-image');
                    $(this.saveButtonText).css('color', '#000000');
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_LEAVE_SAVED: {
                    $(this.saveButtonImage).removeClass();
                    $(this.saveButtonImage).addClass('watchlr-image watchlr-saved-button-image');
                    $(this.saveButtonText).css('color', '#ffffff');
                    break;
                }

                default: {
                    this.debug('from: setSaveButtonState of WatchlrVideoBorder. \nReason: Invalid state is sent to the function');
                    // $kat.trackError({from: "setSaveButtonState of WatchlrVideoBorder", msg: "Invalid state is sent to the function."});
                }
            }
        } catch (err) {
            this.debug('from: setSaveButtonState of WatchlrVideoBorder. \nReason:' + e);
            // $kat.trackError({from: "setSaveButtonState of WatchlrVideoBorder", msg: "Unable to change the state of like button.", exception:e});
        }
    },

    /**
     * shows the login dialog in the options button
     * when user tries to save/like the video but is not logged in.
     */
    showLoginDialog: function() {
        try {
            this.debug('Create dialog');
            this.loginDialog = new $cwui.FacebookConnectDialog();
            this.loginDialog.create(this.optionsButton, document);
            this.debug('dialog created');

            this.loginDialog.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_CLOSE_BUTTON_CLICKED, $.proxy(this._onLoginDialogCloseButtonClicked, this));
            this.loginDialog.bind($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_FACEBOOK_CONNECT_CLICKED, $.proxy(this._onLoginDialogFacebookConnectClicked, this));
            this.loginDialog.show();
        } catch (err) {
            this.debug('from: showLoginDialog of WatchlrVideoBorder. \nReason:' + e);
            // $kat.trackError({from: "showLoginDialog of WatchlrVideoBorder", msg: "Unable to show the login dialog.", exception:e});
        }
    },

    /**
     * hides the login dialog in the option button.
     */
    hideLoginDialog: function() {
        try {
            this.loginDialog.hide();
        } catch (err) {
            this.debug('from: hideLoginDialog of WatchlrVideoBorder. \nReason:' + e);
            // $kat.trackError({from: "hideLoginDialog of WatchlrVideoBorder", msg: "Unable to hide the login dialog.", exception:e});
        }
    },

    // ---------------------------------------------------------------------------
    //                              EVENT FUNCTIONS
    // ---------------------------------------------------------------------------

    /**
     * on mouse enter of options button
     * @param e
     */
    _onOptionsButtonMouseEnter: function(e) {
        try {
            if (e) e.stopPropagation();
            this.trigger($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_OPTIONS_BUTTON_MOUSE_ENTER);
        } catch (err) {
            this.debug('from: _onOptionsButtonMouseEnter of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onOptionsButtonMouseEnter of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * on mouse leave of options button
     * @param e
     */
    _onOptionsButtonMouseLeave: function(e) {
        try {
            if (e) e.stopPropagation();
            this.trigger($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_OPTIONS_BUTTON_MOUSE_LEAVE);
        } catch (err) {
            this.debug('from: _onOptionsButtonMouseLeave of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onOptionsButtonMouseLeave of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * on mouse enter for watchlr logo in options button
     * @param e
     */
    _onWatclrLogoMouseEnter : function(e) {
        try {
            if (e) e.stopPropagation();

            $(this.watchlrLogo).removeClass();
            $(this.watchlrLogo).addClass('watchlr-image watchlr-logo-hover-image');
        } catch (err) {
            this.debug('from: _onWatclrLogoMouseEnter of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onWatclrLogoMouseEnter of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * on mouse leave of watchlr logo in options button
     * @param e
     */
    _onWatclrLogoMouseLeave : function(e) {
        try {
            if (e) e.stopPropagation();

            $(this.watchlrLogo).removeClass();
            $(this.watchlrLogo).addClass('watchlr-image watchlr-logo-image');
        } catch (err) {
            this.debug('from: _onWatclrLogoMouseLeave of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onWatclrLogoMouseLeave of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * on watch later button mouse enter
     * @param e
     */
    _onSaveButtonMouseEnter : function(e) {
        try {
            if (e) e.stopPropagation();
            switch (this.saveButtonState) {
                case $cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER: {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_OVER_WATCH_LATER);
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.SAVED: {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_OVER_SAVED);
                    break;
                }
            }
        } catch (err) {
            this.debug('from: _onSaveButtonMouseEnter of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onSaveButtonMouseEnter of WatchlrVideoBorder", exception:err});
        }
    },

    _onSaveButtonMouseLeave : function(e) {
        try {
            if (e) e.stopPropagation();
            switch (this.saveButtonState) {
                case $cwui.WatchlrVideoBorder.SaveButtonState.WATCH_LATER: {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_LEAVE_WATCH_LATER);
                    break;
                }

                case $cwui.WatchlrVideoBorder.SaveButtonState.SAVED: {
                    this.setSaveButtonState($cwui.WatchlrVideoBorder.SaveButtonState.MOUSE_LEAVE_SAVED);
                    break;
                }
            }
        } catch (err) {
            this.debug('from: _onSaveButtonMouseLeave of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onSaveButtonMouseLeave of WatchlrVideoBorder", exception:err});
        }
    },

    _onLikeButtonMouseEnter : function(e) {
        try {
            if (e) e.stopPropagation();
            switch (this.likeButtonState) {
                case $cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED: {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_OVER_UNLIKED);
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.LIKED: {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_OVER_LIKED);
                    break;
                }
            }
        } catch (err) {
            this.debug('from: _onLikeButtonMouseEnter of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onLikeButtonMouseEnter of WatchlrVideoBorder", exception:err});
        }
    },

    _onLikeButtonMouseLeave : function(e) {
        try {
            if (e) e.stopPropagation();
            switch (this.likeButtonState) {
                case $cwui.WatchlrVideoBorder.LikeButtonState.UNLIKED: {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_LEAVE_UNLIKED);
                    break;
                }

                case $cwui.WatchlrVideoBorder.LikeButtonState.LIKED: {
                    this.setLikeButtonState($cwui.WatchlrVideoBorder.LikeButtonState.MOUSE_LEAVE_LIKED);
                    break;
                }
            }
        } catch (err) {
            this.debug('from: _onLikeButtonMouseLeave of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onLikeButtonMouseLeave of WatchlrVideoBorder", exception:err});
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
            this.trigger($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_SAVE_BUTTON_CLICKED);
        } catch (err) {
            this.debug('from: _onSaveButtonClicked of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onSaveButtonClicked of WatchlrVideoBorder", exception:err});
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
            this.trigger($cwui.WatchlrVideoBorder.WatchlrVideoBorderEvents.ON_LIKE_BUTTON_CLICKED);
        } catch (err) {
            this.debug('from: _onLikeButtonClicked of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onLikeButtonClicked of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * when user clicked the close button in login dialog
     * @param e
     */
    _onLoginDialogCloseButtonClicked: function(e) {
         try {
            if (e) e.stopPropagation();
            this.trigger($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_CLOSE_BUTTON_CLICKED);
        } catch (err) {
            this.debug('from: _onLoginDialogCloseButtonClicked of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onLoginDialogCloseButtonClicked of WatchlrVideoBorder", exception:err});
        }
    },

    /**
     * When user clicked facebook connect in login dialog
     * @param e
     */
    _onLoginDialogFacebookConnectClicked: function(e) {
         try {
            if (e) e.stopPropagation();
            this.trigger($cwui.FacebookConnectDialog.FacebookConnectDialogEvents.ON_FACEBOOK_CONNECT_CLICKED);
        } catch (err) {
            this.debug('from: _onLoginDialogFacebookConnectClicked of WatchlrVideoBorder. \nReason:' + err);
            // $kat.trackError({from: "_onLoginDialogFacebookConnectClicked of WatchlrVideoBorder", exception:err});
        }
    }
});