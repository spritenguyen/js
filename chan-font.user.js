// ==UserScript==
// @name         Block Font Downloads on MSN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block font downloads from msn.com
// @author       You
// @match        *://www.msn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Sử dụng interception để chặn các yêu cầu tải font
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && args[0].includes('.woff') || args[0].includes('.ttf') || args[0].includes('.otf')) {
            console.log('Blocked font fetch request:', args[0]);
            return Promise.resolve(new Response(null, { status: 403 }));
        }
        return originalFetch.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.includes('.woff') || url.includes('.ttf') || url.includes('.otf')) {
            console.log('Blocked font XHR request:', url);
            this.abort();
        } else {
            originalOpen.apply(this, [method, url, ...rest]);
        }
    };
})();
