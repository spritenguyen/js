// ==UserScript==
// @name         Xóa Hoàn Toàn Video Shorts trên YouTube
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Ẩn hoàn toàn video Shorts, logo và chữ liên quan trên cả trang web và di động của YouTube.
// @author       Bạn
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm để ẩn các video Shorts và các thành phần liên quan
    function hideShorts() {
        // Ẩn các video Shorts
        const shortsLinks = document.querySelectorAll('a[href*="/shorts"]');
        shortsLinks.forEach(link => {
            const parentElement = link.closest('div');
            if (parentElement) {
                parentElement.style.display = 'none';
            }
        });

        // Ẩn logo và các tiêu đề liên quan đến Shorts
        const shortsTextElements = document.querySelectorAll('span, h2, div');
        shortsTextElements.forEach(element => {
            if (element.textContent.includes('Shorts')) {
                element.style.display = 'none';
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
