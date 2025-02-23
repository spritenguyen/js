// ==UserScript==
// @name         Keep Screen On for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
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
            video.addEventListener('play', () => {
                screen.orientation.lock('landscape');
                navigator.wakeLock.request('screen');
            });
            video.addEventListener('pause', () => {
                screen.orientation.unlock();
                navigator.wakeLock.release();
            });
        }
    }

    let observer = new MutationObserver(() => {
        keepScreenOn();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
