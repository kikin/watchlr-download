/**
 * @package com.watchlr.ui.modalwin
 */

$.Class.extend("com.watchlr.ui.VideoLikedDialog", {
    VideoLikedDialogEvents: {
        ON_CLOSE: "vlclosed",
        ON_HOME_PAGE_LINK_CLICKED: "vlhomepagelinkclicked"
    }
}, {
    /**
     * Local variables.
     */
    _checked: true,
    _watchlrVideoBorderOptionsButton: null,
    _videoLikedDialog: null,

    /**
     * Utility for binding events to this class.
     * @param eventName
     * @param _callback
     */
    bind: function(eventName, _callback) {
        $(this._videoLikedDialog).bind(eventName, _callback);
    },

    /**
     * Utility for firing events
     * @param eventName
     * @param paramArray
     */
    trigger: function(eventName, paramArray) {
        if (paramArray) {
            $(this._videoLikedDialog).trigger(eventName, paramArray);
        } else {
            $(this._videoLikedDialog).trigger(eventName);
        }
    },

    /**
     * Make dialog visible in viewport.
     */
    _makeDialogVisibleInViewPort: function() {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(this._watchlrVideoBorderOptionsButton).offset().top;
        var elemBottom = elemTop + $(this._watchlrVideoBorderOptionsButton).height();

        if (elemBottom >= docViewBottom) {
            $(window).scrollTop(docViewTop + (elemBottom - docViewBottom) + 20);
        }
    },

    /**
     * creates the video liked dialog.
     * @param elem - element in which dialog should be appended.
     * @param doc - document in which style sheets should be inserted.
     */
    create: function(elem, doc) {
        if (!elem) return;

        this._watchlrVideoBorderOptionsButton = elem;
        $(this._watchlrVideoBorderOptionsButton).append($cws.html['VideoLikedDialog']);
        $cwutil.Styles.insert('VideoLikedDialogStyles', doc);

        this._videoLikedDialog = $(this._watchlrVideoBorderOptionsButton).find('#watchlr-video-liked-dialog').get(0);

        $($(this._videoLikedDialog).find('a.watchlr-ok-button')).click($.proxy(this._onOkButtonClicked, this));
        $($(this._videoLikedDialog).find('#watchlr-user-profile')).click($.proxy(this._onHomePageLinkClicked, this));
        $($(this._videoLikedDialog).find('#watchlr-fb-push-message')).click($.proxy(this._onFacebookPushMessageClicked, this));
    },

    /**
     * removes the dialog from the parent element.
     */
    remove: function() {
        $(this._videoLikedDialog).detach();
    },

    /**
     * show the dialog.
     */
    show: function() {
    	$(this._videoLikedDialog).fadeIn();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '12px');
        this._makeDialogVisibleInViewPort();
    },

    /**
     * hides the dialog.
     */
    hide: function() {
        $(this._videoLikedDialog).fadeOut();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '0px');
        this.remove();
    },

    /**
     * returns whether the dialog is visible.
     */
    isVisible: function() {
        var visibility = $(this._videoSavedDialog).css('display');
        return visibility && visibility != 'none';
    },

    /**
     * when user clicks on Ok button to dismiss dialog.
     */
    _onOkButtonClicked: function () {
        this.trigger($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_CLOSE, [this._checked]);
        this.hide();
    },

    /**
     * when user clicks on the option button to disable the
     * pushing of liked videos to facebook.
     *
     * @param e
     */
    _onFacebookPushMessageClicked: function(e) {
        this._checked = (e.target.checked ? 1 : 0);
    },

    /**
     * when user clicks on the home page button.
     */
    _onHomePageLinkClicked: function() {
        this.trigger($cwui.VideoLikedDialog.VideoLikedDialogEvents.ON_HOME_PAGE_LINK_CLICKED);
    }
    
});
