// ==UserScript==
// @name         Block Font Downloads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block all font downloads on web pages
// @author       You
// @match        *://www.msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Chặn các yêu cầu tải font
    const blockFonts = (event) => {
        const url = event.target.src || event.target.href;
        if (url && url.includes('.woff') || url.includes('.ttf') || url.includes('.otf')) {
            console.log('Blocked font:', url);
            event.preventDefault();
        }
    };

};
