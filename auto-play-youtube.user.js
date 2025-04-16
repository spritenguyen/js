// ==UserScript==
// @name         Auto Play YouTube Video
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động tiếp tục phát video sau khi chuyển tab hoặc nhấn Home trên Android
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let video = document.querySelector("video");

    function checkAndPlay() {
        if (video && video.paused) {
            video.play();
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            setTimeout(checkAndPlay, 500);
        }
    });

    window.addEventListener("focus", checkAndPlay);
})();
