// ==UserScript==
// @name        Yandex Image Search (Android Stable)
// @namespace   spritenguyen.mobile.yandex
// @version     3.2.0
// @description Long press image to search on Yandex (Android fixed)
// @match       *://*/*
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  let timer = null;
  const LONG_PRESS = 600;

  function openSearch(img) {
    const src = img.currentSrc || img.src;
    if (!src) return;

    const url = 'https://yandex.com/images/search?rpt=imageview&url=' 
                + encodeURIComponent(src);

    // dùng location thay vì window.open để tránh popup block
    location.href = url;
  }

  function cancel() {
    clearTimeout(timer);
    timer = null;
  }

  window.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;

    const img = e.target.closest('img');
    if (!img) return;

    timer = setTimeout(() => {
      openSearch(img);
      cancel();
    }, LONG_PRESS);

  }, { passive: false });

  window.addEventListener('touchend', cancel);
  window.addEventListener('touchmove', cancel);
  window.addEventListener('touchcancel', cancel);

})();
