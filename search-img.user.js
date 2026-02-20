// ==UserScript==
// @name         Mobile Reverse Image Search (Multi Engine)
// @namespace    spritenguyen.mobile.reverse
// @version      3.0
// @description  Long-press image to search (Yandex / Google Lens / Bing)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let timer = null;
    let stage = 0;
    const imgMinSize = 200;

    function vibrate(ms) {
        if (navigator.vibrate) navigator.vibrate(ms);
    }

    function openSearch(engine, src) {
        let url = '';

        switch (engine) {
            case 1:
                url = 'https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(src);
                break;
            case 2:
                url = 'https://lens.google.com/uploadbyurl?url=' + encodeURIComponent(src);
                break;
            case 3:
                url = 'https://www.bing.com/images/search?q=imgurl:' + encodeURIComponent(src) + '&view=detailv2&iss=sbi';
                break;
        }

        window.open(url, '_blank');
    }

    window.addEventListener('touchstart', function (e) {

        if (e.touches.length !== 1) return;

        const img = e.target.closest('img');
        if (!img) return;

        if (img.naturalWidth < imgMinSize) return;

        const src = img.currentSrc || img.src;
        if (!src) return;

        stage = 0;

        timer = setTimeout(() => {
            stage = 1;
            vibrate(10); // Yandex
        }, 600);

        timer = setTimeout(() => {
            stage = 2;
            vibrate(20); // Google
        }, 1200);

        timer = setTimeout(() => {
            stage = 3;
            vibrate(30); // Bing
        }, 1800);

        img.dataset.searchSrc = src;

    }, { passive: true });

    window.addEventListener('touchend', function (e) {

        const img = e.target.closest('img');
        if (!img) return;

        clearTimeout(timer);

        if (!stage) return;

        openSearch(stage, img.dataset.searchSrc);

        stage = 0;

    }, { passive: true });

})();
