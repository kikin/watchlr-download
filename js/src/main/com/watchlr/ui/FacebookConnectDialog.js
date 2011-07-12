/**
 * @package com.watchlr.ui.modalwin
 */

$.Class.extend("com.watchlr.ui.FacebookConnectDialog", {
    FacebookConnectDialogEvents : {
        ON_CLOSE_BUTTON_CLICKED : "close",
        ON_FACEBOOK_CONNECT_CLICKED: "connect"
    }
}, {
    /**
     * Local variables.
     */
    _watchlrVideoBorderOptionsButton: null,
    _facebookConnectDialog: null,

    /**
     * Utility for binding events to this class.
     * @param eventName
     * @param _callback
     */
    bind: function(eventName, _callback) {
        $(this._facebookConnectDialog).bind(eventName, _callback);
    },

    /**
     * Utility for firing events
     * @param eventName
     * @param paramArray
     */
    trigger: function(eventName, paramArray) {
        if (paramArray) {
            $(this._facebookConnectDialog).trigger(eventName, paramArray);
        } else {
            $(this._facebookConnectDialog).trigger(eventName);
        }
    },

    /**
     * creates the facebook connect dialog
     * @param elem
     */
    create: function(elem, doc) {
        if (!elem) return;

        this._watchlrVideoBorderOptionsButton = elem;
        $(this._watchlrVideoBorderOptionsButton).append($cws.html['FacebookConnectDialog']);
        $cwutil.Styles.insert('FacebookConnectDialogStyles', doc);

        this._facebookConnectDialog = $(this._watchlrVideoBorderOptionsButton).find('#watchlr-facebook-connect-dialog').get(0);
        $($(this._facebookConnectDialog).find('a.watchlr-close-button')).click($.proxy(this._onCloseCallback, this));
        $($(this._facebookConnectDialog).find('a.watchlr-fb-connect')).click($.proxy(this._onConnectCallback, this));
        $($(this._facebookConnectDialog).find('#watchlr-facebook-sign-in')).click($.proxy(this._onConnectCallback, this));
    },

    /**
     * removes the facebook connect dialog
     */
    remove: function() {
        $(this._facebookConnectDialog).detach();
    },

    /**
     * shows the facebook connect dialog
     */
    show: function() {
        $(this._facebookConnectDialog).fadeIn();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '12px');
    },

    /**
     * hides and then removes the facebook connect dialog.
     */
    hide: function() {
        $(this._facebookConnectDialog).fadeOut();
        $(this._watchlrVideoBorderOptionsButton).css('padding-bottom', '0');
        this.remove();
    },

    /**
     * on close button clicked
     */
    _onCloseCallback: function () {
        this.hide();
        this.trigger('close');
    },

    /**
     * on facebook connect button or 'Sign in with facebook' link clicked
     */
    _onConnectCallback: function() {
        this.trigger('connect');
    }

});