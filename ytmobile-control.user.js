// ==UserScript==
// @name         YouTube Mobile Controls Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add controls to YouTube mobile and maintain aspect ratio.
// @author       Your Name
// @match        *://m.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add video controls
    const addControls = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.setAttribute('controls', 'true');
            video.style.objectFit = 'contain';
        });
    };

    // Add styles for various elements
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #player-control-overlay {
                bottom: 90% !important;
            }
            .player-controls-background-container,
            .player-middle-controls,
            .player-bottom-controls {
                display: none !important;
            }
            yt-progress-bar {
                top: 0 !important;
                left: 10px !important;
                right: 150px !important;
            }
            .ytp-autohide {
                cursor: auto !important;
            }
            .player-controls-top.with-video-details {
                width: 14% !important;
            }
            #player-control-overlay.fadein yt-progress-bar,
            #player-control-overlay.fadein yt-player-storyboard,
            #player-control-overlay.fadein .YtPlayerStoryboardHost {
                visibility: visible !important;
            }
            #player-control-overlay.fadein .YtPlayerStoryboardHost {
                bottom: -80px !important;
            }
        `;
        document.head.appendChild(style);
    };

    // Apply the controls and styles
    const applyEnhancements = () => {
        addControls();
        addStyles();
    };

    // Run the script when the page loads or when navigating within the site
    window.addEventListener('load', applyEnhancements);
    document.addEventListener('yt-navigate-finish', applyEnhancements);

})();
