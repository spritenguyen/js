// ==UserScript==
// @name         YouTube Prevent Pause on Click
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevent any clicks from pausing YouTube video
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function preventPause(event) {
        event.stopPropagation();
    }

    document.addEventListener('DOMContentLoaded', function() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('click', preventPause, true);
        }
    });
})();
