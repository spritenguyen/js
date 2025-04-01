// ==UserScript==
// @name         Optimized HTML5 Video Controls Stylish Dropdown Menu
// @namespace    https://example.com
// @version      1.6.5
// @description  Menu tối ưu: các nút nằm gọn dưới nút menu chính, chạy mượt mà hơn, tự động phát lại video sau 0.5 giây.
// @author       Nguyen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tìm tất cả các video HTML5 trên trang
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
        videos.forEach((video) => {
            const container = video.parentElement;

            // Đảm bảo video container có vị trí tương đối
            if (window.getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }

            // Tạo nút menu hamburger
            const toggleButton = document.createElement('button');
            Object.assign(toggleButton.style, {
                position: 'absolute',
                top: '50px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: 'none',
                padding: '6px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                zIndex: '10001',
                cursor: 'pointer',
                fontSize: '16px',
                textAlign: 'center',
                lineHeight: '18px',
            });
            toggleButton.textContent = '☰';
            container.appendChild(toggleButton);

            // Tạo menu chính
            const menu = document.createElement('div');
            Object.assign(menu.style, {
                position: 'absolute',
                top: '90px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                padding: '10px',
                borderRadius: '5px',
                zIndex: '10000',
                display: 'none',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                transition: 'background-color 0.3s',
                flexDirection: 'column',
                gap: '10px',
            });
            container.appendChild(menu);

            toggleButton.addEventListener('click', () => {
                menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
                setTimeout(() => video.play(), 500); // Tự động phát lại video sau 0.5 giây
            });

            // Hàm tạo nút chung
            const createMenuButton = (text, onClickHandler) => {
                const button = document.createElement('button');
                Object.assign(button.style, {
                    backgroundColor: 'rgba(51, 51, 51, 0.7)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.3s',
                });
                button.textContent = text;
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = 'rgba(51, 51, 51, 1)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = 'rgba(51, 51, 51, 0.7)';
                });
                button.addEventListener('click', onClickHandler);
                return button;
            };

            // Nút chụp ảnh màn hình
            const screenshotButton = createMenuButton('Chụp ảnh màn hình', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const img = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = img;
                link.download = 'screenshot.png';
                link.click();
                setTimeout(() => video.play(), 500); // Tự động phát lại video sau 0.5 giây
            });

            // Nút lưu video
            let mediaRecorder;
            let recordedChunks = [];
            const recordButton = createMenuButton('Lưu video', () => {
                if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                    recordedChunks = [];
                    const stream = video.captureStream();
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    };
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'recorded_video.webm';
                        link.click();
                    };
                    mediaRecorder.start();
                    recordButton.textContent = 'Dừng lưu video';
                } else {
                    mediaRecorder.stop();
                    recordButton.textContent = 'Lưu video';
                }
                setTimeout(() => video.play(), 500); // Tự động phát lại video sau 0.5 giây
            });

            // Thêm nút vào menu
            menu.appendChild(screenshotButton);
            menu.appendChild(recordButton);
        });
    }
})();
