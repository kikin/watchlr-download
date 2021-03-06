/**
 * @package com.watchlr.ui.modalwin
 */

$.Class.extend("com.watchlr.ui.VideoSavedDialog", {
    VideoSavedDialogEvents : {
        ON_CLOSE: "vsclosed",
        ON_HOME_PAGE_LINK_CLICKED: "vshomepagelinkclicked"
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
     * creates the video saved dialog
     * @param elem - element in which dialog needs to be inserted
     * @param doc - document in which style sheets are inserted.
     */
    create: function(elem, doc) {
        if (!elem) return;

        this._watchlrVideoBorderOptionsButton = elem;
        $(this._watchlrVideoBorderOptionsButton).append($cws.html['VideoSavedDialog']);
        $cwutil.Styles.insert('VideoSavedDialogStyles', doc);

        this._videoSavedDialog = $(this._watchlrVideoBorderOptionsButton).find('#watchlr-video-saved-dialog').get(0);

        $($(this._videoSavedDialog).find('a.watchlr-ok-button')).click($.proxy(this._onOkButtonClicked, this));
        $($(this._videoSavedDialog).find('#watchlr-video-page')).click($.proxy(this._onHomePageLinkClicked, this));
        $($(this._videoSavedDialog).find('#watchlr-show-message')).click($.proxy(this._onShowMessageClicked, this));
    },

    /**
     * removes the dialog from th parent element.
     */
    remove: function() {
        $(this._videoSavedDialog).detach();
    },

    /**
     * shows the dialog
     */
    show: function() {
    	$(this._videoSavedDialog).fadeIn();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '12px');
        this._makeDialogVisibleInViewPort();
    },

    /**
     * hides the dialog
     */
    hide: function() {
        $(this._videoSavedDialog).fadeOut();
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
     * when user clicks on OK button
     */
    _onOkButtonClicked: function () {
        this.trigger($cwui.VideoSavedDialog.VideoSavedDialogEvents.ON_CLOSE, [this._checked]);
        this.hide();
    },

    /**
     * when user clicks on the checkbox to not show the message again
     * @param e
     */
    _onShowMessageClicked: function(e) {
        this._checked = e.target.checked;
    },

    /**
     * when user clicks on home page link
     */
    _onHomePageLinkClicked: function() {
        this.trigger($cwui.VideoSavedDialog.VideoSavedDialogEvents.ON_HOME_PAGE_LINK_CLICKED);
    }
    
});
