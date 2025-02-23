// ==UserScript==
// @name         Thêm Nút P-i-P vào Video
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Thêm nút Picture-in-Picture vào video đang phát và khắc phục lỗi toàn màn hình YouTube
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Tạo nút P-i-P
    function createPiPButton(video) {
        if (video.pipButtonAdded) return; // Tránh thêm nhiều nút vào cùng một video
        video.pipButtonAdded = true;

        const pipButton = document.createElement('button');
        pipButton.textContent = 'P-i-P';
        pipButton.style.position = 'absolute';
        pipButton.style.top = '10px';
        pipButton.style.right = '10px';
        pipButton.style.zIndex = '1000';
        pipButton.style.backgroundColor = '#000';
        pipButton.style.color = '#fff';
        pipButton.style.border = 'none';
        pipButton.style.padding = '5px 10px';
        pipButton.style.cursor = 'pointer';

        pipButton.addEventListener('click', () => {
            video.addEventListener('enterpictureinpicture', () => {
                video.play();
            });
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                video.requestPictureInPicture();
            }
        });

        video.parentNode.style.position = 'relative';
        video.parentNode.appendChild(pipButton);

        // Xóa nút khi vào chế độ toàn màn hình
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                pipButton.style.display = 'none';
            } else {
                pipButton.style.display = 'block';
            }
        });
    }

    // Khắc phục lỗi toàn màn hình trên YouTube
    function fixYouTubeFullscreen() {
        const style = document.createElement('style');
        style.textContent = `
            video:-webkit-full-screen {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
            }
        `;
        document.head.appendChild(style);
    }

    // Tìm và thêm nút P-i-P vào video
    function addPiPButtonToVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            createPiPButton(video);
        });
    }

    // Lắng nghe sự thay đổi của DOM để thêm nút P-i-P vào các video mới
    const observer = new MutationObserver(addPiPButtonToVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Thêm nút P-i-P vào các video đã có sẵn
    addPiPButtonToVideos();

    // Khắc phục lỗi toàn màn hình trên YouTube
    fixYouTubeFullscreen();
})();
