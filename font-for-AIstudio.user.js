// ==UserScript==
// @name         Bigger Font for Google AI Studio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tăng kích thước font chữ trên aistudio.google.com cho Android
// @match        https://aistudio.google.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* Tăng font gốc để các thành phần dùng rem tự động scale theo */
        html, body {
            font-size: 100% !important;
        }

        /* Ép tăng kích thước các thẻ chứa văn bản cơ bản bằng rem */
        p, span:not([class*="icon"]), div:not([class*="icon"]), textarea, input {
            font-size: 1.05rem !important;
            line-height: 1.5 !important;
        }

        /* Bỏ qua các icon của Material Design để tránh vỡ giao diện */
        .material-symbols-outlined, mat-icon, [class*="icon"] {
            font-size: inherit !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
