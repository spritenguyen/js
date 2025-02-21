// ==UserScript==
// @name YouTube H.264
// @namespace https://www.youtube.com
// @version     1.3.1.1
// @description Clone of h264ify with optional limit up to 30 FPS.
// @description:ru Клон h264ify с опциональным ограничением до 30 FPS.
// @match *://*.youtube.com/*
// @match *://*.youtube-nocookie.com/*
// @match *://*.youtubekids.com/*
// @license MIT
// @grant none
// @run-at document-start
// ==/UserScript==

// Constants for video settings
const BLOCK_HIGH_FPS = false;
const DISALLOWED_TYPES_REGEX = /webm|vp8|vp9|av01/i;
const FRAME_RATE_REGEX = /framerate=(\d+)/;

(function() {
    const mediaSource = window.MediaSource;

    if (!mediaSource) {
        console.warn('MediaSource API is not available.');
        return;
    }

    const originalIsTypeSupported = mediaSource.isTypeSupported.bind(mediaSource);

    mediaSource.isTypeSupported = (type) => {
        // Ensure type is a string
        if (typeof type !== 'string') return false;

        // Block disallowed types
        if (DISALLOWED_TYPES_REGEX.test(type)) return false;

        // Extract and limit frame rate if needed
        const frameRateMatch = FRAME_RATE_REGEX.exec(type);
        if (frameRateMatch && parseInt(frameRateMatch[1], 10) > 30) {
            return false;
        }

        // Use original isTypeSupported method for other cases
        return originalIsTypeSupported(type);
    };
})();
