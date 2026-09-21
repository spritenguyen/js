// ==UserScript==
// @name         Voz Modern Mobile Nav & Action Hub v3
// @namespace    https://voz.vn/
// @version      3.0
// @description  Thiết kế lại hoàn toàn Action Hub dạng lưới 3x2, sửa triệt để lỗi không nhận click và chống tràn layout.
// @author       Assistant
// @match        https://voz.vn/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 1. Nhúng CSS Modern One-UI Grid
    const style = document.createElement('style');
    style.id = 'voz-hub-v3-styles';
    style.textContent = `
        /* Chống tràn chiều ngang tuyệt đối */
        html, body {
            max-width: 100vw !important;
            overflow-x: hidden !important;
        }

        /* Ẩn các icon cũ trên header khi ở chế độ thu gọn */
        .voz-compact-mode .p-nav-opposite .p-navgroup-link:not(#voz-hub-trigger),
        .voz-compact-mode .p-nav-opposite a[href*="whats-new"],
        .voz-compact-mode .p-nav-opposite a[href*="search"],
        .voz-compact-mode .p-nav-opposite a[href*="conversations"],
        .voz-compact-mode .p-nav-opposite a[href*="alerts"],
        .voz-compact-mode .p-discovery {
            display: none !important;
        }

        /* Nút Capsule trên Header */
        #voz-hub-trigger {
            display: none;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            margin: auto 4px;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            cursor: pointer;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: transform 0.15s ease;
            position: relative;
            flex-shrink: 0 !important;
            color: #fff;
        }

        .voz-compact-mode #voz-hub-trigger {
            display: inline-flex !important;
        }

        #voz-hub-trigger:active {
            transform: scale(0.92);
        }

        #voz-hub-trigger svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        /* Chấm đỏ báo tin chưa đọc trên nút trigger */
        .voz-hub-unread-dot {
            display: none;
            position: absolute;
            top: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid #1a1e29;
        }
        .voz-hub-unread-dot.active {
            display: block;
        }

        /* Nền mờ phía sau */
        #voz-sheet-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 99998;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s;
        }
        #voz-sheet-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* Bảng Bottom Sheet */
        #voz-bottom-sheet {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            max-width: 480px;
            margin: 0 auto;
            background: #181b24;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: none;
            border-radius: 24px 24px 0 0;
            padding: 12px 18px 30px;
            z-index: 99999;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.6);
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: #f1f5f9;
        }

        #voz-bottom-sheet.active {
            transform: translateY(0);
        }

        .voz-sheet-handle {
            width: 40px;
            height: 4px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 4px;
            margin: 0 auto 16px;
        }

        .voz-sheet-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding: 0 4px;
        }

        .voz-sheet-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #94a3b8;
        }

        /* Lưới 3 cột x 2 hàng cân đối */
        .voz-sheet-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        /* Thẻ liên kết chức năng */
        .voz-hub-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 14px 6px;
            border-radius: 16px;
            background: #222634;
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-decoration: none !important;
            color: #e2e8f0 !important;
            transition: background 0.15s, transform 0.15s;
            position: relative;
            -webkit-tap-highlight-color: transparent;
        }

        .voz-hub-card:active {
            transform: scale(0.94);
            background: #2d3345;
        }

        .voz-hub-icon-wrap {
            position: relative;
            width: 32px;
            height: 32px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .voz-hub-icon-wrap svg {
            width: 26px;
            height: 26px;
        }

        .voz-hub-card span {
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
        }

        /* Badge đếm thông báo */
        .voz-hub-badge {
            position: absolute;
            top: -5px;
            right: -8px;
            background: #ef4444;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 10px;
            min-width: 16px;
            text-align: center;
            border: 2px solid #222634;
        }

        /* Màu nhận diện từng Icon */
        .c-amber { fill: #f59e0b; }
        .c-blue  { fill: #38bdf8; }
        .c-red   { fill: #f87171; }
        .c-purple{ fill: #c084fc; }
        .c-green { fill: #34d399; }
        .c-teal  { fill: #2dd4bf; }
    `;
    document.head.appendChild(style);

    // 2. Vector SVG Icons
    const ICONS = {
        dots: `<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
        lightning: `<svg class="c-amber" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`,
        chat: `<svg class="c-blue" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>`,
        bell: `<svg class="c-red" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`,
        search: `<svg class="c-purple" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
        bookmark: `<svg class="c-green" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`,
        forum: `<svg class="c-teal" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`
    };

    // 3. Khởi tạo cấu trúc Bottom Sheet
    let sheet, overlay, triggerBtn, unreadDot;

    function buildModernMenu() {
        const navOpposite = document.querySelector('.p-nav-opposite');
        if (!navOpposite || document.getElementById('voz-hub-trigger')) return;

        // Tạo nút bấm kích hoạt trên thanh nav
        triggerBtn = document.createElement('div');
        triggerBtn.id = 'voz-hub-trigger';
        triggerBtn.innerHTML = `${ICONS.dots}<span class="voz-hub-unread-dot"></span>`;
        unreadDot = triggerBtn.querySelector('.voz-hub-unread-dot');
        navOpposite.appendChild(triggerBtn);

        // Backdrop Overlay
        overlay = document.createElement('div');
        overlay.id = 'voz-sheet-overlay';
        document.body.appendChild(overlay);

        // Khung trượt
        sheet = document.createElement('div');
        sheet.id = 'voz-bottom-sheet';
        sheet.innerHTML = `
            <div class="voz-sheet-handle"></div>
            <div class="voz-sheet-header">
                <span class="voz-sheet-title">Lối tắt nhanh</span>
            </div>
            <div class="voz-sheet-grid" id="voz-sheet-grid"></div>
        `;
        document.body.appendChild(sheet);

        triggerBtn.addEventListener('click', openSheet);
        overlay.addEventListener('click', closeSheet);

        // Hỗ trợ vuốt xuống để đóng
        let startY = 0;
        sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
        sheet.addEventListener('touchmove', e => {
            if (e.touches[0].clientY - startY > 60) closeSheet();
        }, { passive: true });
    }

    function openSheet() {
        renderItems();
        overlay.classList.add('active');
        sheet.classList.add('active');
    }

    function closeSheet() {
        overlay.classList.remove('active');
        sheet.classList.remove('active');
    }

    // 4. Render danh sách thẻ chức năng (6 ô đối xứng 3x2)
    function renderItems() {
        const grid = document.getElementById('voz-sheet-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Đọc số badge thông báo hiện tại từ giao diện gốc
        function getBadge(sel) {
            const el = document.querySelector(sel);
            if (!el) return null;
            const badge = el.querySelector('.badgeContainer');
            if (badge) {
                const count = badge.getAttribute('data-badge') || badge.textContent.trim();
                return (count && count !== '0') ? count : null;
            }
            return null;
        }

        const convoCount = getBadge('.p-navgroup-link--conversations');
        const alertCount = getBadge('.p-navgroup-link--alerts');

        if (unreadDot) {
            unreadDot.classList.toggle('active', !!(convoCount || alertCount));
        }

        // Cấu hình 6 mục điều hướng trực tiếp
        const navItems = [
            { href: '/whats-new/posts/', icon: ICONS.lightning, label: 'Mới nhất', badge: null },
            { href: '/conversations/',   icon: ICONS.chat,      label: 'Tin nhắn', badge: convoCount },
            { href: '/account/alerts',   icon: ICONS.bell,      label: 'Thông báo', badge: alertCount },
            { href: '/search/',          icon: ICONS.search,    label: 'Tìm kiếm', badge: null },
            { href: '/account/bookmarks',icon: ICONS.bookmark,  label: 'Dấu trang', badge: null },
            { href: '/',                 icon: ICONS.forum,     label: 'Diễn đàn', badge: null }
        ];

        navItems.forEach(item => {
            const a = document.createElement('a');
            a.className = 'voz-hub-card';
            a.href = item.href;

            a.innerHTML = `
                <div class="voz-hub-icon-wrap">
                    ${item.icon}
                    ${item.badge ? `<span class="voz-hub-badge">${item.badge}</span>` : ''}
                </div>
                <span>${item.label}</span>
            `;

            // Chuyển trang trực tiếp mượt mà, không bị chặn bởi preventDefault
            a.addEventListener('click', () => {
                closeSheet();
            });

            grid.appendChild(a);
        });
    }

    // 5. Kiểm tra kích thước và zoom
    function evaluateResponsiveness() {
        const width = window.innerWidth;
        const zoom = window.visualViewport ? window.visualViewport.scale : 1;

        if (width < 600 || zoom > 1.05) {
            document.body.classList.add('voz-compact-mode');
        } else {
            document.body.classList.remove('voz-compact-mode');
            closeSheet();
        }
    }

    // Chạy khởi tạo
    buildModernMenu();
    evaluateResponsiveness();

    window.addEventListener('resize', evaluateResponsiveness);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', evaluateResponsiveness);
    }
})();
