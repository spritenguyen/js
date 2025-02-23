// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.5
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
            if (!wakeLock) {
                wakeLock = await navigator.wakeLock.request('screen');
            }
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
        const video = document.querySelector('video');
        if (video && !video.paused) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }
    };

    const keepScreenOn = () => {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('play', requestWakeLock);
            video.addEventListener('pause', releaseWakeLock);
            video.addEventListener('ended', releaseWakeLock);
        }
    };

    keepScreenOn();

    document.addEventListener('fullscreenchange', manageWakeLock);

    const observer = new MutationObserver(keepScreenOn);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(manageWakeLock, 60000);
})();
