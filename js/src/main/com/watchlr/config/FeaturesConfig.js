/**
 * @package com.watchlr.config
 */
$cwc.FeaturesConfig = {
	plugins: {
		InSituVideoFeature: {
			'package': $cwf.insituvideo,
			defer: true,
			usesHostAdapter: true,
			config: {
				/*supportedPartnerIds: [
					'watchlr.partner.youtube',
					'watchlr.partner.myvideo',
					'watchlr.partner.clipfish',
					'watchlr.partner.hulu'
				],
				partnerContainerIds: {
					'watchlr.partner.youtube':'watchlr_YoutubeContainer',
					'watchlr.partner.myvideo':'watchlr_MyvideoContainer',
					'watchlr.partner.clipfish':'watchlr_ClipfishContainer',
					'watchlr.partner.hulu':'watchlr_HuluContainer'
				},
				player: {
					BITLY_REQUEST_URL: 'http://api.bit.ly/shorten',
					BITLY_TIMEOUT: '10000',
					TWITTER_REQUEST_URL: 'http://twitter.com/home?status=',
					HEIGHT: 325,
					bitly: {
						LOGIN: 'kikinshare',
						API_KEY: 'R_4422de487656e9e602889e63676b6a72'
					}
				}, */
				swiff: {
					WIDTH: 488,
					HEIGHT: 299,
					TIMEOUT: 15000
				},
				supportedHosts: {
					'video.google.com': {
						name: 'Google Videos'
					},
					'www.youtube.com': {
						name: 'YouTube'
					},
					'www.myvideo.de': {
						name: 'MyVideo'
					},
					'video.foxbusiness.com': {
						name: 'Fox Business'
					},
					'video.foxnews.com': {
						name: 'Fox News'
					},
					'youtube.com': {
						name: 'YouTube'
					},
					'myvideo.de': {
						name: 'MyVideo'
					},
					'hulu.com': {
						name: 'Hulu'
					},
					youtube: {
						name: 'YouTube'
					},
					myvideo: {
						name: 'MyVideo'
					},
					hulu: {
						name: 'Hulu'
					}
				}
			}
		}
	}
}