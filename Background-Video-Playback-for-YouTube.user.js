// ==UserScript==
// @name         Background Audio Playback for YouTube on Android
// @namespace    https://yournamespacehere.com
// @version      1.3
// @description  Enable background audio playback on YouTube for Edge Android
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = null;
    let wasPaused = false;

    function enableBackgroundAudio() {
        if (videoElement && !wasPaused) {
            // Play the video to ensure audio playback continues in the background
            videoElement.play().catch(() => {});
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            videoElement = event.target;
            videoElement.addEventListener('pause', onVideoPause);
            enableBackgroundAudio();
        }
    }

    function onVideoPause() {
        wasPaused = true;
    }

    function onVisibilityChange() {
        if (document.hidden) {
            if (videoElement && !videoElement.paused) {
                wasPaused = false;
                enableBackgroundAudio();
            }
        } else {
            wasPaused = false;
        }
    }

    document.addEventListener('play', onVideoPlay, true);
    document.addEventListener('visibilitychange', onVisibilityChange);
})();
