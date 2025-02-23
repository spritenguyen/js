// ==UserScript==
// @name         Background Audio Playback for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.1
// @description  Enable background audio playback on YouTube for Edge Android
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = null;

    function enableBackgroundAudio() {
        if (videoElement) {
            // Pause and play to ensure video resumes correctly
            videoElement.pause();
            setTimeout(() => {
                videoElement.play().catch(() => {});
            }, 100);
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            videoElement = event.target;
            enableBackgroundAudio();
        }
    }

    function onVisibilityChange() {
        if (document.hidden && videoElement) {
            enableBackgroundAudio();
        }
    }

    document.addEventListener('play', onVideoPlay, true);
    document.addEventListener('visibilitychange', onVisibilityChange);
})();
