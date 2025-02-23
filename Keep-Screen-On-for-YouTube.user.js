// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.1
// @description  Keep screen on while playing YouTube videos, turn off when video stops or ends
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let wakeLock = null;

    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Screen wake lock released.');
            });
            console.log('Screen wake lock acquired.');
        } catch (err) {
            console.error(`Error acquiring screen wake lock: ${err}`);
        }
    }

    function releaseWakeLock() {
        if (wakeLock !== null) {
            wakeLock.release()
                .catch(err => console.error(`Error releasing screen wake lock: ${err}`));
            wakeLock = null;
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            requestWakeLock();
            event.target.addEventListener('pause', onVideoPauseOrEnd);
            event.target.addEventListener('ended', onVideoPauseOrEnd);
        }
    }

    function onVideoPauseOrEnd(event) {
        if (event.target.tagName === 'VIDEO') {
            releaseWakeLock();
            event.target.removeEventListener('pause', onVideoPauseOrEnd);
            event.target.removeEventListener('ended', onVideoPauseOrEnd);
        }
    }

    document.addEventListener('play', onVideoPlay, true);
})();
