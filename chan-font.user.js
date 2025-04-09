// ==UserScript==
// @name         Inject Custom Styles for MSN
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Inject custom styles to override fonts on msn.com
// @author       You
// @match        *://www.msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS tùy chỉnh để loại bỏ hoặc thay đổi font
    const customCSS = `
        * {
            font-family: Arial !important; /* Thay đổi font sang Arial */
        }
    `;

    // Tạo một thẻ <style> và thêm CSS vào
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;

    // Chèn thẻ <style> vào phần <head> của trang web
    document.head.appendChild(styleElement);
})();
