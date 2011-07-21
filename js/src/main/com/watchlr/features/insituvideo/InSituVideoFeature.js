/**
 * @package com.watchlr.features.insituvideo
 */
$.Class.extend("com.watchlr.features.insituvideo.InSituVideoFeature", {
    getSwiffData: function(a) {
        try {
            var aHref = typeof(a) == 'string' ? a : unescape($(a).attr('href')),
                playerSrc = null,
                flashvars = {
                    autoplay: true
                };

            if (aHref.indexOf(".myvideo.") !== -1) {
                var match = aHref.match(/www\.myvideo\.de\/watch\/(.*)\//i);
                if (match) playerSrc = 'http://www.myvideo.de/movie/'+match[1];
            } else if (aHref.indexOf(".youtube.") !== -1) {
                var v = $cwutil.String.parseQueryString(aHref.match(/watch\?(.*)/)[1]).v;
                playerSrc = 'http://www.youtube.com/v/' + v + "&border=0&enablejsapi=1&fs=1&autoplay=1&playerapiid=resultsPlayer";
            } else if (aHref.indexOf("video.foxnews.com") !== -1) {
                var videoId = aHref.match(/\/v\/([0-9]+)/)[1];
                playerSrc = 'http://video.foxnews.com/assets/akamai/FoxNewsPlayer.swf';
                flashvars = {
                    location: aHref,
                    core_ads_enabled: true,
                    core_swf_url: undefined,
                    core_omniture_player_name: 'fullpage',
                    core_omniture_account: 'foxnewsmaven',
                    core_ad_player_name: 'fullpage',
                    core_yume_ad_library_url: 'http://video.foxnews.com/assets/akamai/yume_ad_library.swf',
                    core_yume_player_url: 'http://video.foxnews.com/assets/akamai/yume_player_4x3.swf',
                    auto_play: true,
                    video_id: videoId,
                    settings_url: 'http://video.foxnews.com/assets/akamai/resources/conf/config.xml?b',
                    show_autoplay_overlay: true,
                    auto_play_list: true,
                    cache_bust_key: new Date().getTime(),
                    autoplay: true,
                    data_feed_url: 'http://video.foxnews.com/v/feed/video/'+videoId+'.js?template=grab'
                };
            } else if (aHref.indexOf("video.foxbusiness.com") !== -1) {
                var videoId = aHref.match(/\/v\/([0-9]+)\//)[1];
                playerSrc = 'http://video.foxnews.com/assets/akamai/FoxNewsPlayer.swf';
                flashvars = {
                    location: aHref,
                    core_ads_enabled: true,
                    core_swf_url: undefined,
                    core_omniture_player_name: 'fullpage',
                    core_omniture_account: 'foxnewsbusinessmaven',
                    core_ad_player_name: 'fullpage',
                    core_yume_ad_library_url: 'http://video.foxbusiness.com/assets/akamai/yume_ad_library.swf',
                    core_yume_player_url: 'http://video.foxbusiness.com/assets/akamai/yume_player_4x3.swf',
                    auto_play: true,
                    video_id: videoId,
                    settings_url: 'http://video.foxbusiness.com/assets/akamai/resources/conf/config-fb.xml?b',
                    show_autoplay_overlay: true,
                    auto_play_list: true,
                    cache_bust_key: new Date().getTime(),
                    autoplay: true,
                    data_feed_url: 'http://video.foxbusiness.com/v/feed/video/'+videoId+'.js?template=grab'
                };
            } else if (aHref.indexOf("video.google") !== -1) {
                var googleDocP = $($(a).parents("td")).next("td");
                var googleDocId;
                if($(googleDocP).find("a.l").get(0)) googleDocId = $($(googleDocP).find("a.l").get(0)).attr("href").slice(40, 59);
                else if($(googleDocP).find('cite').get(0)) googleDocId = $cwutil.String.stripTags($($(googleDocP).find('cite').get(0)).html()).substr(33);
                else return;
                playerSrc = "http://video.google.com/googleplayer.swf?docid=" + googleDocId + "&hl=en&autoplay=1";
            } else {
                var oImg = $(a).find('img');
                if(oImg && $(oImg).attr('embedid')) {
                    playerSrc = 'http://www.hulu.com/embed/'+ $(oImg).attr('embedid');
                }
            }
            return {
                src: playerSrc,
                vars: flashvars
            };
        } catch (err) {
            console.log("From: getSwiffData of InSituVideoFeature. \nReason: " + err);
            // $kat.trackError({from: 'getSwiffData of InSituVideoFeature.', msg: '', exception: err});
        }

        return null;
    }
}, {});