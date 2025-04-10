// ==UserScript==
// @name         Block Remote Fonts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chặn tải font từ xa
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.innerHTML = '* { font-family: timenewsroman !important; }';
    document.head.appendChild(style);
});
