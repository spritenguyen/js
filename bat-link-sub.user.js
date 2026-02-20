// ==UserScript==
// @name         Subtitle Sniffer Safe
// @namespace    spritenguyen.subtitle.safe
// @version      1.3.1
// @description  Tìm link phụ đề an toàn (không hook fetch)
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    const SUB_REGEX = /\.(srt|vtt|ass|ssa|sub)(\?|$)/i;
    const found = new Set();
    let enabled = GM_getValue('enabled', true);
    let panel = null;

    function createPanel() {
        if (panel) return panel;

        panel = document.createElement('div');
        panel.style.cssText = `
            position:fixed;
            bottom:15px;
            right:15px;
            z-index:999999;
            background:rgba(0,0,0,0.85);
            color:#fff;
            padding:10px;
            border-radius:8px;
            font-size:13px;
            max-width:350px;
            max-height:50vh;
            overflow:auto;
            font-family:monospace;
        `;

        document.body.appendChild(panel);
        return panel;
    }

    function addSubtitle(url) {
        if (!enabled) return;
        if (!SUB_REGEX.test(url)) return;
        if (found.has(url)) return;

        found.add(url);
        const box = createPanel();

        const item = document.createElement('div');
        item.style.marginBottom = '6px';

        const link = document.createElement('a');
        link.href = url;
        link.textContent = '📄 ' + url.split('/').pop();
        link.target = '_blank';
        link.style.color = '#00ffff';
        link.style.wordBreak = 'break-all';

        const copy = document.createElement('button');
        copy.textContent = 'Copy';
        copy.style.marginLeft = '5px';
        copy.onclick = () => navigator.clipboard.writeText(url);

        item.appendChild(link);
        item.appendChild(copy);
        box.appendChild(item);
    }

    // 1️⃣ Quét thẻ <track>
    function scanTracks() {
        document.querySelectorAll('track').forEach(track => {
            if (track.src) addSubtitle(track.src);
        });
    }

    // 2️⃣ Quét performance entries (request đã load)
    function scanPerformance() {
        performance.getEntries().forEach(entry => {
            if (entry.name) addSubtitle(entry.name);
        });
    }

    // 3️⃣ Theo dõi DOM động
    const observer = new MutationObserver(() => {
        scanTracks();
    });

    function startObserver() {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function stopObserver() {
        observer.disconnect();
    }

    // ===== MENU =====

    GM_registerMenuCommand('🔎 Toggle Script', () => {
        enabled = !enabled;
        GM_setValue('enabled', enabled);
        alert('Subtitle Sniffer: ' + (enabled ? 'ON' : 'OFF'));
    });

    GM_registerMenuCommand('🗑 Clear List', () => {
        found.clear();
        if (panel) panel.innerHTML = '';
    });

    // ===== INIT =====

    if (enabled) {
        scanTracks();
        scanPerformance();
        startObserver();
    }

})();
