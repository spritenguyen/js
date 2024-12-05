// ==UserScript==
// @name         YouTube Mobile Controls Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add controls to YouTube mobile and maintain aspect ratio, adjust play/pause button.
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
            .ytp-fullscreen-button,
            .ytp-progress-bar-container {
                display: block !important;
            }
            /* Ẩn hoặc căn chỉnh hợp lý nút điều khiển play/pause cũ */
            .ytp-play-button {
                display: none !important;  /* Ẩn nút điều khiển play/pause cũ */
            }
            /* Để căn chỉnh hợp lý, bạn có thể thay đổi thuộc tính sau */
            .ytp-play-button {
                top: 50% !important;  /* Đặt nút ở giữa video */
                transform: translateY(-50%) !important;  /* Căn chỉnh theo chiều dọc */
            }
        `;
        document.head.appendChild(style);
    };

    const observer = new MutationObserver(() => {
        addControlsAndStyles();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addControlsAndStyles);
})();
