// ==UserScript==
// @name Set codec Youtube
// @namespace https://www.youtube.com
// @version     1.3.3
// @description
// @match *://*.youtube.com/*
// @match *://*.youtube-nocookie.com/*
// @match *://*.youtubekids.com/*
// @license MIT
// @grant none
// @run-at document-start
// ==/UserScript==

// Constants for video settings
const BLOCK_HIGH_FPS = false; // xac dinh co block fps hay khong
const DISALLOWED_TYPES_REGEX = /vp8|av01/i;
const FRAME_RATE_REGEX = /framerate=(\d+)/;

(function() {
    const mediaSource = window.MediaSource;

    if (!mediaSource) return;

    const originalIsTypeSupported = mediaSource.isTypeSupported.bind(mediaSource);

    mediaSource.isTypeSupported = (type) => {
        if (typeof type !== 'string') return false;

        if (DISALLOWED_TYPES_REGEX.test(type)) return false;

        const frameRateMatch = FRAME_RATE_REGEX.exec(type);
        if (BLOCK_HIGH_FPS && frameRateMatch && frameRateMatch[1] > 30) { // dieu kien de kich hoat block FPS
        //if (frameRateMatch && frameRateMatch[1] > 30) {
            return false;
        }

        return originalIsTypeSupported(type);
    };
})();
