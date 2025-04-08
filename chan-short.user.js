// ==UserScript==
// @name         Chặn Chỉ Mục Shorts trên YouTube
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ẩn các video Shorts trên cả YouTube web và di động, nhưng giữ nguyên các phần nội dung khác.
// @author       Bạn
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm để ẩn các video và thành phần Shorts
    function hideShorts() {
        // Nhắm mục tiêu các video Shorts (trên cả web và di động)
        const shortsLinks = document.querySelectorAll('a[href*="/shorts"]');
        shortsLinks.forEach(link => {
            const videoElement = link.closest('ytd-rich-item-renderer, ytd-video-renderer, div'); // Xác định phần tử chứa video Shorts
            if (videoElement) {
                videoElement.style.display = 'none';
            }
        });

        // Loại bỏ các logo và tiêu đề liên quan đến Shorts, nhưng không làm ảnh hưởng đến nội dung khác
        const shortsLabels = document.querySelectorAll('span, h2, div');
        shortsLabels.forEach(label => {
            if (label.textContent.includes('Shorts')) {
                label.style.display = 'none';
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
