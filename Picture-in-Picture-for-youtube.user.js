// ==UserScript==
// @name         Picture-in-Picture cho YouTube
// @namespace    https://yournamespacehere.com
// @version      1.0
// @description  Kích hoạt chế độ Picture-in-Picture cho YouTube trên Edge Android
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let pipTimeout;

    function enterPictureInPicture(video) {
        if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
            video.requestPictureInPicture().catch(err => {
                console.error(`Không thể kích hoạt chế độ Picture-in-Picture: ${err}`);
            });
        }
    }

    function checkFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }

    function startPipTimeout(video) {
        if (pipTimeout) {
            clearTimeout(pipTimeout);
        }
        pipTimeout = setTimeout(() => {
            if (!checkFullscreen()) {
                enterPictureInPicture(video);
            }
        }, 6000); // Delay to enter Picture-in-Picture after 6 seconds
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            const video = event.target;

            video.addEventListener('enterpictureinpicture', () => {
                console.log('Đã vào chế độ Picture-in-Picture.');
            });
            video.addEventListener('leavepictureinpicture', () => {
                console.log('Đã thoát chế độ Picture-in-Picture.');
            });

            startPipTimeout(video);
        }
    }

    document.addEventListener('play', onVideoPlay, true);

    document.addEventListener('fullscreenchange', () => {
        clearTimeout(pipTimeout);
    }, true);
})();
