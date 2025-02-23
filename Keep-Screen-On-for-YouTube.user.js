// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.2
// @description  Keep screen on while playing YouTube videos, turn off when video stops or ends
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
            document.body.style.visibility = 'hidden';
            document.body.style.visibility = 'visible';
        }, 50000); // Adjust interval as needed
    }

    function stopPreventingScreenTimeout() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
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
