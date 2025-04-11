// ==UserScript==
// @name         Chặn Tải Hình Ảnh Trên Mạng Di Động (V2)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ngăn tải hình ảnh nếu sử dụng dữ liệu di động và hiển thị thông báo gọn trong khung ảnh
// @author       Nguyen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm kiểm tra kết nối mạng có phải là di động không
    function isMobileConnection() {
        if (navigator.connection && navigator.connection.type) {
            return navigator.connection.type === 'cellular';
        }
        return false;
    }

    if (isMobileConnection()) {
        // Lấy tất cả hình ảnh trên trang
        const images = document.querySelectorAll('img');

        // Chặn tải hình ảnh và thay thế bằng thông báo
        images.forEach(img => {
            // Lưu kích thước ban đầu của ảnh
            const width = img.offsetWidth;
            const height = img.offsetHeight;

            // Tạo khung thông báo
            const placeholder = document.createElement('div');
            placeholder.textContent = 'Hình ảnh đã bị chặn do sử dụng mạng di động';
            placeholder.style.cssText = `
                width: ${width}px;
                height: ${height}px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: red;
                font-size: 14px;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
                box-sizing: border-box;
            `;

            // Thay thế ảnh bằng khung thông báo
            img.parentNode.replaceChild(placeholder, img);
        });
    }
})();
