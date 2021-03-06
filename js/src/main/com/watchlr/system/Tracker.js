$.Class.extend("com.watchlr.system.Tracker", {
    track: function(evtCategory, evtName, evtValue) {
        if (evtCategory == 'VideoAdapterEvt') {
            var obj = { 'name': evtName, 'value': evtValue };
            $cws.WatchlrRequests.sendEventTrackingRequest(obj);
        } else if (evtCategory == 'Video') {
            var obj = { 'action': evtName, 'id': evtValue };
            $cws.WatchlrRequests.sendActionTrackingRequest(obj);
        }
    },

    trackError: function(errorObj) {
        if (com.watchlr.environment == "local") {
            var errorStr = "from: " + errorObj['from'];
            if (errorObj['msg'])
                errorStr += "\nmsg: " + errorObj['msg'];
            errorStr += "\nerror: " + ($.browser.msie ? errorObj['exception'].description : errorObj['exception'].message);
            $cwutil.Logger.debug(errorStr);
        } else {
            var errRequest = {location: errorObj['from'], message: errorObj['msg'], exception: JSON.stringify(errorObj['exception'])};
            $cws.WatchlrRequests.sendErrorTrackingRequest(errRequest);
        }
    }

}, {});
