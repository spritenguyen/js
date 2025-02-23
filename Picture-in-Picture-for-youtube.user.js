// ==UserScript==
// @name         Picture-in-Picture cho YouTube
// @namespace    https://yournamespacehere.com
// @version      1.1
// @description  Kích hoạt chế độ Picture-in-Picture cho YouTube trên Edge Android
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function enterPictureInPicture(video) {
        if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
            video.requestPictureInPicture().catch(err => {
                console.error(`Không thể kích hoạt chế độ Picture-in-Picture: ${err}`);
            });
        }
    }

    function onVisibilityChange(event) {
        if (document.visibilityState === 'hidden') {
            const video = document.querySelector('video');
            if (video && !document.pictureInPictureElement) {
                enterPictureInPicture(video);
            }
        }
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

            setTimeout(() => {
                enterPictureInPicture(video);
            }, 6000); // Delay to allow the video to start playing
        }
    }

    document.addEventListener('visibilitychange', onVisibilityChange, true);
    document.addEventListener('play', onVideoPlay, true);
})();
