// ==UserScript==
// @name         HTML5 Video Detector
// @namespace    https://example.com
// @version      1.0
// @description  Phát hiện video HTML5 và hiển thị thông báo trong 5 giây
// @author       Nguyen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Kiểm tra sự hiện diện của video HTML5
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
        // Tạo phần tử thông báo
        const notification = document.createElement('div');
        notification.textContent = 'HTML5 Video Detected!';
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontSize = '14px';

        // Thêm thông báo vào trang
        document.body.appendChild(notification);

        // Xóa thông báo sau 5 giây
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
})();
