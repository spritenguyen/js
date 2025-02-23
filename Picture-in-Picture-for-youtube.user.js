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
            video.requestPictureInPictur.onLoadComplete()().catch(err => {
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

    function onLoadComplete() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('enterpictureinpicture', () => {
                console.log('Đã vào chế độ Picture-in-Picture.');
            });
            video.addEventListener('leavepictureinpicture', () => {
                console.log('Đã thoát chế độ Picture-in-Picture.');
            });
        }
    }

    document.addEventListener('visibilitychange', onVisibilityChange, true);
    window.addEventListener('load', onLoadComplete);
})();
