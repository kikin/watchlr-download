$.Class.extend("com.watchlr.system.Tracker", {
    track: function(evtCategory, evtName, evtValue) {
        var obj = { 'name': evtName, 'value': evtValue };
        if (evtCategory == 'VideoAdapterEvt') {
            $cws.WatchlrRequests.sendEventTrackingRequest(obj);
        } else if (evtCategory == 'Video') {
            $cws.WatchlrRequests.sendActionTrackingRequest(obj);
        }
    },

    trackError: function(errorObj) {
        errRequest = {location: errorObj['from'], message: errorObj['msg'], exception: errorObj['exception']};
        $cws.WatchlrRequests.sendErrorTrackingRequest(errRequest);
    }
}, {});
