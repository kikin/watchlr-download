/**
 * @package com.watchlr.ui.modalwin
 */

$cwui.modalwin.WatchlrIframeWindow.extend("com.watchlr.ui.VideoSavedDialog", {
    VideoSavedDialogEvents : {
        ON_CLOSE_BUTTON_CLICKED: "close"
    }
}, {
    /**
     * Local variables.
     */
    _checked: false,
    _watchlrVideoBorderOptionsButton: null,
    _videoSavedDialog: null,

    /**
     * Utility for binding events to this class.
     * @param eventName
     * @param _callback
     */
    bind: function(eventName, _callback) {
        $(this._videoSavedDialog).bind(eventName, _callback);
    },

    /**
     * Utility for firing events
     * @param eventName
     * @param paramArray
     */
    trigger: function(eventName, paramArray) {
        if (paramArray) {
            $(this._videoSavedDialog).trigger(eventName, paramArray);
        } else {
            $(this._videoSavedDialog).trigger(eventName);
        }
    },

    create: function(elem, doc) {
        if (!elem) return;

        this._watchlrVideoBorderOptionsButton = elem;
        $(this._watchlrVideoBorderOptionsButton).append($cws.html['VideoSavedDialog']);
        $cwutil.Styles.insert('VideoSavedWindowDioalog', doc);

        this._videoSavedDialog = $(this._watchlrVideoBorderOptionsButton).find('#watchlr-video-saved-dialog').get(0);

        $($(this._videoSavedDialog).find('a.watchlr-close-button')).click($.proxy(this._onCloseCallback, this));
        $($(this._videoSavedDialog).find('a.watchlr-ok-button')).click($.proxy(this._onOkCallback, this));
        $($(this._videoSavedDialog).find('#watchlr-video-page')).click($.proxy(this._onVisitUserProfilePageCallback, this));
        $($(this._videoSavedDialog).find('#show-message')).click($.proxy(this._onShowMessageClicked, this));
    },

    remove: function() {
        $(this._videoSavedDialog).detach();
    },
    
    show: function() {
    	$(this._videoSavedDialog).fadeIn();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '12px');
    },

    hide: function() {
        $(this._videoSavedDialog).fadeOut();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '0px');
        this.remove();
    },

    _onCloseCallback: function () {
        this.hide();
        this.trigger('close', [false]);
    },

    _onOkCallback: function () {
        this.hide();
        this.trigger('close', [this._checked]);
    },

    _onShowMessageClicked: function(e) {
        this._checked = e.target.checked;
    },

    _onVisitUserProfilePageCallback: function() {
        this.trigger('visituserprofilepage');
    }
    
});
