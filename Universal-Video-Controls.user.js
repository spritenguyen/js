// ==UserScript==
// @name         Universal Video Controls (Optimized)
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Thêm các nút điều khiển video HTML5 với giao diện responsive hiện đại.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Xử lý tất cả các video trên trang
    const enhanceVideo = (video) => {
        if (video.dataset.controlsEnhanced) return;
        video.dataset.controlsEnhanced = true;

        // Tạo container cho các nút điều khiển
        const controlContainer = document.createElement('div');
        Object.assign(controlContainer.style, {
            position: 'absolute',
            top: '10px', // Đặt container lên trên
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '5px',
            display: 'flex',
            gap: '5px',
            justifyContent: 'center',
            zIndex: '9999',
            maxWidth: '90%',
            opacity: '0',
            transition: 'opacity 0.3s',
        });

        // Hàm tạo nút điều khiển
        const createButton = (label, onClick) => {
            const button = document.createElement('button');
            Object.assign(button.style, {
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid white',
                borderRadius: '5px',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '12px',
            });
            button.innerText = label;
            button.onclick = onClick;
            return button;
        };

        // Nút chức năng
        const buttons = [
            { label: '⏪ -10s', action: () => (video.currentTime -= 10) },
            { label: '⏯️ Pause/Play', action: () => (video.paused ? video.play() : video.pause()) },
            { label: '⏩ +10s', action: () => (video.currentTime += 10) },
            { label: '➖ Speed -0.5', action: () => (video.playbackRate = Math.max(video.playbackRate - 0.5, 0.5)) },
            { label: '🔄 Reset Speed', action: () => (video.playbackRate = 1) },
            { label: '➕ Speed +0.5', action: () => (video.playbackRate = Math.min(video.playbackRate + 0.5, 16)) },
            { label: '📸 Screenshot', action: () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }},
        ];

        // Thêm các nút vào container
        buttons.forEach(({ label, action }) => controlContainer.appendChild(createButton(label, action)));
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(controlContainer);

        // Hiển thị/ẩn container khi di chuột
        const showControls = () => {
            controlContainer.style.opacity = '1';
            clearTimeout(video._hideTimeout);
            video._hideTimeout = setTimeout(() => (controlContainer.style.opacity = '0'), 3000);
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
    };

    // Theo dõi các video được tải vào DOM
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(enhanceVideo);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
