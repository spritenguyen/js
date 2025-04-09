// ==UserScript==
// @name         Font Remover for MSN
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove custom fonts on msn.com
// @author       You
// @match        *://www.msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm thay đổi font trên tất cả các phần tử
    const removeCustomFonts = () => {
        document.querySelectorAll('*').forEach(el => {
            el.style.fontFamily = 'inherit'; // Đặt font về mặc định
        });
    };

    // Thực hiện lần đầu khi trang được tải
    removeCustomFonts();

    // Quan sát các thay đổi DOM để áp dụng lại nếu có phần tử mới xuất hiện
    const observer = new MutationObserver(() => {
        removeCustomFonts();
    });

    // Bắt đầu quan sát toàn bộ body của trang
    observer.observe(document.body, { childList: true, subtree: true });
})();
