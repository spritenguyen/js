// ==UserScript==
// @name        Yandex Image Search (Touch + Desktop)
// @namespace   spritenguyen.mobile.yandex
// @version     3.1.0
// @description Long-press (touch) or right-click/ctrl+click to search image on Yandex
// @match       *://*/*
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  let timer = null;
  const LONG_PRESS = 600; // ms

  function openSearch(img) {
    const src = img.currentSrc || img.src;
    if (!src) return;
    const yurl = 'https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(src);
    window.open(yurl, '_blank');
  }

  // Cancel timer and reset
  function cancel() {
    clearTimeout(timer);
    timer = null;
  }

  // Pointer down (mouse/touch/stylus)
  window.addEventListener('pointerdown', function (e) {
    const img = e.target.closest('img');
    if (!img) return;

    // Long press only: start timer
    timer = setTimeout(() => {
      openSearch(img);
      cancel();
    }, LONG_PRESS);

  }, { passive: true });

  window.addEventListener('pointerup', cancel, { passive: true });
  window.addEventListener('pointermove', cancel, { passive: true });
  window.addEventListener('pointercancel', cancel, { passive: true });

  // Fallback: right click or ctrl+click (desktop)
  window.addEventListener('click', function (e) {
    if (e.button === 2 || e.ctrlKey) {
      const img = e.target.closest('img');
      if (img) openSearch(img);
    }
  });

})();
