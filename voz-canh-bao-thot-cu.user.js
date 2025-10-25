// ==UserScript==
// @name         Cảnh báo thớt cũ (tối ưu)
// @namespace
// @version      2024.11.25.02
// @description  Cảnh báo khi reply vào thớt cũ trên voz.vn (box 33)
// @author
// @match        https://voz.vn/t/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        form.js-quickReply button[type="submit"].button.button--old-thread {
            background: #c0392b;
            border-color: #c0392b;
        }
        form.js-quickReply button[type="submit"].button.button--old-thread:hover {
            background: #f39c12;
            border-color: #f39c12;
        }
    `);

    const OLD_THRESHOLD = 90 * 86400000; // 90 ngày

    function getThreadLastTime() {
        const lastKnown = document.querySelector('input[name="last_known_date"]');
        return lastKnown ? Number(lastKnown.value) * 1000 : Date.now();
    }

    const threadLastTime = getThreadLastTime();
    const isOldThread = Date.now() - threadLastTime > OLD_THRESHOLD;

    const currentBox = document.querySelector(".p-breadcrumbs li:last-child a")?.href.match(/\d+/)?.[0];
    const btnSubmit = document.querySelector('form.js-quickReply button[type="submit"]');

    if (currentBox === '33' && isOldThread && btnSubmit) {
        btnSubmit.classList.add("button--old-thread");
        btnSubmit.addEventListener('click', event => {
            if (!confirm('Thớt này đã lâu không hoạt động, bạn có chắc muốn comment không?')) {
                event.preventDefault();
            }
        });
    }
})();
