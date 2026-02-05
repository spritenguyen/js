// ==UserScript==
// @name         Firefox Android Auto PiP on Tab Switch (YouTube)
// @namespace    ff.auto.pip.yt
// @version      1.0
// @match        https://m.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let video = null;

    function getVideo() {
        video = document.querySelector("video");
        if (video) video.disablePictureInPicture = false;
    }

    async function enterPiP() {
        if (!video) return;

        try {
            if (video.paused) await video.play();

            // Firefox Android cần fullscreen trước
            if (!document.fullscreenElement && video.requestFullscreen) {
                await video.requestFullscreen();
            }

            // Nếu Firefox hỗ trợ PiP thì gọi
            if (document.pictureInPictureEnabled &&
                !document.pictureInPictureElement &&
                video.requestPictureInPicture) {

                await video.requestPictureInPicture();
            }

        } catch {}
    }

    // ===== Auto PiP khi rời tab =====
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            enterPiP();
        }
    });

    // ===== Chống YouTube pause video =====
    function antiPause(v) {
        if (!v || v.dataset.antiPause) return;

        v.dataset.antiPause = "true";

        v.addEventListener("pause", () => {
            if (document.hidden) {
                setTimeout(() => v.play().catch(()=>{}), 200);
            }
        });
    }

    // ===== Watch video load động (YouTube SPA) =====
    setInterval(() => {
        getVideo();
        antiPause(video);
    }, 1500);

})();
