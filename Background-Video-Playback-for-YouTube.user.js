// ==UserScript==
// @name         Background Audio Playback for YouTube on Android
// @namespace    https://yournamespacehere.com
// @version      1.2
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
            // Play the video to ensure audio playback continues in the background
            videoElement.play().catch(() => {});
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
