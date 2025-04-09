// ==UserScript==
// @name        Chặn Font Trang Web
// @namespace   your-namespace
// @version     0.1
// @description Chặn tải font từ trang web
// @match       *://*.msn.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'blocked';
            src: local('Arial'); /* Sử dụng một font hệ thống có sẵn */
        }

        * {
            font-family: 'blocked', sans-serif !important;
        }
    `;
    document.head.appendChild(style);

    // Cách tiếp cận khác (có thể hiệu quả hơn trong một số trường hợp):
    // Ngăn chặn các yêu cầu tải font

    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const urlString = url instanceof Request ? url.url : url;
        if (urlString.endsWith('.woff') || urlString.endsWith('.woff2') || urlString.endsWith('.ttf') || urlString.endsWith('.otf')) {
            console.log(`[UserScript] Đã chặn yêu cầu font: ${urlString}`);
            return new Response(null, { status: 404, statusText: 'Not Found' });
        }
        return originalFetch.call(this, url, options);
    };

    const originalInsertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function(rule, index) {
        if (rule.includes('@font-face')) {
            console.log(`[UserScript] Đã chặn quy tắc @font-face: ${rule}`);
            return -1; // Trả về -1 để báo hiệu quy tắc không được chèn
        }
        return originalInsertRule.call(this, rule, index);
    };
})();
