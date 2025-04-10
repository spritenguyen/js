// ==UserScript==
// @name         Chặn Font Chữ Hoàn Chỉnh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Chặn tải font từ máy chủ và thay thế font
// @author       Bạn
// @match        https://msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Loại bỏ các liên kết liên quan đến font chữ
    const links = document.querySelectorAll('link[rel="stylesheet"], style');
    links.forEach(link => {
        if (link.href && link.href.includes('font')) {
            link.parentNode.removeChild(link);
        }
    });

    // Thay thế font bằng font mặc định của hệ thống
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            font-family: 'Arial', sans-serif !important; /* Thay đổi font mặc định */
        }
    `;
    document.head.appendChild(style);
})();
