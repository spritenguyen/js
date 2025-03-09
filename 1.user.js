// ==UserScript==
// @name         Universal Video Controls (Enhanced with Recording)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Thêm các nút điều khiển, chế độ PiP, chụp ảnh màn hình, khôi phục tốc độ mặc định, và quay video/GIF cho video HTML5. Tối ưu trên Windows và Android với giao diện responsive hiện đại.
// @author       Bạn
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Xử lý từng video trên trang
    document.querySelectorAll('video').forEach(video => {
        if (!video.parentElement || video.dataset.controlsEnhanced) return;

        video.dataset.controlsEnhanced = true;

        // Tạo container cho các nút điều khiển
        const controlContainer = document.createElement('div');
        controlContainer.style.position = 'absolute';
        controlContainer.style.bottom = '10px';
        controlContainer.style.left = '50%';
        controlContainer.style.transform = 'translateX(-50%)';
        controlContainer.style.background = 'rgba(0, 0, 0, 0.7)';
        controlContainer.style.borderRadius = '10px';
        controlContainer.style.padding = '5px';
        controlContainer.style.display = 'flex';
        controlContainer.style.flexWrap = 'wrap';
        controlContainer.style.gap = '5px';
        controlContainer.style.justifyContent = 'center';
        controlContainer.style.zIndex = '9999';
        controlContainer.style.maxWidth = '90%';

        // Hàm tạo các nút
        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.innerText = text;
            button.style.background = 'rgba(255, 255, 255, 0.2)';
            button.style.color = 'white';
            button.style.border = '1px solid white';
            button.style.borderRadius = '5px';
            button.style.padding = '10px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '12px';
            button.addEventListener('click', onClick);
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onClick();
            });
            return button;
        };

        // Biến hỗ trợ quay video/GIF
        let mediaRecorder;
        let chunks = [];
        const startRecording = (type) => {
            chunks = [];
            const stream = video.captureStream();
            mediaRecorder = new MediaRecorder(stream, { mimeType: type });
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = type === 'video/webm' ? 'recording.webm' : 'recording.gif';
                link.click();
            };

            mediaRecorder.start();
        };

        const stopRecording = () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };

        // Nút chức năng
        const pauseButton = createButton('⏯️ Pause/Play', () => {
            video.paused ? video.play() : video.pause();
        });

        const rewindButton = createButton('⏪ -10s', () => {
            video.currentTime -= 10;
        });

        const forwardButton = createButton('⏩ +10s', () => {
            video.currentTime += 10;
        });

        const decreaseSpeedButton = createButton('➖ Speed -0.5', () => {
            video.playbackRate = Math.max(video.playbackRate - 0.5, 0.5);
        });

        const resetSpeedButton = createButton('🔄 Reset Speed', () => {
            video.playbackRate = 1.0;
        });

        const increaseSpeedButton = createButton('➕ Speed +0.5', () => {
            video.playbackRate = Math.min(video.playbackRate + 0.5, 16.0);
        });

        const pipButton = createButton('🔳 Force PiP', async () => {
            if (video !== document.pictureInPictureElement) {
                try {
                    await video.requestPictureInPicture();
                } catch (error) {
                    alert('Chế độ Picture-in-Picture không khả dụng trên trình duyệt này.');
                    console.error(error);
                }
            } else {
                await document.exitPictureInPicture();
            }
        });

        const screenshotButton = createButton('📸 Screenshot', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const link = document.createElement('a');
            link.download = 'screenshot.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        const recordVideoButton = createButton('📹 Start Video', () => {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                startRecording('video/webm');
                recordVideoButton.innerText = '⏹️ Stop Video';
            } else {
                stopRecording();
                recordVideoButton.innerText = '📹 Start Video';
            }
        });

        const recordGifButton = createButton('🎥 Start GIF', () => {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                startRecording('image/gif');
                recordGifButton.innerText = '⏹️ Stop GIF';
            } else {
                stopRecording();
                recordGifButton.innerText = '🎥 Start GIF';
            }
        });

        // Thêm các nút vào container theo thứ tự
        controlContainer.appendChild(rewindButton);
        controlContainer.appendChild(pauseButton);
        controlContainer.appendChild(forwardButton);
        controlContainer.appendChild(decreaseSpeedButton);
        controlContainer.appendChild(resetSpeedButton); // Nút reset ở giữa
        controlContainer.appendChild(increaseSpeedButton);
        controlContainer.appendChild(recordVideoButton); // Nút quay video
        controlContainer.appendChild(recordGifButton); // Nút quay GIF
        controlContainer.appendChild(pipButton);
        controlContainer.appendChild(screenshotButton);

        // Gắn container vào video
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(controlContainer);

        // Hiệu ứng hiện/ẩn container khi di chuột hoặc chạm
        controlContainer.style.opacity = '0';
        controlContainer.style.transition = 'opacity 0.3s';

        const showControls = () => {
            controlContainer.style.opacity = '1';
            clearTimeout(video._hideTimeout);
            video._hideTimeout = setTimeout(() => {
                controlContainer.style.opacity = '0';
            }, 3000); // Ẩn sau 3 giây không tương tác
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
    });
})();
