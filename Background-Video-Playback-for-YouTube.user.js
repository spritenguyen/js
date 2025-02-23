// ==UserScript==
// @name         Background Video Playback for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.0
// @description  Enable background video playback on YouTube for Edge Android
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = null;

    function enableBackgroundPlayback() {
        if (videoElement) {
            videoElement.pause();
            videoElement.play();
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            videoElement = event.target;
            enableBackgroundPlayback();
        }
    }

    document.addEventListener('play', onVideoPlay, true);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && videoElement) {
            enableBackgroundPlayback();
        }
    });
})();
