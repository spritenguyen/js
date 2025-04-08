// ==UserScript==
// @name         Chặn Video Shorts trên YouTube Di Động
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ẩn các video Shorts trên m.youtube.com.
// @author       Bạn
// @match        https://m.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm để ẩn các video Shorts
    function hideShorts() {
        const shortsSections = document.querySelectorAll('a[href*="/shorts"]'); // Nhận diện đường dẫn chứa "/shorts"
        shortsSections.forEach(section => {
            const parentElement = section.closest('div');
            if (parentElement) {
                parentElement.style.display = 'none';
            }
        });
    }

    // Theo dõi sự thay đổi của DOM
    const observer = new MutationObserver(() => {
        hideShorts();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Ẩn ngay lập tức khi tải trang
    hideShorts();
})();
