// ==UserScript==
// @name         Kiểm tra mạng dữ liệu
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hiển thị thông báo mạng: Dữ liệu di động hoặc Wi-Fi
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Tạo banner thông báo
    const banner = document.createElement('div');
    banner.id = 'network-info-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.zIndex = '9999';
    banner.style.backgroundColor = '#000'; // Màu nền
    banner.style.color = '#fff'; // Màu chữ
    banner.style.textAlign = 'center';
    banner.style.fontSize = '16px';
    banner.style.opacity = '0.5'; // Độ mờ 50%
    banner.style.padding = '10px';
    banner.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    banner.style.pointerEvents = 'none'; // Không gây cản trở tương tác

    document.body.appendChild(banner);

    // Kiểm tra loại mạng
    function checkNetworkType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let networkType = 'Không thể xác định loại mạng'; // Dòng thông báo mặc định

        if (connection) {
            // Sử dụng effectiveType để xác định loại mạng
            const effectiveType = connection.effectiveType;
            if (effectiveType === '4g' || effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g') {
                networkType = 'Dùng dữ liệu di động';
            } else if (effectiveType === 'wifi') {
                networkType = 'Dùng Wi-Fi';
            } else {
                networkType = `Loại mạng: ${effectiveType}`;
            }
        }

        banner.textContent = networkType;
    }

    // Cập nhật loại mạng khi có thay đổi
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        connection.addEventListener('change', checkNetworkType);
    }

    // Kiểm tra ngay khi khởi chạy
    checkNetworkType();
})();
