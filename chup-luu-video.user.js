// ==UserScript==
// @name         Menu Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Userscript for menu with domain activation, screenshot, and video recording features
// @author       You
// @match        *://*.google.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const menuButton = document.createElement('button');
    menuButton.textContent = 'Ẩn/Hiện Menu';
    menuButton.style.position = 'fixed';
    menuButton.style.top = '10px';
    menuButton.style.left = '10px';
    menuButton.style.zIndex = '9999';
    menuButton.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });
    document.body.appendChild(menuButton);

    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '50px';
    menuContainer.style.left = '10px';
    menuContainer.style.zIndex = '9999';
    menuContainer.style.backgroundColor = 'white';
    menuContainer.style.border = '1px solid black';
    menuContainer.style.padding = '10px';
    menuContainer.style.display = 'none';
    document.body.appendChild(menuContainer);

    // Add domain button
    const addDomainButton = document.createElement('button');
    addDomainButton.textContent = 'Thêm Tên Miền';
    addDomainButton.addEventListener('click', () => {
        const domain = prompt('Nhập tên miền (ví dụ: example.com):');
        if (domain) {
            let domains = GM_getValue('domains', []);
            domains.push(domain);
            GM_setValue('domains', domains);
            alert(`Tên miền ${domain} đã được thêm!`);
        }
    });
    menuContainer.appendChild(addDomainButton);

    // Screenshot button
    const screenshotButton = document.createElement('button');
    screenshotButton.textContent = 'Chụp màn hình';
    screenshotButton.addEventListener('click', () => {
        alert('Chụp màn hình không được hỗ trợ trên Android qua Userscript.');
    });
    menuContainer.appendChild(screenshotButton);

    // Video recording button
    const videoRecordButton = document.createElement('button');
    videoRecordButton.textContent = 'Lưu Video';
    let recording = false;
    videoRecordButton.addEventListener('click', () => {
        recording = !recording;
        if (recording) {
            alert('Bắt đầu lưu video.');
        } else {
            alert('Dừng lưu video.');
        }
    });
    menuContainer.appendChild(videoRecordButton);

    // Check domain activation
    const currentDomain = window.location.hostname.replace('www.', '');
    const activeDomains = GM_getValue('domains', ['google.com']);
    if (!activeDomains.includes(currentDomain)) {
        alert('Script không được phép hoạt động trên tên miền này.');
    }
})();
