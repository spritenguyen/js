// ==UserScript==
// @name         Video Enhancer (Android-like Improved)
// @namespace    https://yourdomain.com
// @version      1.4
// @description  Tua nhanh, tốc độ video và khóa màn hình với hỗ trợ toàn màn hình và giao diện đẹp hơn.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');

    if (!video) return;

    // Tạo lớp overlay để chứa các phím điều khiển
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    });
    document.body.appendChild(overlay);

    // Container cho các phím điều khiển
    const controls = document.createElement('div');
    Object.assign(controls.style, {
        pointerEvents: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền đen trong suốt
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        opacity: 1,
        transition: 'opacity 0.5s',
    });
    overlay.appendChild(controls);

    // Hàm tạo nút với giao diện tùy chỉnh
    function createButton(text, onclick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onclick;
        Object.assign(btn.style, {
            margin: '5px',
            padding: '10px',
            backgroundColor: 'transparent', // Nền trong suốt
            color: 'white', // Chữ trắng
            border: '1px solid white',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
        });
        controls.appendChild(btn);
    }

    // Nút tua nhanh 10 giây
    createButton('>> 10s', () => video.currentTime += 10);

    // Nút tua lùi 10 giây
    createButton('<< 10s', () => video.currentTime -= 10);

    // Nút thay đổi tốc độ phát video
    const speedButton = createButton('Tốc độ: 1x', () => {
        const speeds = [0.5, 1, 1.5, 2]; // Các tùy chọn tốc độ
        let currentIndex = speeds.indexOf(video.playbackRate);
        currentIndex = (currentIndex + 1) % speeds.length; // Vòng lặp qua các tốc độ
        video.playbackRate = speeds[currentIndex];
        speedButton.innerText = `Tốc độ: ${speeds[currentIndex]}x`;
    });

    // Nút khóa màn hình
    let isLocked = false;
    const lockButton = createButton('🔒 Khóa', () => {
        isLocked = !isLocked;
        lockButton.innerText = isLocked ? '🔓 Mở khóa' : '🔒 Khóa';
    });

    document.addEventListener('touchstart', (e) => {
        if (isLocked && !controls.contains(e.target)) {
            e.preventDefault(); // Ngăn thao tác khi màn hình bị khóa
        }
    }, { passive: false });

    // Tự động ẩn nút sau 3 giây không thao tác
    let hideTimeout;
    const showControls = () => {
        controls.style.opacity = 1;
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => controls.style.opacity = 0, 3000); // 3 giây
    };

    document.addEventListener('touchstart', showControls);
    showControls();

    // Đảm bảo hoạt động trong chế độ toàn màn hình
    const adjustForFullscreen = () => {
        const isFullscreen = !!document.fullscreenElement;
        overlay.style.position = isFullscreen ? 'absolute' : 'fixed';
    };

    document.addEventListener('fullscreenchange', adjustForFullscreen);
    adjustForFullscreen();
})();
