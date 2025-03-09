// ==UserScript==
// @name         Universal Video Controls (Optimized Pro)
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  Điều khiển video HTML5 hiện đại, hỗ trợ tương tác mượt mà trên mọi thiết bị và kích thước màn hình.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Tạo container điều khiển cho video
     * @param {HTMLVideoElement} video
     * @returns {HTMLDivElement} container
     */
    const createControlContainer = (video) => {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '5px',
            zIndex: '9999',
            maxWidth: '90%',
            opacity: '0',
            pointerEvents: 'none', // Vô hiệu hoá tương tác mặc định
            transition: 'opacity 0.3s, pointer-events 0s linear 0.3s', // Đồng bộ pointer-events với opacity
        });

        const buttons = [
            { label: '⏪ -10s', action: () => (video.currentTime -= 10) },
            { label: '⏯️ Play/Pause', action: () => (video.paused ? video.play() : video.pause()) },
            { label: '⏩ +10s', action: () => (video.currentTime += 10) },
            { label: '➖ Speed -0.5', action: () => (video.playbackRate = Math.max(0.5, video.playbackRate - 0.5)) },
            { label: '🔄 Reset Speed', action: () => (video.playbackRate = 1) },
            { label: '➕ Speed +0.5', action: () => (video.playbackRate = Math.min(16, video.playbackRate + 0.5)) },
            { label: '📸 Screenshot', action: () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }},
        ];

        buttons.forEach(({ label, action }) => {
            const button = document.createElement('button');
            Object.assign(button.style, {
                flex: '1 1 auto',
                minWidth: '80px',
                padding: '10px',
                fontSize: '12px',
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #fff',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'center',
            });
            button.innerText = label;
            button.onclick = action;
            container.appendChild(button);
        });

        return container;
    };

    /**
     * Kích hoạt điều khiển cho video
     * @param {HTMLVideoElement} video
     */
    const enhanceVideo = (video) => {
        if (video.dataset.controlsEnhanced) return;
        video.dataset.controlsEnhanced = true;

        const controlContainer = createControlContainer(video);
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(controlContainer);

        const showControls = () => {
            controlContainer.style.opacity = '1';
            controlContainer.style.pointerEvents = 'auto'; // Kích hoạt tương tác khi hiện
            clearTimeout(video._hideTimeout);
            video._hideTimeout = setTimeout(() => {
                controlContainer.style.opacity = '0';
                controlContainer.style.pointerEvents = 'none'; // Vô hiệu hoá tương tác khi ẩn
            }, 3000);
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
    };

    // Theo dõi video thêm vào DOM
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(enhanceVideo);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
