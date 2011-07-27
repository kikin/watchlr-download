$.Class.extend("com.watchlr.util.Logger", {
    debug: function(debugStr) {
        if (com.watchlr.environment == "local") {
            console.log(debugStr);
        }
    }
}, {});
