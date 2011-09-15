/**
 * @package com.watchlr.ui.modalwin
 */

$.Class.extend("com.watchlr.ui.WatchlrPitchDialog", {
    FacebookConnectDialogEvents : {
        ON_CLOSE_BUTTON_CLICKED : "wpclose",
        ON_ACTIVATE_BUTTON_CLICKED: "wpactivate",
        ON_DISMISS_BUTTON_CLICKED: "wpdismiss"
    }
}, {
    /**
     * Local variables.
     */
    _watchlrVideoBorderOptionsButton: null,
    _watchlrPitchDialog: null,

    /**
     * Utility for binding events to this class.
     * @param eventName
     * @param _callback
     */
    bind: function(eventName, _callback) {
        $(this._watchlrPitchDialog).bind(eventName, _callback);
    },

    /**
     * Utility for firing events
     * @param eventName
     * @param paramArray
     */
    trigger: function(eventName, paramArray) {
        if (paramArray) {
            $(this._watchlrPitchDialog).trigger(eventName, paramArray);
        } else {
            $(this._watchlrPitchDialog).trigger(eventName);
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
     * creates the facebook connect dialog
     * @param elem
     */
    create: function(elem, doc) {
        if (!elem) return;

        this._watchlrVideoBorderOptionsButton = elem;
        $(this._watchlrVideoBorderOptionsButton).append($cws.html['WatchlrPitchDialog']);
        $cwutil.Styles.insert('WatchlrPitchDialogStyles', doc);

        this._watchlrPitchDialog = $(this._watchlrVideoBorderOptionsButton).find('#watchlr-pitch-dialog-container').get(0);
        $($(this._watchlrPitchDialog).find('a.watchlr-close-button')).click($.proxy(this._onCloseCallback, this));
        $($(this._watchlrPitchDialog).find('a.watchlr-pitch-activate')).click($.proxy(this._onActivateCallback, this));
    },

    /**
     * removes the facebook connect dialog
     */
    remove: function() {
        $(this._watchlrPitchDialog).detach();
    },

    /**
     * shows the facebook connect dialog
     */
    show: function() {
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-logo').get(0).hide();
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-like-btn-img').get(0).hide();
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-like-btn-text').get(0).hide();
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-watch-later-btn-img').get(0).hide();
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-watch-later-btn-text').get(0).hide();
        $(this._watchlrVideoBorderOptionsButton).find('#watchlr-slash').each(function(elem) { $(elem).hide(); });
        $(this._watchlrPitchDialog).show();
        this._makeDialogVisibleInViewPort();
    },

    /**
     * hides and then removes the facebook connect dialog.
     */
    hide: function() {
        $(this._watchlrPitchDialog).fadeOut();
        this.remove();
    },

    /**
     * returns whether the facebook connect dialog is visible.
     */
    isVisible: function() {
        var visibility = $(this._watchlrPitchDialog).css('display');
        return visibility && visibility != 'none';
    },

    /**
     * on close button clicked
     */
    _onCloseCallback: function () {
        this.hide();
    },

    /**
     * on facebook connect button or 'Sign in with facebook' link clicked
     */
    _onActivateCallback: function() {
    }

});