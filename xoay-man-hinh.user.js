// ==UserScript==
// @name         Auto Rotate Video in Fullscreen
// @version      1.0
// @description  Xoay màn hình khi video vào chế độ toàn màn hình
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("fullscreenchange", function() {
        let fullscreenElement = document.fullscreenElement;

        // Kiểm tra nếu phần tử fullscreen là video
        if (fullscreenElement && fullscreenElement.tagName.toLowerCase() === 'video') {
            document.documentElement.style.transform = 'rotate(90deg)';
            document.documentElement.style.width = '100vh';
            document.documentElement.style.height = '100vw';
            document.documentElement.style.overflow = 'hidden';
        } else {
            // Trả màn hình về trạng thái bình thường khi thoát fullscreen
            document.documentElement.style.transform = '';
            document.documentElement.style.width = '';
            document.documentElement.style.height = '';
            document.documentElement.style.overflow = '';
        }
    });
})();
