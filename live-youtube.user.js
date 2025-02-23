// ==UserScript==
// @name         YouTube Live Button
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Thêm nút để tìm đến thời gian hiện tại khi xem live stream trên YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm để tạo và chèn nút "Live"
    function addLiveButton() {
        const liveButton = document.createElement('button');
        liveButton.innerHTML = 'Live';
        liveButton.style.position = 'absolute';
        liveButton.style.bottom = '10px';
        liveButton.style.left = '10px';
        liveButton.style.zIndex = '1000';
        liveButton.style.padding = '10px';
        liveButton.style.backgroundColor = '#FF0000';
        liveButton.style.color = '#FFFFFF';
        liveButton.style.border = 'none';
        liveButton.style.cursor = 'pointer';

        liveButton.addEventListener('click', () => {
            const videoPlayer = document.querySelector('video');
            if (videoPlayer) {
                const seekToLive = () => {
                    const liveCurrentTime = new Date().getTime() / 1000; // thời gian hiện tại tính bằng giây
                    const latencyOffset = 1; // trừ 1 giây
                    videoPlayer.currentTime = videoPlayer.seekable.end(0) - (liveCurrentTime - videoPlayer.startDate / 1000) - latencyOffset;
                    videoPlayer.play();
                };

                seekToLive();
                videoPlayer.addEventListener('loadedmetadata', seekToLive);
                videoPlayer.addEventListener('seeking', seekToLive);
            }
        });

        document.body.appendChild(liveButton);
    }

    // Chờ cho trình phát YouTube tải trước khi thêm nút
    const observer = new MutationObserver((mutations, obs) => {
        const videoPlayer = document.querySelector('video');
        if (videoPlayer) {
            addLiveButton();
            obs.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
