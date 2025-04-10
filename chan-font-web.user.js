// ==UserScript==
// @name         Chặn Font Chữ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Chặn font chữ trên trang web
// @author       Bạn
// @match        https://msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
        @font-face {
            font-family: 'Arial'; /* Thay thế font mặc định */
        }
        * {
            font-family: 'Arial', sans-serif !important;
        }
    `;
    document.head.appendChild(style);
})();
