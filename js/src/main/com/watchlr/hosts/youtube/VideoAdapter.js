/**
 * @package com.watchlr.hosts.youtube.adapters
 */
$cwh.adapters.VideoAdapter.extend("com.watchlr.hosts.youtube.adapters.VideoAdapter", {}, {

	/* @override */
	attach: function() {
        this._super();
	},

    _findVideoUrl: function(embed) {
        try {
            var videoUrl = this._super(embed);
            if (!videoUrl) {
                var videoId = this._getNodeValue(embed, 'data-youtube-id');
                if (videoId) {
                    videoUrl = 'http://www.youtube.com/watch?v=' + videoId;
                }
            }

            return videoUrl;
        } catch (err) {
            // alert("From: _findVideoUrl of youtube's VideoAdapter.\nReason: " + err);
            // $kat.trackError({from: "_findVideoUrl of youtube's VideoAdapter.", msg:"Error while finding video url for video tag.", exception:err});
        }

        return null;
    }
});