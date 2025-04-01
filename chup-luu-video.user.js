// ==UserScript==
// @name         Full Menu Script with Domain Removal
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Userscript with domain activation, screenshot, video recording, and domain removal
// @author       Nguyen
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Tạo nút Ẩn/Hiện Menu
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Ẩn/Hiện Menu';
    menuButton.style.position = 'fixed';
    menuButton.style.bottom = '60px';
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
    menuContainer.style.bottom = '10px';
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

    // Nút thêm tên miền
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
                showNotification(`Tên miền ${domain} đã được thêm. Mở tab mới để kiểm tra.`);
            } else {
                showNotification(`Tên miền ${domain} đã tồn tại.`);
            }
        }
    });
    menuContainer.appendChild(addDomainButton);

    // Nút xóa tên miền
    const removeDomainButton = document.createElement('button');
    removeDomainButton.textContent = 'Xóa Tên Miền';
    removeDomainButton.style.display = 'block';
    removeDomainButton.style.marginBottom = '5px';
    removeDomainButton.addEventListener('click', () => {
        let domains = GM_getValue('domains', ['google.com']);
        const domainToRemove = prompt(`Danh sách tên miền hiện tại: ${domains.join(', ')}\nNhập tên miền muốn xóa:`);
        if (domainToRemove && domains.includes(domainToRemove)) {
            domains = domains.filter(domain => domain !== domainToRemove);
            GM_setValue('domains', domains);
            showNotification(`Tên miền ${domainToRemove} đã được xóa.`);
        } else {
            showNotification(`Tên miền ${domainToRemove} không tồn tại hoặc không hợp lệ.`);
        }
    });
    menuContainer.appendChild(removeDomainButton);

    // Nút chụp màn hình
    const screenshotButton = document.createElement('button');
    screenshotButton.textContent = 'Chụp màn hình';
    screenshotButton.style.display = 'block';
    screenshotButton.style.marginBottom = '5px';
    screenshotButton.addEventListener('click', () => {
        showNotification('Chụp màn hình không thể thực hiện qua Userscript.');
    });
    menuContainer.appendChild(screenshotButton);

    // Nút lưu video
    const videoRecordButton = document.createElement('button');
    videoRecordButton.textContent = 'Lưu Video';
    videoRecordButton.style.display = 'block';
    let recording = false;
    videoRecordButton.addEventListener('click', () => {
        recording = !recording;
        if (recording) {
            showNotification('Bắt đầu lưu video (mô phỏng).');
        } else {
            showNotification('Dừng lưu video (mô phỏng).');
        }
    });
    menuContainer.appendChild(videoRecordButton);

    // Logic kiểm tra tên miền
    const currentDomain = window.location.hostname.replace('www.', '');
    const activeDomains = GM_getValue('domains', ['google.com']);
    if (!activeDomains.includes(currentDomain)) {
        console.log(`Tên miền hiện tại (${currentDomain}) không được phép. Script không hoạt động.`);
        return; // Dừng script nếu tên miền không được phép
    } else {
        console.log(`Script đang hoạt động trên tên miền: ${currentDomain}`);
    }

    // Hàm hiển thị thông báo
    function showNotification(message) {
        if (window.Notification && Notification.permission === 'granted') {
            new Notification(message);
        } else if (window.Notification && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
                } else {
                    alert(message); // Dự phòng nếu thông báo không được cấp quyền
                }
            });
        } else {
            console.log(message); // Sử dụng console log khi không có cách khác
        }
    }
})();
