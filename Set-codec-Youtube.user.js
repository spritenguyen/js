// ==UserScript==
// @name         Set codec Youtube & Block High FPS
// @namespace    https://www.youtube.com
// @version      2.0.1
// @description  Tối ưu hóa codec Youtube, cho phép bật tắt chặn AV1, VP8, VP9 và High FPS qua Menu.
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Cấu hình mặc định
    const DEFAULT_CONFIG = {
        blockAV1: true,
        blockVP8: true,
        blockVP9: false, // Mặc định không chặn VP9
        blockHighFPS: false
    };

    // 2. Tải cấu hình từ bộ nhớ
    const config = {
        blockAV1: GM_getValue('blockAV1', DEFAULT_CONFIG.blockAV1),
        blockVP8: GM_getValue('blockVP8', DEFAULT_CONFIG.blockVP8),
        blockVP9: GM_getValue('blockVP9', DEFAULT_CONFIG.blockVP9),
        blockHighFPS: GM_getValue('blockHighFPS', DEFAULT_CONFIG.blockHighFPS)
    };

    let menuCommandIds = [];

    // 3. Hàm tạo Menu cho Violentmonkey / Tampermonkey
    function setupMenu() {
        // Xóa menu cũ (hữu ích khi YouTube dùng SPA - chuyển trang không reload)
        menuCommandIds.forEach(id => GM_unregisterMenuCommand(id));
        menuCommandIds = [];

        const registerToggle = (key, label) => {
            // Hiển thị trạng thái BẬT/TẮT bằng icon cho trực quan
            const stateText = config[key] ? '🔴 ĐANG CHẶN' : '⚪ BÌNH THƯỜNG';
            const id = GM_registerMenuCommand(`${stateText} | ${label}`, () => {
                // Đảo ngược trạng thái và lưu lại
                config[key] = !config[key];
                GM_setValue(key, config[key]);
                
                // Cập nhật lại menu (Đã bỏ location.reload() để không tự động F5)
                setupMenu();
            });
            menuCommandIds.push(id);
        };

        registerToggle('blockAV1', 'Codec AV1 (av01)');
        registerToggle('blockVP9', 'Codec VP9 (vp9)');
        registerToggle('blockVP8', 'Codec VP8 (vp8)');
        registerToggle('blockHighFPS', 'Video High FPS (>30fps)');
    }

    // Khởi tạo menu
    setupMenu();

    // 4. Hook vào MediaSource (Lõi của Script)
    const mediaSource = window.MediaSource;
    if (!mediaSource) return;

    const originalIsTypeSupported = mediaSource.isTypeSupported.bind(mediaSource);

    mediaSource.isTypeSupported = (type) => {
        if (typeof type !== 'string') return false;

        const typeLower = type.toLowerCase();

        // Kiểm tra và chặn các codec theo cài đặt (Đã fix lỗi lọt VP09 và VP08)
        if (config.blockAV1 && typeLower.includes('av01')) return false;
        if (config.blockVP8 && (typeLower.includes('vp8') || typeLower.includes('vp08'))) return false;
        if (config.blockVP9 && (typeLower.includes('vp9') || typeLower.includes('vp09'))) return false;

        // Kiểm tra FPS nếu tính năng chặn được bật
        if (config.blockHighFPS) {
            const frameRateMatch = /framerate=(\d+)/.exec(typeLower);
            if (frameRateMatch && parseInt(frameRateMatch[1], 10) > 30) {
                return false;
            }
        }

        // Nếu không thuộc diện bị chặn, trả về kết quả gốc của trình duyệt
        return originalIsTypeSupported(type);
    };
})();
