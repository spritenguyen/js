// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Giữ màn hình luôn sáng khi xem video trên YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function keepScreenOn() {
        let video = document.querySelector('video');
        if (video) {
            let wakeLock = null;

            const requestWakeLock = async () => {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            };

            const releaseWakeLock = () => {
                if (wakeLock !== null) {
                    wakeLock.release()
                        .then(() => {
                            wakeLock = null;
                        });
                }
            };

            video.addEventListener('play', requestWakeLock);
            video.addEventListener('pause', releaseWakeLock);
            video.addEventListener('ended', releaseWakeLock);
            video.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    releaseWakeLock();
                }
            });
        }
    }

    let observer = new MutationObserver(() => {
        keepScreenOn();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Re-check the video element every 1 minute
    setInterval(() => {
        keepScreenOn();
    }, 60000);
})();
