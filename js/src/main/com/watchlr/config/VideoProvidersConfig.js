/**
 * @package com.watchlr.config
 */

$.Class.extend("com.watchlr.config.VideoProvidersConfig", {
    services : [
        {
            domains: ['youtube.com', 's.ytimg.com', 'youtube-nocookie.com'],
            source_regex: [/youtube.com\/v\/([\_\-a-zA-Z0-9]+)/, /youtube\.com\/embed\/([\_\-a-zA-Z0-9]+)/, /youtube-nocookie.com\/v\/([\_\-a-zA-Z0-9]+)/],
            flash_regex: [/&video_id=([\_\-a-zA-Z0-9]+)/i],
            url_regex: [/youtube\.com\/watch\?v=([\_\-a-zA-Z0-9]+)/i],
            url: 'http://www.youtube.com/watch?v='
        },
        {
            domains: ['vimeo.com', 'vimeocdn.com'],
            source_regex: [/vimeo\.com\/video\/([0-9]+)/i, /vimeo\.com\/moogaloop\.swf.*clip_id=([0-9]+)/i],
            flash_regex: [/&clip_id=([0-9]+)/i],
            url_regex: [/vimeo\.com\/([0-9]+)/i],
            url: 'http://www.vimeo.com/'
        },
        {
            domains: ['facebook.com'],
            source_regex: [],
            flash_regex: [/video_id=([0-9]+)/],
            url_regex: [/facebook\.com\/video\/video\.php\?v=([0-9]+)/i],
            url: 'http://www.facebook.com/v/'
        },
        {
            domains: ['cdn.turner.com/cnn', 'cdn.turner.com/money'],
            source_regex: [/videoId=([^&]+)/i, /video\/(.+)d+xd+\.jpg/i, /money\/video\/(.+)d+xd+\.jpg/i],
            flash_regex: [/contentId=([^&]+)/i],
            url_regex: [/cnn\.com\/video\/.\/video\/([^&]+)/i],
            url: 'http://www.cnn.com/video/?/video/'
        },
        /*
        {
            domains: ['justin.tv'],
            source_regex: [],
            flash_regex: [/(channel=([^&]+).*&archive_id=([0-9]+))|(archive_id=([0-9]+).*&channel=([^&]+))/i],
            url_regex: [/justin.tv\/([^&]+).*\/b\/([0-9]+)/i],
            url: function(x) {
                if (x[5]) {
                    var channel = x[6], archive = x[5];
                } else {
                    var channel = x[2], archive = x[3];
                }
                return 'http://www.justin.tv/' + channel + '/b/' + archive;
            }
        },
        */
        {
            domains: ['ustream.tv'],
            source_regex: [],
            flash_regex: [/channelid=([^&]+)/i, /cid=([^&]+)/i],
            url_regex: [/ustream\.tv\/channel\/([^&]+)/i],
            url: 'http://www.ustream.tv/channel/'
        },
        {
            domains: ['ustream.tv'],
            source_regex: [],
            flash_regex: [/vid=([0-9]+)/i],
            url_regex: [/ustream\.tv\/recorded\/([0-9]+)/i],
            url: 'http://www.ustream.tv/recorded/'
        },
        {
            domains: ['revision3.com'],
            source_regex: [/revision3\.com\/player/],
            flash_regex: [],
            url_regex: [/(http:\/\/revision3\.com\/.*)/i],
            use_location: true,
            location_regex: /revision3\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+(\/|\?.*|$)$/,
            url: ''
        },
        /*
        {
            domains: ['dailymotion.com'],
            source_regex: [/dailymotion\.com\/swf\/video\/([a-zA-Z0-9]+)/, /dailymotion\.com\/swf\/([a-zA-Z0-9]+)/, /dailymotion\.com\/.*\/video\/([a-zA-Z0-9]+)\.mp4/],
            flash_regex: [/"videoId":"([a-zA-Z0-9]+)"/, /www.dailymotion.com\/video\/([a-zA-Z0-9]+)_/],
            url_regex: [/dailymotion\.com\/video\/([a-zA-Z0-9_\-]+)/],
            url: 'http://www.dailymotion.com/video/'
        },
        {
            domains: ['collegehumor.com'],
            source_regex: [/clip_id=([0-9]+)/i],
            flash_regex: [/clip_id=([0-9]+)/i],
            url_regex: [/collegehumor\.com\/video:([0-9]+)/i],
            url: 'http://www.collegehumor.com/video/'
        },

        {
            domains: ['twitvid.com'],
            source_regex: [/twitvid.com\/player\/([A-Z0-9]+)/],
            flash_regex: [/twitvid.com\/playVideo_([A-Z0-9]+)/],
            url_regex: [/twitvid\.com\/([A-Z0-9]+)/],
            url: 'http://www.twitvid.com/'
        },

        {
            domains: ['break.com'],
            source_regex: [],
            flash_regex: [/sLink=(.*)&EmbedSEOLinkKeywords/],
            url_regex: [/(http:\/\/.*\.break\.com\/.*)/i],
            url: ''
        },
        {
            domains: ['myspace.com/videos'],
            source_regex: [/&amp;el=(.*)&amp;on/, /&el=(.*)&on/],
            flash_regex: [],
            url_regex: [/(http:\/\/www\.myspace.com\/index\.cfm\?fuseaction=.*&videoid.*)/, /(http:\/\/vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*)/],
            url: ''
        },
        {
            domains: ['mediaservices.myspace.com'],
            source_regex: [/embed\.aspx\/m=([0-9]+)/],
            flash_regex: [],
            url_regex: [/myspace\.com\/video\/vid\/([0-9]+)/i],
            url: 'http://www.myspace.com/video/vid/'
        },
        {
            // metacafe
            domains: ['mcstatic.com'],
            source_regex: [],
            flash_regex: [/pageURL=([^&]+)/],
            url: ''
        },
        {
            domains: ['metacafe.com'],
            source_regex: [/metacafe\.com\/fplayer\/([0-9]+)\//],
            flash_regex: [],
            url_regex: [/metacafe\.com\/watch\/([0-9]+)/i],
            url: 'http://www.metacafe.com/watch/'
        },
        */
        {
            domains: ['blip.tv'],
            source_regex: [/http:\/\/blip\.tv\/play\/([A-Za-z0-9]+)/],
            flash_regex: [],
            url_regex: [/blip\.tv\/players\/episode\/([A-Za-z0-9]+)/],
            url: 'http://blip.tv/players/episode/'
        },
        {
            domains: ['blip.tv'],
            source_regex: [/blip\.tv\/scripts\/flash\/stratos\.swf/],
            flash_regex: [],
            url_regex: [/(http:\/\/blip\.tv\/file\/[0-9]+)/i],
            use_location: true,
            location_regex: /blip\.tv\/[\-a-z]+\/[\-a-z0-9]+/,
            url: ''
        },
        /*
        {
            domains: ['video.google.com'],
            source_regex: [/docid=([\-0-9]+)/i],
            flash_regex: [],
            url_regex: [/video\.google\.com\/videoplay\?docid=([\-0-9]+)/i],
            url: 'http://video.google.com/videoplay?docid='
        },
        {
            domains: ['revver.com'],
            source_regex: [/mediaId=([0-9]+)/],
            flash_regex: [/mediaId=([0-9]+)/],
            url_regex: [/revver\.com\/video\/([0-9]+)/i],
            url: 'http://revver.com/video/'
        },
        {
            domains: ['viddler.com'],
            source_regex: [/viddler\.com\/player/],
            flash_regex: [],
            url_regex: [/(http:\/\/.*viddler\.com\/explore\/.*\/videos\/.*)/i],
            use_location: true,
            location_regex: /viddler\.com\/explore\/.+?\/videos\/.+/,
            url: ''
        },
        {
            domains: ['liveleak.com'],
            source_regex: [/liveleak\.com\/e\/([0-9a-z]+_[0-9]+)/],
            flash_regex: [/token=([0-9a-z]+_[0-9]+)/],
            url_regex: [/liveleak\.com\/view\?i=([0-9a-z]+_[0-9]+)/i],
            url: 'http://liveleak.com/view?i='
        },
        {
            domains: ['dotsub.com'],
            source_regex: [/dotsub\.com\/media\/([\-0-9a-z]+)/],
            flash_regex: [/uuid=([\-0-9a-z]+)/],
            url_regex: [/dotsub\.com\/view\/([\-0-9a-z]+)/i],
            url: 'http://dotsub.com/view/'
        },
        {
            domains: ['overstream.net'],
            source_regex: [],
            flash_regex: [/oid=([0-9a-z]+)/],
            url_regex: [/overstream\.net\/view\.php\?oid=([0-9a-z]+)/i],
            url: 'http://www.overstream.net/view.php?oid='
        },
        {
            domains: ['livestream.com'],
            source_regex: [],
            flash_regex: [/(channel=([^&]+).*&clip=([_\-a-zA-Z0-9]+))|(clip=([_\-a-zA-Z0-9]+).*&channel=([^&]+))/i],
            url_regex: [/livestream\.com\/([^&]+)\/video\?clipId=\/([_\-a-zA-Z0-9]+)/],
            url: function(x) {
                if (x[5]) {
                    var channel = x[6], clip = x[5];
                } else {
                    var channel = x[2], clip = x[3];
                }
                return 'http://www.livestream.com/' + channel + '/video?clipId=' + clip;
            }
        },
        {
            domains: ['worldstarhiphop.com'],
            source_regex: [/worldstarhiphop\.com\/videos\/e\/[0-9]+\/(wshh[a-zA-Z0-9]+)/],
            flash_regex: [/vl=(wshh[a-zA-Z0-9]+)/],
            url_regex: [/worldstarhiphop\.com\/videos\/video\.php\?v=(wshh[a-zA-Z0-9]+)/i],
            url: 'http://www.worldstarhiphop.com/videos/video.php?v='
        },
        {
            domains: ['teachertube.com'],
            source_regex: [],
            flash_regex: [/pg=video_([0-9]+)/],
            url_regex: [/teachertube\.com\/viewVideo\.php\?video_id=([0-9]+)/i],
            url: 'http://www.teachertube.com/viewVideo.php?video_id='
        },
        {
            domains: ['teachertube.com'],
            source_regex: [],
            flash_regex: [/viewKey=([A-Z0-9]+)/i],
            url_regex: [/teachertube\.com\/view_video\.php\?viewkey=([A-Z0-9]+)/i],
            url: 'http://www.teachertube.com/view_video.php?viewkey='
        },
        {
            domains: ['bambuser.com'],
            source_regex: [/vid=([0-9]+)/],
            flash_regex: [],
            url_regex: [/bambuser\.com\/v\/([0-9]+)/i, /bambuser\.com\/.*\/([0-9]+)/i],
            url: 'http://www.bambuser.com/v/'
        },
        {
            domains: ['schooltube.com'],
            source_regex: [/schooltube\.com\/v\/[a-z0-9]+/],
            flash_regex: [],
            url_regex: [/(http:\/\/www\.schooltube\.com\/video\/[a-z0-9]+\/[\-a-zA-Z0-9]+)/i],
            use_location: true,
            location_regex: /schooltube\.com\/video\/[a-z0-9]+\/[\-a-zA-Z0-9]+/,
            url: ''
        },
        */
        {
            domains: ['bigthink.com'],
            source_regex: [/embeds\/video_idea\/([0-9]+)/],
            flash_regex: [],
            url_regex: [/bigthink\.com\/ideas\/([0-9]+)/i],
            url: 'http://www.bigthink.com/ideas/'
        },
        {
            domains: ['brightcove.com'],
            source_regex: [/brightcove\.com\/.+?&playerID=651017566001&/],
            flash_regex: [],
            use_location: true,
            location_regex: /bigthink\.com\/ideas\/[0-9]+/
        },
        {
            domains: ['brightcove.com'],
            source_regex: [/brightcove\.com\/.+?&playerID=651017566001&/],
            flash_regex: [],
            use_location: true,
            location_regex: /bigthink\.com\/series\/[0-9]+/
        },
        /*
        {
            domains: ['xtranormal.com'],
            source_regex: [],
            flash_regex: [/&link=([^&]+)/],
            url_regex: [/(http:\/\/www\.xtranormal\.com\/[^&]+)/i],
            url: ''
        },
        {
            domains: ['socialcam.com'],
            source_regex: [/socialcam\.com\/videos\/([a-zA-Z0-9]+)/],
            flash_regex: [/&id=video_([a-zA-Z0-9]+)/],
            url_regex: [/socialcam\.com\/v\/([a-zA-Z0-9]+)/i],
            url: 'http://socialcam.com/v/'
        },

        {
            domains: ['dipdive.com'],
            source_regex: [/&itemID=([0-9]+)/i, /play\.dipdive\.com\/i\/([0-9]+)/],
            flash_regex: [/&mediaID=([0-9]+)/i],
            url_regex: [/dipdive\.com\/media\/([0-9]+)/i],
            url: 'http://dipdive.com/media/'
        },

        {
            domains: ['snotr.com'],
            source_regex: [/snotr\.com\/embed\/([0-9]+)/],
            flash_regex: [/video=([0-9]+)/i],
            url_regex: [/snotr.com\/video\/([0-9]+)/i],
            url: 'http://www.snotr.com/video/'
        },
        */
        {
            domains: ['whitehouse.gov'],
            source_regex: [],
            flash_regex: [/&share_url=([^&]+)/],
            url_regex: [/(http:\/\/www\.whitehouse\.gov\/photos-and-video\/video\/.*)/i, /(http:\/\/www\.whitehouse\.gov\/video\/.*)/i, /(http:\/\/wh\.gov\/photos-and-video\/video\/.*)/i, /(http:\/\/wh\.gov\/video\/.*)/i],
            url: ''
        },
        /*
        {
            domains: ['hulu.com'],
            source_regex: [/hulu\.com\/embed\/([_\-a-zA-Z0-9]+)/],
            flash_regex: [],
            url: 'http://r.hulu.com/videos?eid='
        },
        {
            domains: ['crackle.com'],
            source_regex: [/crackle\.com\/flash/],
            flash_regex: [],
            url_regex: [/(http:\/\/(www\.)?crackle.com\/c\/.*)/i],
            use_location: true,
            location_regex: /http:\/\/(www\.)?crackle.com\/c\//,
            url: ''
        },
        {
            domains: ['xfinitytv.comcast.net'],
            source_regex: [/xfinitytv\.comcast\.net(\/[^?]+)/],
            flash_regex: [/<videoUrl>(.+?)<\/videoUrl>/],
            url_regex: [/fancast\.com\/(.+?\/videos)/i],
            url: 'http://www.fancast.com'
        },
        */
        {
            domains: ['funnyordie.com', 'ordienetworks.com'],
            source_regex: [],
            flash_regex: [/key=([a-zA-Z0-9]+)/],
            url_regex: [/funnyordie\.com\/videos\/([a-zA-Z0-9]+)/i],
            url: 'http://www.funnyordie.com/videos/'
        },
        {
            domains: ['ted.com'],
            source_regex: [],
            flash_regex: [/&adKeys=talk=([^;]+)/],
            url_regex: [/ted\.com\/talks\/([^;]+)\.html/i],
            url: function(id) { return 'http://www.ted.com/talks/' + id[1] + '.html'; }
        },
        {
            domains: ['player.ooyala.com'],
            // source_regex: [/player\.ooyala\.com\/static\/cacheable\/[0-9a-zA-Z]+\/player_v2\.swf/],
            flash_regex: [/externalId=espn:([0-9]+)/],
            url_regex: [/espn\.go\.com\/.+\/video\/.+\?videoId=([0-9]+)/i, /espn\.go\.com\/video\/clip\?id=([0-9]+)/i],
            url: 'http://espn.go.com/video/clip?id='
        },
        {
            domains: ['espn.go.com'],
            source_regex: [/espn\.go\.com\/espnvideo\/.+\?id=([0-9]+)/, /espn\.go\.com\/.+\?mediaId=([0-9]+)/],
            flash_regex: [/^id=([0-9]+)$/],
            url_regex: [/espn\.go\.com\/.+\/video\/.+\?videoId=([0-9]+)/i, /espn\.go\.com\/video\/clip\?id=([0-9]+)/i],
            url: 'http://espn.go.com/video/clip?id='
        } //,
        /*
        {
            domains: ['mtvnservices.com'],
            source_regex: [],
            flash_regex: [/sid=The_Daily_Show_.+?&/],
            url_regex: [/(http:\/\/(www\.)?thedailyshow\.com\/(full-episodes|watch)\/.+)/],
            use_location: true,
            location_regex: /http:\/\/(www\.)?thedailyshow\.com\/(full-episodes|watch)\/.+/,
            url: ''
        },
        {
            domains: ['mtvnservices.com'],
            source_regex: [],
            flash_regex: [/sid=Colbert_.+?&/],
            url_regex: [/(http:\/\/(www\.)?colbertnation\.com\/(full-episodes|the-colbert-report-videos)\/.+)/i],
            use_location: true,
            location_regex: /http:\/\/(www\.)?colbertnation\.com\/(full-episodes|the-colbert-report-videos)\/.+/,
            url: ''
        },
        {
            domains: ['mtvnservices.com'],
            source_regex: [/media\.mtvnservices\.com\/mgid:cms:video:comedycentral\.com:([0-9]+)/],
            flash_regex: [],
            url_regex: [/comedycentral\.com\/videos\/index\.jhtml\?.*?videoId=([0-9]+)/i],
            url: 'http://www.comedycentral.com/videos/index.jhtml?videoId='
        },
        {
            domains: ['theonion.com'],
            source_regex: [/theonion\.com\/video_embed\/\?id=([0-9]+)/],
            flash_regex: [],
            url_regex: [/theonion\.com\/video\?id=([0-9]+)/i],
            url: 'http://www.theonion.com/video?id='
        },
        {
            domains: ['theonion.com'],
            source_regex: [/media\.theonion\.com\/flash/],
            flash_regex: [],
            url_regex: [/(http:\/\/(www\.)?theonion\.com\/video\/.+)/],
            use_location: true,
            location_regex: /http:\/\/(www\.)?theonion\.com\/video\/.+/,
            url: ''
        },
        {
            domains: ['video.forbes.com'],
            source_regex: [/images\.forbes\.com\/video\/r2iversion77\/_assets\/swf\/VideoPlayer\.swf/],
            flash_regex: [],
            url_regex: [/(http:\/\/video\.forbes\.com\/fvn\/[\-a-zA-Z0-9]+\/[\-a-zA-Z0-9]+)/],
            use_location: true,
            location_regex: /video\.forbes\.com\/fvn\/[\-a-zA-Z0-9]+\/[\-a-zA-Z0-9]+/
        },
        {
            domains: ['forbes.com/video'],
            source_regex: [/&video=([\-a-zA-Z0-9]+\/[\-a-zA-Z0-9]+)/],
            flash_regex: [],
            url: 'http://video.forbes.com/fvn/'
        },
        {
            domains: ['brightcove.com'],
            source_regex: [/brightcove\.com.+?&publisherID=71683906001&/],
            flash_regex: [],
            url_regex: [/(http:\/\/video\.aol\.com\/video-detail\/.+?\/[0-9]+)/i],
            use_location: true,
            location_regex: /http:\/\/video\.aol\.com\/video-detail\/.+?\/[0-9]+/,
            url: ''
        },
        {
            domains: ['brightcove.com'],
            source_regex: [/brightcove\.com\/.+?&purl=([^&]+?video\.aol\.com\/video\/[^&]+)/],
            url_regex: [/(http:\/\/video\.aol\.com\/video\/[^&]+)/i],
            flash_regex: [],
            url: ''
        },
        {
            // Bravo TV videos are hosted on nbcuni.com
            domains: ['video.nbcuni.com'],
            source_regex: [/video\.nbcuni\.com\/outlet\/embed\/OutletEmbeddedPlayerLoader.swf/],
            flash_regex: [],
            url_regex: [/(http:\/\/.+?\.bravotv\.com\/.+\/videos\/.+)/],
            use_location: true,
            location_regex: /bravotv\.com\/.+\/videos\/.+$/,
            url: ''
        },
        {
            domains: ['cnettv.cnet.com/av/video/cbsnews'],
            source_regex: [],
            flash_regex: [/&shareUrl=http:\/\/www\.cbsnews\.com\/video\/watch\/\?id=([0-9]+n)&/, /&linkUrl=http:\/\/www\.cbsnews\.com\/video\/watch\/\?id=([0-9]+n)&/],
            url: 'http://www.cbsnews.com/video/watch/?id='
        },
        {
            domains: ['a.abcnews.com'],
            source_regex: [],
            flash_regex: [/&showId=([0-9]+)&/],
            url: 'http://abcnews.com/video/playerIndex/?id='
        },
        {
            // Tech crunch
            domains: ['player.ooyala.com'],
            source_regex: [],
            flash_regex: [/&embedCode=([0-9a-zA-Z]+)&/],
            url: 'http://techcrunch.tv/watch?id='
        }
        */
    ]
}, {});
