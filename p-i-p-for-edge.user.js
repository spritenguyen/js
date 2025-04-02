// ==UserScript==
// @name         Video PiP Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a button to enable Picture-in-Picture mode for the currently playing HTML5 video.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Kiểm tra xem có video HTML5 nào trên trang không
    const checkForVideo = () => document.querySelector('video') !== null;

    if (checkForVideo()) {
        // Tạo nút PiP
        const pipButton = document.createElement('button');
        pipButton.innerText = 'PiP Mode';
        pipButton.style.position = 'fixed';
        pipButton.style.top = '100px';
        pipButton.style.right = '20px';
        pipButton.style.padding = '10px 15px';
        pipButton.style.fontSize = '16px';
        pipButton.style.backgroundColor = '#007bff';
        pipButton.style.color = 'white';
        pipButton.style.border = 'none';
        pipButton.style.borderRadius = '5px';
        pipButton.style.cursor = 'pointer';
        pipButton.style.zIndex = '10000';
        document.body.appendChild(pipButton);

        // Thêm sự kiện để chuyển video đang phát sang chế độ PiP
        pipButton.addEventListener('click', async () => {
            const videos = document.querySelectorAll('video'); // Tìm tất cả video trên trang
            let activeVideo = null;

            // Kiểm tra video nào đang phát
            videos.forEach(video => {
                if (!video.paused && !video.ended && video.readyState > 2) {
                    activeVideo = video; // Lấy video đang phát
                }
            });

            if (activeVideo) {
                try {
                    await activeVideo.requestPictureInPicture(); // Kích hoạt chế độ PiP cho video đang phát
                } catch (err) {
                    console.error('Không thể bật chế độ PiP:', err);
                }
            } else {
                alert('Không tìm thấy video đang phát trên trang!');
            }
        });
    }
})();
