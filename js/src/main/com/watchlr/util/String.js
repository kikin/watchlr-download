$.Class.extend("com.watchlr.util.String", {
    stripTags: function(str) {
    	if (str) return str.replace(/(<([^>]+)>)/ig,"");
    	return str;
	},

    parseQueryString: function(str) {
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