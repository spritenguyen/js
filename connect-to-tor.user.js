// ==UserScript==
// @name         Tor SOCKS5 Proxy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Định tuyến lưu lượng qua Tor bằng proxy SOCKS5
// @author       Tên của bạn
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/https-proxy-agent@2.2.3/index.js
// ==/UserScript==

(function() {
    'use strict';

    // Cấu hình proxy SOCKS5
    const proxyHost = '127.0.0.1';
    const proxyPort = '9050';

    // Tạo một proxy agent
    const HttpsProxyAgent = require('https-proxy-agent');
    const proxy = `socks5://${proxyHost}:${proxyPort}`;
    const agent = new HttpsProxyAgent(proxy);

    // Ghi đè hàm fetch để sử dụng proxy SOCKS5
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (!init) init = {};
        if (!init.agent) init.agent = agent;
        return originalFetch(input, init);
    };

    // Ghi đè XMLHttpRequest để sử dụng proxy SOCKS5
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.setRequestHeader('Proxy-Authorization', `Basic ${btoa(proxyHost + ':' + proxyPort)}`);
        originalXHROpen.apply(this, arguments);
    };
})();
