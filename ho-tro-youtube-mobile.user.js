// ==UserScript==
// @name         YouTube Prevent Single Click Pause
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent single click pause on YouTube, double click to pause.
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('click', function(event) {
                event.preventDefault();
            });
            video.addEventListener('dblclick', function(event) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }
    });
})();
