// ==UserScript==
// @name         Firefox Android Force PiP
// @namespace    firefox.android.pip
// @version      1.0
// @description  Trigger native PiP on Firefox Android
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    let video = null;

    function getVideo() {
        video = document.querySelector("video");
    }

    async function triggerPiP() {
        if (!video) return;

        try {
            // Firefox Android cần fullscreen trước
            if (video.requestFullscreen) {
                await video.requestFullscreen();
            }

            // đảm bảo video đang chạy
            if (video.paused) {
                await video.play();
            }

        } catch (e) {
            console.log("PiP trigger error:", e);
        }
    }

    // ===== Floating Button =====
    function createButton() {

        if (document.getElementById("ff-pip-btn")) return;

        const btn = document.createElement("div");
        btn.id = "ff-pip-btn";
        btn.textContent = "PiP";

        btn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 15px;
            z-index: 999999;
            background: rgba(0,0,0,0.75);
            color: white;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 14px;
        `;

        btn.onclick = triggerPiP;

        document.body.appendChild(btn);
    }

    // Double tap video
    function setupDoubleTap() {

        if (!video || video.dataset.ffpipready) return;

        video.dataset.ffpipready = "true";

        let lastTap = 0;

        video.addEventListener("touchend", () => {

            const now = Date.now();

            if (now - lastTap < 300) {
                triggerPiP();
            }

            lastTap = now;

        }, { passive: true });
    }

    // Scan nhẹ
    setInterval(() => {
        getVideo();
        setupDoubleTap();
        createButton();
    }, 2000);

})();
