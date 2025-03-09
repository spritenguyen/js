// ==UserScript==
// @name         Video Enhancer Improved
// @namespace    https://yourdomain.com
// @version      1.1
// @description  Tua nhanh, cử chỉ, và khóa màn hình khi xem video
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');

    if (!video) return;

    // Tạo container chứa các nút
    const controlOverlay = document.createElement('div');
    Object.assign(controlOverlay.style, {
        position: 'fixed',
        zIndex: 1000,
        bottom: '10%',
        right: '10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        visibility: 'visible', // Ban đầu hiển thị
        transition: 'visibility 0.3s, opacity 0.3s',
        opacity: 1
    });
    document.body.appendChild(controlOverlay);

    // Tạo nút tua nhanh/lùi
    function createButton(text, onclick, style = {}) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onclick;
        Object.assign(btn.style, {
            margin: '5px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            ...style
        });
        controlOverlay.appendChild(btn);
        return btn;
    }

    // Nút tua nhanh 10 giây
    createButton('>> 10s', () => video.currentTime += 10);

    // Nút lùi 10 giây
    createButton('<< 10s', () => video.currentTime -= 10);

    // Nút khóa/mở khóa
    let isLocked = false;
    const lockButton = createButton('🔒 Khóa', () => {
        isLocked = !isLocked;
        lockButton.innerText = isLocked ? '🔓 Mở khóa' : '🔒 Khóa';
    });

    // Ngăn thao tác khi khóa
    document.addEventListener('click', (e) => {
        if (isLocked && !controlOverlay.contains(e.target)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    // Ẩn các nút sau 10 giây không thao tác
    let hideTimeout;
    const resetHideTimeout = () => {
        clearTimeout(hideTimeout);
        controlOverlay.style.visibility = 'visible';
        controlOverlay.style.opacity = 1;

        hideTimeout = setTimeout(() => {
            controlOverlay.style.visibility = 'hidden';
            controlOverlay.style.opacity = 0;
        }, 10000); // 10 giây
    };

    document.addEventListener('mousemove', resetHideTimeout);
    document.addEventListener('touchstart', resetHideTimeout);

    // Kích hoạt lại hiển thị khi chạm vào màn hình
    resetHideTimeout();

    // Đảm bảo các nút hiển thị trên toàn màn hình
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            controlOverlay.style.position = 'absolute';
        } else {
            controlOverlay.style.position = 'fixed';
        }
    });

})();
