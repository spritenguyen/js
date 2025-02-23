// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Giữ màn hình luôn sáng khi xem video trên YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLock !== null) {
            try {
                await wakeLock.release();
                wakeLock = null;
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    };

    const manageWakeLock = () => {
        if (document.fullscreenElement) {
            requestWakeLock();
        } else if (!document.querySelector('video').paused) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }
    };

    const keepScreenOn = () => {
        let video = document.querySelector('video');
        if (video) {
            video.addEventListener('play', requestWakeLock);
            video.addEventListener('pause', releaseWakeLock);
            video.addEventListener('ended', releaseWakeLock);
        }
    };

    keepScreenOn();

    document.addEventListener('fullscreenchange', manageWakeLock);

    let observer = new MutationObserver(() => {
        keepScreenOn();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
