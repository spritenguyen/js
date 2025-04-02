// ==UserScript==
// @name         Video PiP Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a Picture-in-Picture (PiP) button to videos on webpages
// @include      *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to create the PiP button
    const createPiPButton = (video) => {
        const button = document.createElement('button');
        button.innerText = 'PiP';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = 'white';
        button.style.border = '1px solid black';
        button.style.padding = '5px';
        button.style.cursor = 'pointer'; // Added for better user experience
        button.onclick = async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await video.requestPictureInPicture();
                }
            } catch (error) {
                console.error('Error toggling PiP mode:', error);
            }
        };

        video.parentElement.style.position = 'relative'; // Ensures button positioning
        video.parentElement.appendChild(button);
    };

    // Function to find videos and add PiP buttons
    const addPiPButtonsToVideos = () => {
        const videos = document.querySelectorAll('video:not([data-pip-added])');
        videos.forEach((video) => {
            video.setAttribute('data-pip-added', 'true'); // Avoid duplicate buttons
            createPiPButton(video);
        });
    };

    // Add buttons to existing videos
    addPiPButtonsToVideos();

    // Add buttons to new videos loaded dynamically
    const observer = new MutationObserver(() => {
        addPiPButtonsToVideos();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
