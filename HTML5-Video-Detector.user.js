// ==UserScript==
// @name         HTML5 Video Detector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Kiểm tra xem trang web có sử dụng video HTML5 hay không và hiển thị thông báo.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Kiểm tra sự hiện diện của thẻ <video> trên trang
    const videos = document.querySelectorAll('video');

    // Tạo thông báo
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.bottom = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontSize = '14px';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.color = 'white';
    messageDiv.style.zIndex = '9999';

    if (videos.length > 0) {
        // Nếu có video HTML5
        messageDiv.innerText = '🔍 Trang web sử dụng video HTML5!';
        messageDiv.style.background = 'rgba(0, 200, 0, 0.8)'; // Màu xanh lá
    } else {
        // Nếu không có video HTML5
        messageDiv.innerText = '⚠️ Trang web không sử dụng video HTML5!';
        messageDiv.style.background = 'rgba(200, 0, 0, 0.8)'; // Màu đỏ
    }

    // Thêm thông báo vào trang
    document.body.appendChild(messageDiv);

    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
})();
