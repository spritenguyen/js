// ==UserScript==
// @name         Full Function Menu Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Userscript for managing domain activation, screenshot, and video recording
// @author       Nguyen
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Create toggle menu button
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Ẩn/Hiện Menu';
    menuButton.style.position = 'fixed';
    menuButton.style.top = '10px';
    menuButton.style.left = '10px';
    menuButton.style.zIndex = '9999';
    menuButton.style.backgroundColor = '#4CAF50';
    menuButton.style.color = 'white';
    menuButton.style.border = 'none';
    menuButton.style.padding = '10px';
    menuButton.style.cursor = 'pointer';
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

    menuButton.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Add domain button
    const addDomainButton = document.createElement('button');
    addDomainButton.textContent = 'Thêm Tên Miền';
    addDomainButton.style.display = 'block';
    addDomainButton.style.marginBottom = '5px';
    addDomainButton.addEventListener('click', () => {
        const domain = prompt('Nhập tên miền (ví dụ: example.com):');
        if (domain) {
            let domains = GM_getValue('domains', ['google.com']);
            if (!domains.includes(domain)) {
                domains.push(domain);
                GM_setValue('domains', domains);
                alert(`Tên miền ${domain} đã được thêm. Mở tab mới để kiểm tra.`);
            } else {
                alert(`Tên miền ${domain} đã tồn tại.`);
            }
        }
    });
    menuContainer.appendChild(addDomainButton);

    // Screenshot button
    const screenshotButton = document.createElement('button');
    screenshotButton.textContent = 'Chụp màn hình';
    screenshotButton.style.display = 'block';
    screenshotButton.style.marginBottom = '5px';
    screenshotButton.addEventListener('click', () => {
        alert('Chụp màn hình không thể thực hiện qua Userscript.');
    });
    menuContainer.appendChild(screenshotButton);

    // Video recording button
    const videoRecordButton = document.createElement('button');
    videoRecordButton.textContent = 'Lưu Video';
    videoRecordButton.style.display = 'block';
    let recording = false;
    videoRecordButton.addEventListener('click', () => {
        recording = !recording;
        if (recording) {
            alert('Bắt đầu lưu video (mô phỏng).');
        } else {
            alert('Dừng lưu video (mô phỏng).');
        }
    });
    menuContainer.appendChild(videoRecordButton);

    // Domain activation logic
    const currentDomain = window.location.hostname.replace('www.', '');
    const activeDomains = GM_getValue('domains', ['google.com']);
    if (!activeDomains.includes(currentDomain)) {
        alert('Script không được phép hoạt động trên tên miền này.');
        return; // Dừng script nếu tên miền không được phép
    } else {
        console.log(`Script đang hoạt động trên tên miền: ${currentDomain}`);
    }
})();
