// ==UserScript==
// @name         Mobile Data Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hiển thị thông báo khi sử dụng dữ liệu di động để cảnh báo người dùng.
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const isMobileData = () => {
        if (navigator.connection) {
            // Kiểm tra loại kết nối hoặc hiệu quả kết nối
            return navigator.connection.type === 'cellular' || ['2g', '3g', '4g'].includes(navigator.connection.effectiveType);
        }
        // Nếu trình duyệt không hỗ trợ navigator.connection
        return false;
    };

    const showNotification = () => {
        let notification = document.getElementById('mobile-data-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'mobile-data-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
            notification.style.fontSize = '14px';
            notification.style.zIndex = '9999';
            notification.innerText = 'Bạn đang sử dụng dữ liệu di động!';
            document.body.appendChild(notification);
        }
    };

    const hideNotification = () => {
        const notification = document.getElementById('mobile-data-notification');
        if (notification) {
            document.body.removeChild(notification);
        }
    };

    const checkConnection = () => {
        if (isMobileData()) {
            showNotification();
        } else {
            hideNotification();
        }
    };

    // Kiểm tra kết nối ban đầu
    checkConnection();

    // Nghe sự kiện thay đổi kết nối nếu trình duyệt hỗ trợ
    if (navigator.connection && navigator.connection.addEventListener) {
        navigator.connection.addEventListener('change', checkConnection);
    } else {
        // Cài đặt kiểm tra định kỳ (fallback cho trình duyệt không hỗ trợ)
        setInterval(checkConnection, 5000);
    }
})();
