// ==UserScript==
// @name         Custom Video Player Gestures Pro (Samsung Style)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Vuốt để tua, double tap, khóa chạm, tự động xoay ngang và tuỳ chỉnh tỷ lệ màn hình (Fit/Cover/Fill).
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS CHO CÁC THÀNH PHẦN UI ---
    const css = `
        .custom-video-toast {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-family: sans-serif;
            font-size: 16px;
            font-weight: bold;
            pointer-events: none;
            z-index: 2147483647;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .custom-video-lock-btn, .custom-video-fit-btn {
            position: absolute;
            top: 20px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: 2px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 2147483647;
            opacity: 0; /* Mặc định ẩn */
            transition: opacity 0.3s ease-in-out, transform 0.1s;
            font-size: 20px;
            pointer-events: none; /* Khóa click khi đang ẩn */
        }

        .custom-video-lock-btn {
            left: 20px;
        }

        .custom-video-fit-btn {
            right: 20px;
            font-size: 18px;
        }

        .custom-video-lock-btn.visible, .custom-video-fit-btn.visible {
            opacity: 1;
            pointer-events: auto; /* Cho phép click khi hiện */
        }

        .custom-video-lock-btn:active, .custom-video-fit-btn:active {
            transform: scale(0.9);
        }

        .custom-video-overlay.locked {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2147483646;
            background: transparent;
        }
    `;

    // Thêm CSS vào trang
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // --- LOGIC XỬ LÝ CHÍNH ---
    class VideoGestureController {
        constructor(video) {
            this.video = video;
            this.isProcessed = true;
            video.dataset.gestureProcessed = "true";

            // Trạng thái
            this.isLocked = false;
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.videoStartTime = 0;
            this.isSwiping = false;
            this.lastTapTime = 0;
            this.uiTimeout = null;
            
            // Trạng thái Fill Màn hình (Fit/Cover/Stretch)
            this.fitModes = ['contain', 'cover', 'fill'];
            this.currentFitIndex = 0;

            // UI Elements
            this.container = this.createUIContainer();
            this.toast = this.createToast();
            this.lockBtn = this.createLockBtn();
            this.fitBtn = this.createFitBtn();
            this.lockOverlay = document.createElement('div');

            this.container.appendChild(this.toast);
            this.container.appendChild(this.lockBtn);
            this.container.appendChild(this.fitBtn);

            this.attachUI();
            this.bindEvents();
            this.setupFullscreenAutoRotate();
        }

        createUIContainer() {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.left = '0';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.pointerEvents = 'none';
            div.style.zIndex = '2147483645';
            return div;
        }

        createToast() {
            const div = document.createElement('div');
            div.className = 'custom-video-toast';
            return div;
        }

        createLockBtn() {
            const btn = document.createElement('div');
            btn.className = 'custom-video-lock-btn';
            btn.innerHTML = '🔓';

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleLock();
            });
            // Ngăn chặn sự kiện touch xuyên qua nút
            btn.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: false});
            return btn;
        }

        createFitBtn() {
            const btn = document.createElement('div');
            btn.className = 'custom-video-fit-btn';
            btn.innerHTML = '🔲'; // Icon mặc định

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleFitMode();
            });
            btn.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: false});
            return btn;
        }

        attachUI() {
            if (this.video.parentNode) {
                const parentStyle = window.getComputedStyle(this.video.parentNode);
                if (parentStyle.position === 'static') {
                    this.video.parentNode.style.position = 'relative';
                }
                this.video.parentNode.insertBefore(this.container, this.video.nextSibling);
            }
        }

        showToast(text, duration = 1000) {
            this.toast.innerHTML = text;
            this.toast.style.opacity = '1';
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                this.toast.style.opacity = '0';
            }, duration);
        }

        // TÍNH NĂNG MỚI: Ẩn/Hiện UI thông minh
        showUIControls() {
            this.lockBtn.classList.add('visible');
            if (!this.isLocked) {
                this.fitBtn.classList.add('visible'); // Chỉ hiện nút Fit khi chưa khóa màn hình
            }
            
            clearTimeout(this.uiTimeout);

            // Tự động ẩn sau 3 giây
            this.uiTimeout = setTimeout(() => {
                this.lockBtn.classList.remove('visible');
                this.fitBtn.classList.remove('visible');
            }, 3000);
        }

        toggleLock() {
            this.isLocked = !this.isLocked;
            if (this.isLocked) {
                this.lockBtn.innerHTML = '🔒';
                this.fitBtn.classList.remove('visible'); // Ẩn luôn nút Fit để tránh bấm nhầm
                this.showToast('Đã khóa màn hình', 1500);

                this.lockOverlay.className = 'custom-video-overlay locked';
                this.lockOverlay.style.pointerEvents = 'auto';
                this.container.appendChild(this.lockOverlay);
            } else {
                this.lockBtn.innerHTML = '🔓';
                this.showToast('Đã mở khóa', 1500);

                if(this.lockOverlay.parentNode) {
                    this.lockOverlay.parentNode.removeChild(this.lockOverlay);
                }
            }
            // Đặt lại thời gian ẩn UI sau khi tương tác
            this.showUIControls();
        }

        // TÍNH NĂNG MỚI: Thay đổi tỷ lệ khung hình
        toggleFitMode() {
            this.currentFitIndex = (this.currentFitIndex + 1) % this.fitModes.length;
            const mode = this.fitModes[this.currentFitIndex];

            // Áp dụng CSS object-fit cho video, dùng 'important' để ghi đè style của web gốc
            this.video.style.setProperty('object-fit', mode, 'important');

            let toastText = '';
            let icon = '';
            
            switch(mode) {
                case 'contain':
                    toastText = 'Mặc định (Vừa vặn)';
                    icon = '🔲';
                    break;
                case 'cover':
                    toastText = 'Lấp đầy (Cắt viền)';
                    icon = '🔳';
                    break;
                case 'fill':
                    toastText = 'Kéo giãn (Tràn viền)';
                    icon = '↔️';
                    break;
            }

            this.fitBtn.innerHTML = icon;
            this.showToast(toastText, 1500);
            this.showUIControls(); // Reset timer ẩn UI
        }

        bindEvents() {
            const options = { passive: false, capture: true };

            this.video.addEventListener('touchstart', (e) => this.handleTouchStart(e), options);
            this.video.addEventListener('touchmove', (e) => this.handleTouchMove(e), options);
            this.video.addEventListener('touchend', (e) => this.handleTouchEnd(e), options);

            // Khi đang khóa, chạm vào màn hình (overlay) sẽ hiện nút unlock
            this.lockOverlay.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.showUIControls();
            }, {passive: false});
        }

        handleTouchStart(e) {
            if (this.isLocked) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            if (e.touches.length !== 1) return;

            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.videoStartTime = this.video.currentTime;
            this.isSwiping = false;

            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTapTime;

            if (tapLength < 300 && tapLength > 0) {
                // Double tap
                e.preventDefault();
                e.stopPropagation();

                const rect = this.video.getBoundingClientRect();
                const tapX = touch.clientX - rect.left;

                if (tapX < rect.width / 2) {
                    this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                    this.showToast('⏪ -10s');
                } else {
                    this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                    this.showToast('⏩ +10s');
                }
                this.lastTapTime = 0;
            } else {
                this.lastTapTime = currentTime;
            }
        }

        handleTouchMove(e) {
            if (this.isLocked || e.touches.length !== 1) {
                if(this.isLocked) { e.preventDefault(); e.stopPropagation(); }
                return;
            }

            const touch = e.touches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = Math.abs(touch.clientY - this.touchStartY);

            if (!this.isSwiping && Math.abs(deltaX) > 20 && deltaY < Math.abs(deltaX)) {
                this.isSwiping = true;
            }

            if (this.isSwiping) {
                e.preventDefault();
                e.stopPropagation();

                const screenWidth = window.innerWidth || document.documentElement.clientWidth;
                const scrubFactor = 60 / screenWidth;

                let newTime =
