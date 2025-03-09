// ==UserScript==
// @name         Universal Video Controls (Pro Optimized)
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  Điều khiển video HTML5 với hiệu suất cao, giao diện hiện đại và tính năng quay màn hình, hỗ trợ mọi thiết bị và kích thước màn hình.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Tạo nút với các thuộc tính cần thiết
     * @param {string} label - Nhãn nút
     * @param {function} action - Hành động khi nhấn nút
     * @returns {HTMLButtonElement} Nút đã tạo
     */
    const createButton = (label, action) => {
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
        return button;
    };

    /**
     * Tạo container điều khiển và gắn vào video
     * @param {HTMLVideoElement} video - Video cần điều khiển
     */
    const enhanceVideo = (video) => {
        if (video.dataset.controlsEnhanced) return;
        video.dataset.controlsEnhanced = true;

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
            pointerEvents: 'none', // Ngăn thao tác khi ẩn
            transition: 'opacity 0.3s, pointer-events 0s linear 0.3s', // Đồng bộ opacity và pointer-events
        });

        // Biến hỗ trợ ghi video
        let mediaRecorder;
        let chunks = [];
        const toggleRecording = (e) => {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                chunks = [];
                const stream = video.captureStream();
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) chunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'recording.webm';
                    link.click();
                };
                mediaRecorder.start();
                e.target.innerText = '⏹ Stop Recording';
            } else {
                mediaRecorder.stop();
                e.target.innerText = '📹 Start Recording';
            }
        };

        // Danh sách các nút
        const buttons = [
            createButton('⏪ -10s', () => (video.currentTime -= 10)),
            createButton('⏯️ Play/Pause', () => (video.paused ? video.play() : video.pause())),
            createButton('⏩ +10s', () => (video.currentTime += 10)),
            createButton('➖ Speed -0.5', () => (video.playbackRate = Math.max(0.5, video.playbackRate - 0.5))),
            createButton('🔄 Reset Speed', () => (video.playbackRate = 1)),
            createButton('➕ Speed +0.5', () => (video.playbackRate = Math.min(16, video.playbackRate + 0.5))),
            createButton('📸 Screenshot', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const link = document.createElement('a');
                link.download = 'screenshot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }),
            createButton('📹 Start Recording', toggleRecording),
        ];

        // Thêm nút vào container
        buttons.forEach((button) => container.appendChild(button));
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(container);

        // Hiện/ẩn container khi tương tác
        const showControls = () => {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto'; // Kích hoạt thao tác khi hiển thị
            clearTimeout(video._hideTimeout);
            video._hideTimeout = setTimeout(() => {
                container.style.opacity = '0';
                container.style.pointerEvents = 'none'; // Ngăn thao tác khi ẩn
            }, 3000);
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
    };

    // Theo dõi video mới được thêm vào DOM
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(enhanceVideo);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
