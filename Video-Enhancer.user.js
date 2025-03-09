// ==UserScript==
// @name         Enhanced Video Player (Middle Controls)
// @namespace    https://yourdomain.com
// @version      2.1
// @description  Tua nhanh, tốc độ phát video, khóa màn hình với nút điều khiển ở giữa video và hỗ trợ toàn màn hình.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');
    if (!video) return;

    // Tạo lớp overlay để chứa các nút điều khiển
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    });
    document.body.appendChild(overlay);

    // Container cho các nút
    const controls = document.createElement('div');
    Object.assign(controls.style, {
        pointerEvents: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền đen trong suốt
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
    });
    overlay.appendChild(controls);

    // Hàm tạo nút
    function createButton(text, onclick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onclick;
        Object.assign(btn.style, {
            padding: '10px 15px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
        });
        controls.appendChild(btn);
    }

    // Nút tua nhanh
    createButton('>> 10s', () => video.currentTime += 10);

    // Nút tua lùi
    createButton('<< 10s', () => video.currentTime -= 10);

    // Nút thay đổi tốc độ phát
    const speedButton = createButton('Tốc độ: 1x', () => {
        const speeds = [0.5, 1, 1.5, 2];
        let currentIndex = speeds.indexOf(video.playbackRate);
        currentIndex = (currentIndex + 1) % speeds.length;
        video.playbackRate = speeds[currentIndex];
        speedButton.innerText = `Tốc độ: ${speeds[currentIndex]}x`;
    });

    // Nút khóa màn hình
    let isLocked = false;
    const lockButton = createButton('🔒 Khóa', () => {
        isLocked = !isLocked;
        lockButton.innerText = isLocked ? '🔓 Mở khóa' : '🔒 Khóa';

        // Khi khóa, vô hiệu hóa thao tác chạm bên ngoài các nút
        overlay.style.pointerEvents = isLocked ? 'auto' : 'none';
    });

    document.addEventListener('touchstart', (e) => {
        if (isLocked && !controls.contains(e.target)) {
            e.preventDefault(); // Ngăn thao tác khi khóa
        }
    }, { passive: false });

    // Tự động ẩn các nút sau 3 giây không thao tác
    let hideTimeout;
    const showControls = () => {
        controls.style.opacity = 1;
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => (controls.style.opacity = 0), 3000);
    };

    document.addEventListener('touchstart', showControls);
    showControls();

    // Hỗ trợ chế độ toàn màn hình
    const adjustForFullscreen = () => {
        const isFullscreen = !!document.fullscreenElement;
        overlay.style.position = isFullscreen ? 'absolute' : 'fixed';
    };

    document.addEventListener('fullscreenchange', adjustForFullscreen);
    adjustForFullscreen();
})();
