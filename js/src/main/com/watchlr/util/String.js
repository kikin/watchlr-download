$.Class.extend("com.watchlr.util.String", {
    stripTags: function(str) {
    	if (str) return str.replace(/(<([^>]+)>)/ig,"");
    	return str;
	},

    parseQueryString: function(str) {
        /*// this.debug('string to be parsed:' + str);
        var queryStringStartPos = str.indexOf('?');
        // this.debug('Start pos: ' + queryStringStartPos);
        if (queryStringStartPos != -1) {
            var queryString = str.substr(queryStringStartPos + 1, (str.length - queryStringStartPos - 1));
            // this.debug('queryString:' + queryString);
            if (queryString) {
                var params = {};
                var paramsList = queryString.split('&');
                for (var i = 0; i < paramsList.length; i++) {
                    var paramPair = paramsList[i];
                    // this.debug('Param pair: ' + paramPair);
                    var equalPos = paramPair.indexOf('=');
                    // this.debug('equal pos: ' + equalPos);
                    if (paramPair && equalPos != -1) {
                        var paramKey = paramPair.substr(0, equalPos);
                        // this.debug('param key: ' + paramKey);
                        var paramValue = paramPair.substr(equalPos + 1, (paramPair.length - equalPos - 1));
                        // this.debug('param value: ' + paramValue);
                        params[paramKey] = paramValue;
                    }
                }

                return params;
            }
        }

        return null;*/
        var vars = str.split(/[&;]/), res = {};
		try{//K_MOD try/catch - http://www.amazon.de/s/ref=nb_sb_noss?__mk_de_DE=%C5M%C5Z%D5%D1&url=search-alias%3Daps&field-keywords=skincom+sonnenzelt&x=0&y=0
            if (vars.length) {
                for (var i = 0; i < vars.length; i++) {
                    var val = vars[i];
                    var index = val.indexOf('=');

                    if (index > -1) {
                        res[val.substr(0, index)] = val.substr(index + 1);
                    }

                    /*keys = index < 0 ? [''] : val.substr(0, index).match(/[^\]\[]+/g),
                    value = decodeURIComponent(val.substr(index + 1));

                    obj = res;
                    for (var j in keys) {
                        var current = obj[key];
                        if(i < keys.length - 1)
                            obj = obj[key] = current || {};
                        else if($type(current) == 'array')
                            current.push(value);
                        else
                            obj[key] = $defined(current) ? [current, value] : value;
                    }
                    keys.each(function(key, i){

                    });*/
                }
            }
		}catch(e){}
		return res;
    }

}, {});