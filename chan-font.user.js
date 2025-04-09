// ==UserScript==
// @name        Chặn Font MSN.com (Nâng cao)
// @namespace   your-namespace
// @version     0.2
// @description Cố gắng chặn tải font trên msn.com
// @match       *://*.msn.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Ghi đè window.fetch để chặn các yêu cầu font
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const urlString = url instanceof Request ? url.url : url;
        if (/\.(woff2?|ttf|otf)$/i.test(urlString)) {
            console.log(`[UserScript] Đã chặn yêu cầu fetch font: ${urlString}`);
            return new Response(null, { status: 404, statusText: 'Not Found' });
        }
        return originalFetch.call(this, url, options);
    };

    // Xóa các quy tắc @font-face hiện có
    function removeExistingFontFaces() {
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules);
                rules.forEach((rule, index) => {
                    if (rule.type === CSSRule.FONT_FACE_RULE) {
                        sheet.deleteRule(index);
                    }
                });
            } catch (e) {
                // Bỏ qua các lỗi CORS
            }
        });
    }

    removeExistingFontFaces();

    // Theo dõi các thay đổi của DOM để chặn các thẻ link tải font động
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LINK' && node.rel === 'stylesheet') {
                    const href = node.getAttribute('href');
                    if (href && /\.(woff2?|ttf|otf)$/i.test(href)) {
                        console.log(`[UserScript] Đã gỡ bỏ link font động: ${href}`);
                        node.remove();
                    }
                }
            });
        });
    });

    observer.observe(document.head, { childList: true, subtree: false });

    // Áp dụng font sans-serif mặc định
    const style = document.createElement('style');
    style.textContent = `
        * {
            font-family: sans-serif !important;
        }
    `;
    document.head.appendChild(style);

})();
