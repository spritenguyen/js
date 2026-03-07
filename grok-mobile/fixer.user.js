// ==UserScript==
// @name         Grok UI/UX Fixer (Edge Android)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tối ưu giao diện Grok: Ẩn sidebar thừa, tăng độ rộng khung chat, chỉnh font chữ.
// @author       Gemini
// @match        https://grok.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS Injection để can thiệp sâu vào giao diện
    const css = `
        /* Ẩn bớt các thành phần thừa ở sidebar để tập trung vào chat */
        [data-testid="sidebar"] { 
            max-width: 60px !important; 
            transition: width 0.3s !important;
        }

        /* Mở rộng khung nội dung chính */
        main {
            padding: 10px !important;
            max-width: 100% !important;
        }

        /* Tối ưu hóa bóng bong bóng chat */
        .chat-bubble {
            border-radius: 15px !important;
            font-size: 16px !important; /* Size chữ dễ đọc hơn trên mobile */
            line-height: 1.5 !important;
        }

        /* Ẩn các banner quảng cáo hoặc nút cài đặt app gây vướng */
        div[class*="InstallAppBanner"] {
            display: none !important;
        }

        /* Làm nút gửi tin nhắn to hơn, dễ bấm bằng ngón cái */
        button[aria-label="Send message"] {
            transform: scale(1.2);
            margin-right: 10px;
        }

        /* Fix lỗi tràn khung hình ảnh trên màn hình hẹp */
        img {
            max-width: 100% !important;
            height: auto !important;
        }
    `;

    // Áp dụng CSS
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // 2. Logic xử lý hành vi (UX)
    // Tự động focus vào ô input khi trang load xong
    window.addEventListener('load', () => {
        const input = document.querySelector('textarea, input[type="text"]');
        if (input) input.focus();
    });

})();
