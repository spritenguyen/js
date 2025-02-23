// ==UserScript==
// @name        Auto PiP for Videos
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Automatically switches to PiP mode under certain conditions
// @author      Your Name
// @match       *://*/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    let pipTimeout;
    const PIP_DELAY = 5000; // Thời gian delay để kích hoạt PiP (đơn vị: ms)
    
    // Helper function to start PiP mode
    function requestPiP(video) {
        if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
            video.requestPictureInPicture().catch(error => {
                console.error('Failed to enable PiP mode:', error);
            });
        }
    }

    // Bắt đầu đếm thời gian để kích hoạt PiP
    function startPiPTimer(video) {
        clearPiPTimer();
        pipTimeout = setTimeout(() => {
            requestPiP(video);
        }, PIP_DELAY);
    }

    // Xóa bộ đếm thời gian
    function clearPiPTimer() {
        clearTimeout(pipTimeout);
    }

    // Listen to video play/pause events
    function attachVideoEvents(video) {
        video.addEventListener('play', () => {
            startPiPTimer(video);
        });
        
        video.addEventListener('pause', () => {
            clearPiPTimer();
        });
    }

    // Listen to fullscreen change events
    function attachFullscreenEvents() {
        document.addEventListener('fullscreenchange', () => {
            const video = document.querySelector('video');
            if (document.fullscreenElement) {
                // Đang vào chế độ toàn màn hình
                clearPiPTimer();
            } else {
                // Thoát khỏi chế độ toàn màn hình
                startPiPTimer(video);
            }
        });
    }

    // Attach events to all video elements
    function init() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            attachVideoEvents(video);
        });
        attachFullscreenEvents();
    }

    // Run the script once the DOM is fully loaded
    window.addEventListener('load', () => {
        init();
    });

    // Monitor for dynamically added video elements
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'VIDEO') {
                        attachVideoEvents(node);
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
