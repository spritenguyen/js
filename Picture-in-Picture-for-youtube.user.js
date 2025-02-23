// ==UserScript==
// @name         Enhanced Picture-in-Picture for YouTube
// @namespace    https://yournamespacehere.com
// @version      1.1
// @description  Enable Picture-in-Picture mode for YouTube on Edge Android with optimizations
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function enterPictureInPicture(video) {
        if (document.pictureInPictureEnabled && !document.pictureInPictureElement && !document.fullscreenElement) {
            video.requestPictureInPicture().catch(err => {
                console.error(`Failed to enter Picture-in-Picture mode: ${err}`);
            });
        }
    }

    function onVideoPlay(event) {
        if (event.target.tagName === 'VIDEO') {
            const video = event.target;
            video.addEventListener('enterpictureinpicture', () => {
                console.log('Entered Picture-in-Picture mode.');
            });
            video.addEventListener('leavepictureinpicture', () => {
                console.log('Exited Picture-in-Picture mode.');
            });

            setTimeout(() => {
                enterPictureInPicture(video);
            }, 3000); // Delay to allow the video to start playing
        }
    }

    document.addEventListener('play', onVideoPlay, true);

    document.addEventListener('fullscreenchange', () => {
        const video = document.querySelector('video');
        if (video) {
            if (!document.fullscreenElement) {
                setTimeout(() => {
                    enterPictureInPicture(video);
                }, 3000); // Delay to allow fullscreen exit
            } else {
                console.log('Video is in fullscreen mode, PiP not activated.');
            }
        }
    });
})();
