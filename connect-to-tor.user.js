// ==UserScript==
// @name         Tor SOCKS5 Proxy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Route traffic through Tor using SOCKS5 proxy
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configure the SOCKS5 proxy
    const proxyHost = '127.0.0.1';
    const proxyPort = '9050';

    // Override the fetch function to use the SOCKS5 proxy
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (!init) init = {};
        if (!init.headers) init.headers = {};
        init.headers['Proxy-Authorization'] = `Basic ${btoa(proxyHost + ':' + proxyPort)}`;
        return originalFetch(input, init);
    };

    // Override the XMLHttpRequest to use the SOCKS5 proxy
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.setRequestHeader('Proxy-Authorization', `Basic ${btoa(proxyHost + ':' + proxyPort)}`);
        originalXHROpen.apply(this, arguments);
    };
})();
