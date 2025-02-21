// ==UserScript==
// @name         YouTube H.264
// @namespace    https://www.youtube.com
// @version      1.3.1.4
// @description  Clone of h264ify with optional limit up to 30 FPS.
// @description:ru Клон h264ify с опциональным ограничением до 30 FPS.
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const DISALLOWED_CODECS = ['vp8', 'vp9', 'av01', 'webm'];

    const originalCanPlayType = HTMLVideoElement.prototype.canPlayType;

    HTMLVideoElement.prototype.canPlayType = function(type) {
        if (DISALLOWED_CODECS.some(codec => type.includes(codec))) {
            return '';
        }
        return originalCanPlayType.call(this, type);
    };

    const observer = new MutationObserver(() => {
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            const originalAddSourceBuffer = video.addSourceBuffer;

            video.addSourceBuffer = function(type) {
                if (DISALLOWED_CODECS.some(codec => type.includes(codec))) {
                    throw new Error('Disallowed codec');
                }
                return originalAddSourceBuffer.call(this, type);
            };
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();
