// ==UserScript==
// @name         YouTube Mobile Controls Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add controls to YouTube mobile, maintain aspect ratio, adjust play/pause button, add resolution and format options.
// @author       Your Name
// @match        *://m.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const addControlsAndStyles = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.setAttribute('controls', 'true');
            video.style.objectFit = 'contain';
        });

        const style = document.createElement('style');
        style.textContent = `
            #player-control-overlay {
                display: none !important;  /* Ẩn phần tử player-control-overlay */
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
            .ytp-fullscreen-button,
            .ytp-progress-bar-container {
                display: block !important;
            }
            .ytp-play-button {
                display: none !important;  /* Ẩn nút điều khiển play/pause cũ */
            }
            .ytp-play-button {
                top: 50% !important;  /* Đặt nút ở giữa video */
                transform: translateY(-50%) !important;  /* Căn chỉnh theo chiều dọc */
            }
        `;
        document.head.appendChild(style);
    };

    const addResolutionAndFormatControls = () => {
        const player = document.querySelector('.html5-video-player');
        if (player) {
            const resolutionButton = document.createElement('button');
            resolutionButton.innerText = 'Resolution';
            resolutionButton.style.position = 'absolute';
            resolutionButton.style.top = '10px';
            resolutionButton.style.right = '10px';
            resolutionButton.style.zIndex = '1000';
            resolutionButton.style.backgroundColor = '#fff';
            resolutionButton.style.border = '1px solid #ccc';
            resolutionButton.style.padding = '5px';

            resolutionButton.addEventListener('click', () => {
                // Add your logic to change resolution here
                alert('Change resolution');
            });

            const formatButton = document.createElement('button');
            formatButton.innerText = 'Format';
            formatButton.style.position = 'absolute';
            formatButton.style.top = '50px';
            formatButton.style.right = '10px';
            formatButton.style.zIndex = '1000';
            formatButton.style.backgroundColor = '#fff';
            formatButton.style.border = '1px solid #ccc';
            formatButton.style.padding = '5px';

            formatButton.addEventListener('click', () => {
                // Add your logic to change format here
                alert('Change format');
            });

            player.appendChild(resolutionButton);
            player.appendChild(formatButton);
        }
    };

    const observer = new MutationObserver(() => {
        addControlsAndStyles();
        addResolutionAndFormatControls();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        addControlsAndStyles();
        addResolutionAndFormatControls();
    });
})();
