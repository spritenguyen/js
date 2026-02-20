// ==UserScript==
// @name         Yandex Image Search (Android Optimized)
// @namespace    spritenguyen.mobile.yandex
// @version      3.0.1
// @description  Long-press image to search on Yandex (lightweight)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let timer = null;
    const LONG_PRESS_DURATION = 600;

    function searchImage(img) {
        const src = img.currentSrc || img.src;
        if (!src) return;

        const url = 'https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(src);
        window.open(url, '_blank');
    }

    window.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;

        const target = e.target.closest('img');
        if (!target) return;

        timer = setTimeout(() => {
            searchImage(target);
        }, LONG_PRESS_DURATION);

    }, { passive: true });

    window.addEventListener('touchend', function () {
        clearTimeout(timer);
    }, { passive: true });

})();
