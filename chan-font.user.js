// ==UserScript==
// @name         Custom Font Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block specific fonts on msn.com
// @author       
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Thực hiện việc loại bỏ fonts bằng cách sử dụng các phương thức JavaScript
    document.querySelectorAll('*').forEach(el => {
        el.style.fontFamily = 'inherit';
    });
})();
