// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.0
// @description  Keep screen on while playing YouTube videos, turn off when video stops or ends
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to keep the screen on
    function keepScreenOn() {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
                .then(() => console.log('Screen wake lock acquired.'))
                .catch(err => console.error(`Error acquiring screen wake lock: ${err}`));
        } else {
            console.warn('Wake lock not supported.');
        }
    }

    // Function to release the wake lock
    function releaseWakeLock() {
        if ('wakeLock' in navigator && navigator.wakeLock.release) {
            navigator.wakeLock.release()
                .then(() => console.log('Screen wake lock released.'))
                .catch(err => console.error(`Error releasing screen wake lock: ${err}`));
        }
    }

    // Monitor video play and pause events
    document.addEventListener('play', (event) => {
        if (event.target.tagName === 'VIDEO') {
            keepScreenOn();
            event.target.addEventListener('ended', releaseWakeLock);
            event.target.addEventListener('pause', releaseWakeLock);
        }
    }, true);
})();
