// ==UserScript==

// @name         Yandex Image Search (Android Perfect)

// @namespace    spritenguyen.mobile.yandex

// @version      3.2.1

// @description  Long-press image to search on Yandex (stable, lightweight)

// @match        http*://*/*

// @grant        none

// @run-at       document-start

// ==/UserScript==

(function () {

  'use strict';

  const YANDEX = 'https://yandex.com/images/search?rpt=imageview&url=';

  document.addEventListener('contextmenu', function (e) {

    const img = e.target.closest('img');

    if (!img) return;

    const src = img.currentSrc || img.src;

    if (!src) return;

    // bỏ ảnh base64 nhỏ, blob rác

    if (src.startsWith('data:') || src.startsWith('blob:')) return;

    e.preventDefault();

    location.href = YANDEX + encodeURIComponent(src);

  }, true); // capture để vượt site chặn

})();
