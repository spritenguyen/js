// ==UserScript==
// @name         Universal Video Controls with Domain Manager
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Điều khiển video HTML5 và quản lý tên miền thông qua giao diện người dùng.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Lưu/đọc danh sách tên miền từ localStorage
    const DOMAIN_STORAGE_KEY = 'custom_domains';
    const getDomains = () => JSON.parse(localStorage.getItem(DOMAIN_STORAGE_KEY) || '[]');
    const saveDomains = (domains) => localStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domains));

    /**
     * Tạo giao diện quản lý tên miền
     */
    const createDomainManager = () => {
        const manager = document.createElement('div');
        Object.assign(manager.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            zIndex: '10000',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            width: '250px',
        });
        manager.innerHTML = `
            <h3 style="margin: 0; font-size: 14px; text-align: center;">Quản lý Tên miền</h3>
            <input id="domain-input" type="text" placeholder="Nhập tên miền..." style="width: 100%; padding: 5px; margin-top: 10px;"/>
            <button id="add-domain" style="width: 100%; margin-top: 5px; padding: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Thêm</button>
            <ul id="domain-list" style="list-style: none; padding: 0; margin-top: 10px; max-height: 150px; overflow-y: auto; border-top: 1px solid #ccc;"></ul>
        `;

        document.body.appendChild(manager);

        const domainInput = manager.querySelector('#domain-input');
        const addDomainButton = manager.querySelector('#add-domain');
        const domainList = manager.querySelector('#domain-list');

        const updateDomainList = () => {
            const domains = getDomains();
            domainList.innerHTML = '';
            domains.forEach((domain, index) => {
                const li = document.createElement('li');
                li.textContent = domain;
                li.style = 'margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;';
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style = 'color: white; background: red; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;';
                deleteButton.onclick = () => {
                    domains.splice(index, 1);
                    saveDomains(domains);
                    updateDomainList();
                };
                li.appendChild(deleteButton);
                domainList.appendChild(li);
            });
        };

        addDomainButton.onclick = () => {
            const domain = domainInput.value.trim();
            if (domain && !getDomains().includes(domain)) {
                const domains = getDomains();
                domains.push(domain);
                saveDomains(domains);
                domainInput.value = '';
                updateDomainList();
            }
        };

        updateDomainList();
    };

    /**
     * Tạo container điều khiển và gắn vào video
     * @param {HTMLVideoElement} video - Video cần điều khiển
     */
    const enhanceVideo = (video) => {
        if (video.dataset.controlsEnhanced) return;
        video.dataset.controlsEnhanced = true;

        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '5px',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '10px',
            padding: '5px',
            zIndex: '9999',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.3s, pointer-events 0s linear 0.3s',
        });

        const createButton = (label, action) => {
            const button = document.createElement('button');
            Object.assign(button.style, {
                flex: '1 1 auto',
                minWidth: '80px',
                padding: '10px',
                fontSize: '12px',
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #fff',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'center',
            });
            button.innerText = label;
            button.onclick = action;
            return button;
        };

        // Danh sách các nút
        const buttons = [
            createButton('⏪ -10s', () => (video.currentTime -= 10)),
            createButton('⏯️ Play/Pause', () => (video.paused ? video.play() : video.pause())),
            createButton('⏩ +10s', () => (video.currentTime += 10)),
            createButton('➖ Speed -0.5', () => (video.playbackRate = Math.max(0.5, video.playbackRate - 0.5))),
            createButton('🔄 Reset Speed', () => (video.playbackRate = 1)),
            createButton('➕ Speed +0.5', () => (video.playbackRate = Math.min(16, video.playbackRate + 0.5))),
        ];

        buttons.forEach((button) => container.appendChild(button));
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(container);

        const showControls = () => {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
            clearTimeout(video._hideTimeout);
            video._hideTimeout = setTimeout(() => {
                container.style.opacity = '0';
                container.style.pointerEvents = 'none';
            }, 3000);
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
    };

    // Kiểm tra xem tên miền hiện tại có hợp lệ không
    const currentDomain = window.location.hostname;
    if (getDomains().some(domain => currentDomain.includes(domain))) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('video').forEach        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Tạo giao diện quản lý tên miền
    createDomainManager();
})();
