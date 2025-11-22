// ==UserScript==
// @name        Send image to Yandex Images
// @match       *://*/*
// @grant       none
// ==/UserScript==

(function () {
  const BUTTON_CLASS = 'ys-send-to-yandex-btn';

  function makeButton(img) {
    if (img.dataset.ysButtonAdded) return;
    img.dataset.ysButtonAdded = '1';

    const btn = document.createElement('button');
    btn.className = BUTTON_CLASS;
    btn.textContent = 'Search on Yandex';
    Object.assign(btn.style, {
      position: 'absolute',
      zIndex: 2147483647,
      padding: '4px 8px',
      fontSize: '12px',
      cursor: 'pointer',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px'
    });

    function position() {
      const r = img.getBoundingClientRect();
      btn.style.left = (window.scrollX + r.left + 6) + 'px';
      btn.style.top = (window.scrollY + r.top + 6) + 'px';
      btn.style.display = (r.width > 0 && r.height > 0) ? 'block' : 'none';
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const imgUrl = img.currentSrc || img.src || img.getAttribute('data-src') || '';
      if (!imgUrl) return;

      const yandex = 'https://yandex.com/images/search?url=' + encodeURIComponent(imgUrl) + '&rpt=imageview';
      window.open(yandex, '_blank');
    });

    document.body.appendChild(btn);
    position();
    const ro = new ResizeObserver(position);
    ro.observe(img);
    window.addEventListener('scroll', position, {passive: true});
    window.addEventListener('resize', position);

    const mo = new MutationObserver(() => {
      if (!document.contains(img)) {
        btn.remove();
        ro.disconnect();
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement, {childList: true, subtree: true});
  }

  function scan() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.dataset.ysButtonAdded) {
        // chỉ áp dụng nếu ảnh có độ phân giải >= 300px
        if (img.naturalWidth >= 300 || img.naturalHeight >= 300) {
          img.addEventListener('mouseenter', () => makeButton(img), {once: true});
        }
      }
    });
  }

  scan();
  const bodyObserver = new MutationObserver(scan);
  bodyObserver.observe(document.documentElement, {childList: true, subtree: true});
})();
