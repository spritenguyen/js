// ==UserScript==
// @name         Video Enhancer Android
// @namespace    https://yourdomain.com
// @version      1.2
// @description  Hỗ trợ tua nhanh, cử chỉ và khóa màn hình trên thiết bị Android
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');

    if (!video) return;

    // Tạo lớp overlay
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
        pointerEvents: 'none', // Không cản trở thao tác video
    });
    document.body.appendChild(overlay);

    // Tạo container cho các nút
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        pointerEvents: 'auto', // Cho phép nhấn vào các nút
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
    });
    overlay.appendChild(buttonContainer);

    // Tạo nút với chức năng cụ thể
    function createButton(text, onclick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onclick;
        Object.assign(btn.style, {
            margin: '5px',
            padding: '10px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
        });
        buttonContainer.appendChild(btn);
    }

    // Nút tua nhanh
    createButton('>> 10s', () => video.currentTime += 10);

    // Nút tua lùi
    createButton('<< 10s', () => video.currentTime -= 10);

    // Nút khóa màn hình
    let isLocked = false;
    const lockButton = createButton('🔒 Khóa', () => {
        isLocked = !isLocked;
        lockButton.innerText = isLocked ? '🔓 Mở khóa' : '🔒 Khóa';
    });

    // Khóa cử chỉ khi màn hình bị khóa
    document.addEventListener('touchstart', (e) => {
        if (isLocked && !buttonContainer.contains(e.target)) e.preventDefault();
    }, { passive: false });

    // Cử chỉ vuốt
    let startX = 0;
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
            video.currentTime += 10; // Vuốt phải để tua nhanh
        } else if (startX - endX > 50) {
            video.currentTime -= 10; // Vuốt trái để tua lùi
        }
    });

    // Tự động ẩn nút sau 10 giây
    let hideTimeout;
    const showButtons = () => {
        buttonContainer.style.display = 'flex';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => buttonContainer.style.display = 'none', 10000);
    };

    document.addEventListener('touchstart', showButtons);
    showButtons();

    // Đảm bảo hoạt động ở toàn màn hình
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            overlay.style.position = 'absolute';
        } else {
            overlay.style.position = 'fixed';
        }
    });
})();
