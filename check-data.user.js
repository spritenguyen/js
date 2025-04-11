// ==UserScript==
// @name         Kiểm tra mạng dữ liệu (Cập nhật)
// @namespace    http://tampermonkey.net/
// @version      1.2
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
    banner.style.pointerEvents = 'none'; // Không làm cản trở

    document.body.appendChild(banner);

    // Phương pháp phát hiện mạng
    function checkNetworkType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let networkType = 'Không thể xác định loại mạng'; // Thông báo mặc định

        if (connection) {
            const effectiveType = connection.effectiveType;
            if (effectiveType.includes('2g') || effectiveType.includes('3g') || effectiveType.includes('4g')) {
                networkType = 'Dùng dữ liệu di động';
            } else if (effectiveType === 'wifi' || connection.type === 'wifi') {
                networkType = 'Dùng Wi-Fi';
            } else {
                networkType = `Loại mạng khác: ${effectiveType}`;
            }
        } else {
            // Cách dự phòng: Kiểm tra qua hostname (chỉ hiệu quả trong một số trường hợp)
            const isWiFi = location.hostname === '192.168.1.1' || location.hostname.startsWith('192.168.');
            networkType = isWiFi ? 'Dùng Wi-Fi' : 'Dùng dữ liệu di động';
        }

        banner.textContent = networkType;
    }

    // Lắng nghe thay đổi mạng
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        connection.addEventListener('change', checkNetworkType);
    }

    // Kiểm tra ngay khi khởi chạy
    checkNetworkType();
})();
