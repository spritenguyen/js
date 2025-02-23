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

    document.addEventListener('visibilitychange', onVisibilityChange, true);
})();
