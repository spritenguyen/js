// ==UserScript==
// @name         bắt link sub; ẩn hiện bằng ctrl + alt + S
// @namespace
// @version      1.3
// @description
// @author
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const subtitleRegex = /\.(srt|vtt|ass)(\?|$)/i;
    const foundSubs = new Set();
    let subtitleBox;

    function createBox() {
        const div = document.createElement('div');
        div.id = 'subtitle-box';
        div.style.position = 'fixed';
        div.style.left = '10px';
        div.style.top = '10px';
        div.style.zIndex = 9999;
        div.style.background = 'rgba(0,0,0,0.85)';
        div.style.color = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.maxWidth = '360px';
        div.style.fontSize = '14px';
        div.style.fontFamily = 'monospace';
        div.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        div.style.cursor = 'move';
        div.innerHTML = '<b>📄 Phụ đề được phát hiện:</b><br>';
        document.body.appendChild(div);
        subtitleBox = div;

        // Kéo bằng chuột
        let isDragging = false, offsetX, offsetY;
        div.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
            div.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                div.style.left = (e.clientX - offsetX) + 'px';
                div.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        return div;
    }

    function displaySubLink(url) {
        if (foundSubs.has(url)) return;
        foundSubs.add(url);

        const box = subtitleBox || createBox();

        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.style.color = '#00ffff';
        link.style.display = 'inline-block';
        link.style.wordBreak = 'break-all';
        link.style.marginBottom = '4px';
        link.target = '_blank';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copy';
        copyBtn.style.marginLeft = '6px';
        copyBtn.style.background = '#444';
        copyBtn.style.color = '#fff';
        copyBtn.style.border = 'none';
        copyBtn.style.padding = '2px 6px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.borderRadius = '4px';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(url).then(() => {
                copyBtn.textContent = '✅ Copied';
                setTimeout(() => copyBtn.textContent = '📋 Copy', 1500);
            });
        };

        const line = document.createElement('div');
        line.style.marginBottom = '6px';
        line.appendChild(link);
        line.appendChild(copyBtn);
        box.appendChild(line);
    }

    // Gắn vào fetch và XHR
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (subtitleRegex.test(response.url)) displaySubLink(response.url);
            return response;
        });
    };

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends originalXHR {
        open(...args) {
            this._url = args[1];
            return super.open(...args);
        }
        send(...args) {
            this.addEventListener('load', () => {
                if (subtitleRegex.test(this._url)) displaySubLink(this._url);
            });
            return super.send(...args);
        }
    };

    // Phím tắt Ctrl + Alt + S
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
            const box = document.getElementById('subtitle-box');
            if (box) {
                box.style.display = (box.style.display === 'none') ? 'block' : 'none';
            }
        }
    });
})();
