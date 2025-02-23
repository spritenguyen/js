// ==UserScript==
// @name         Keep Screen On for YouTube on Android
// @namespace    https://yournamespacehere.com
// @version      1.3
// @description  Keep screen on while playing YouTube videos on Android, turn off when video stops or ends
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;

    function preventScreenTimeout() {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.requestFullscreen().catch(() => {});
            }
        }, 50000); // Adjust interval as needed
    }

    function stopPreventingScreenTimeout() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            preventScreenTimeout();
            event.target.addEventListener('pause', onVideoPauseOrEnd);
            event.target.addEventListener('ended', onVideoPauseOrEnd);
        }
    }

    function onVideoPauseOrEnd(event) {
        if (event.target.tagName === 'VIDEO') {
            stopPreventingScreenTimeout();
            event.target.removeEventListener('pause', onVideoPauseOrEnd);
            event.target.removeEventListener('ended', onVideoPauseOrEnd);
        }
    }

    document.addEventListener('play', onVideoPlay, true);
})();
