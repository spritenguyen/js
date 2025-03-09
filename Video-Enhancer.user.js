// ==UserScript==
// @name         Video Enhancer
// @namespace    https://yourdomain.com
// @version      1.0
// @description  Tua nhanh, cử chỉ, và khóa màn hình khi xem video
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');

    if (!video) return;

    // Tạo nút tua nhanh/lùi
    function createButton(text, onclick, style = {}) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = onclick;
        Object.assign(btn.style, {
            position: 'fixed',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            ...style
        });
        document.body.appendChild(btn);
        return btn;
    }

    // Nút tua nhanh 10 giây
    createButton('>> 10s', () => video.currentTime += 10, { top: '10px', right: '60px' });

    // Nút lùi 10 giây
    createButton('<< 10s', () => video.currentTime -= 10, { top: '10px', right: '120px' });

    // Khóa/Mở khóa màn hình
    let isLocked = false;
    const lockButton = createButton('🔒 Khóa', () => {
        isLocked = !isLocked;
        lockButton.innerText = isLocked ? '🔓 Mở khóa' : '🔒 Khóa';
    }, { bottom: '10px', right: '10px' });

    // Vô hiệu hóa các cử chỉ khi khóa
    document.addEventListener('touchmove', (e) => {
        if (isLocked) e.preventDefault();
    }, { passive: false });

    // Cử chỉ vuốt để tua video
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
})();
