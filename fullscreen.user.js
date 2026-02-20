// ==UserScript==
// @name         Safe Universal Fullscreen Toggle
// @namespace    spritenguyen.safe.fullscreen
// @version      1.1.1
// @description  Minimal fullscreen toggle without DOM injection
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const docEl = document.documentElement;

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    /* ===== Desktop: Ctrl + Shift + F ===== */
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            toggleFullscreen();
        }
    }, { passive: true });

    /* ===== Mobile: 3-finger tap ===== */
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 3) {
            toggleFullscreen();
        }
    }, { passive: true });

})();
