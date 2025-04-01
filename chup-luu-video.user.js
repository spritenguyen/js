// ==UserScript==
// @name         Optimized Video Controls with Domain Manager
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Điều khiển video HTML5 và quản lý tên miền qua giao diện đơn giản hơn.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DOMAIN_STORAGE_KEY = 'custom_domains';
    const getDomains = () => JSON.parse(localStorage.getItem(DOMAIN_STORAGE_KEY) || '[]');
    const saveDomains = (domains) => localStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domains));

    // Quản lý giao diện
    const createDomainManager = () => {
        const manager = document.createElement('div');
        Object.assign(manager.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#fff',
            border: '1px solid #ccc',
            zIndex: '10000',
            padding: '10px',
            borderRadius: '8px',
        });
        manager.innerHTML = `
            <input id="domain-input" placeholder="Nhập tên miền" style="width: 100%; margin-bottom: 10px;">
            <button id="add-domain" style="width: 100%; background: #007bff; color: white;">Thêm</button>
            <ul id="domain-list" style="margin-top: 10px;"></ul>
        `;
        document.body.appendChild(manager);

        const domainInput = manager.querySelector('#domain-input');
        const addButton = manager.querySelector('#add-domain');
        const domainList = manager.querySelector('#domain-list');

        const updateDomainList = () => {
            const domains = getDomains();
            domainList.innerHTML = '';
            domains.forEach(domain => {
                const item = document.createElement('li');
                item.textContent = domain;
                domainList.appendChild(item);
            });
        };

        addButton.onclick = () => {
            const newDomain = domainInput.value.trim();
            if (newDomain && !getDomains().includes(newDomain)) {
                const updatedDomains = getDomains();
                updatedDomains.push(newDomain);
                saveDomains(updatedDomains);
                updateDomainList();
                alert(`Tên miền "${newDomain}" đã được thêm.`);
            }
        };

        updateDomainList();
    };

    // Điều khiển video
    const enhanceVideo = (video) => {
        if (video.dataset.enhanced) return;
        video.dataset.enhanced = true;

        const controls = document.createElement('div');
        Object.assign(controls.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '5px',
            borderRadius: '5px',
            zIndex: '9999',
        });

        const createButton = (text, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.margin = '0 5px';
            btn.onclick = onClick;
            return btn;
        };

        controls.appendChild(createButton('-10s', () => video.currentTime -= 10));
        controls.appendChild(createButton('Play/Pause', () => video.paused ? video.play() : video.pause()));
        controls.appendChild(createButton('+10s', () => video.currentTime += 10));

        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(controls);
    };

    // Kiểm tra tên miền
    if (getDomains().some(domain => window.location.hostname.includes(domain))) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('video').forEach(enhanceVideo);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    createDomainManager();
})();
