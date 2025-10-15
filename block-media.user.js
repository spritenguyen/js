// ==UserScript==
// @name         Chặn âm thanh & autoplay toàn trang
// @namespace    
// @version      1.2
// @description  Tự động chặn âm thanh: mute audio/video, ngăn autoplay & WebAudio, và chặn play() khi chưa tương tác.
// @author       NDB
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Cấu hình nhanh
  const config = {
    // Chỉ cho phép phát sau tương tác người dùng
    requireUserGestureToPlay: true,
    // Mute mặc định mọi media
    defaultMute: true,
    // Ngăn autoplay thuộc tính
    blockAutoplayAttr: true,
    // Vô hiệu WebAudio
    blockWebAudio: true,
    // Ngoại lệ theo hostname (không chặn trên các trang này)
    allowList: [
      // 'youtube.com',
      // 'music.yandex.ru'
    ]
  };

  const host = location.hostname.replace(/^www\./, '');
  if (config.allowList.some(h => host.endsWith(h))) return;

  // Đánh dấu khi có tương tác người dùng
  let userInteracted = false;
  const userEvents = ['click', 'keydown', 'pointerdown', 'touchstart'];
  userEvents.forEach(ev => {
    window.addEventListener(ev, () => { userInteracted = true; }, { once: true, capture: true });
  });

  // Helper: an toàn gọi phương thức
  const safe = fn => {
    try { return fn(); } catch (e) { /* noop */ }
  };

  // 1) Chặn autoplay qua thuộc tính
  const neuterAutoplay = (el) => {
    if (!el || !(el instanceof HTMLMediaElement)) return;
    if (config.blockAutoplayAttr) {
      safe(() => el.autoplay = false);
      safe(() => el.removeAttribute('autoplay'));
      safe(() => el.preload = 'metadata'); // giảm tải trước
    }
  };

  // 2) Mute & chuẩn hóa media ngay khi xuất hiện
  const silenceMedia = (el) => {
    if (!el || !(el instanceof HTMLMediaElement)) return;
    if (config.defaultMute) safe(() => el.muted = true);
    safe(() => el.volume = 0);
    // Nếu đang phát, dừng lại ngay
    if (!userInteracted && !el.paused) safe(() => el.pause());
  };

  // 3) Chặn play() trước khi có tương tác
  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(...args) {
    // Cho phép nếu user đã tương tác hoặc element do user tương tác trực tiếp
    if (config.requireUserGestureToPlay && !userInteracted) {
      // Vẫn mute để không bật tiếng bất ngờ
      if (config.defaultMute) safe(() => this.muted = true);
      safe(() => this.volume = 0);
      // Ngăn phát, trả về Promise bị reject nhẹ
      return Promise.reject(new DOMException('Blocked autoplay until user gesture', 'NotAllowedError'));
    }
    // Khi đã có tương tác: vẫn giữ mute mặc định, người dùng có thể bật lại
    if (config.defaultMute) safe(() => this.muted = true);
    return origPlay.apply(this, args);
  };

  // 4) Chặn Web Audio API phát tiếng
  if (config.blockWebAudio && 'AudioContext' in window) {
    const wrapAudioContext = (BaseCtx, name) => {
      const Wrapped = function(...args) {
        const ctx = new BaseCtx(...args);
        // Giảm gain tổng thể về 0
        try {
          const masterGain = ctx.createGain();
          masterGain.gain.value = 0;
          const dest = ctx.destination;
          masterGain.connect(dest);

          // Proxy connect để route qua masterGain
          const origConnect = AudioNode.prototype.connect;
          AudioNode.prototype.connect = function(nodeOrCtx, ...rest) {
            // Nếu connect tới destination, đổi thành masterGain
            if (nodeOrCtx === ctx.destination) {
              return origConnect.call(this, masterGain, ...rest);
            }
            return origConnect.call(this, nodeOrCtx, ...rest);
          };
        } catch (e) { /* noop */ }

        // Ngăn resume trước tương tác
        const origResume = ctx.resume.bind(ctx);
        ctx.resume = async () => {
          if (!userInteracted) {
            throw new DOMException('Blocked audio resume until user gesture', 'NotAllowedError');
          }
          return origResume();
        };
        return ctx;
      };
      Wrapped.prototype = BaseCtx.prototype;
      Object.defineProperty(Wrapped, 'name', { value: name });
      return Wrapped;
    };

    try {
      window.AudioContext = wrapAudioContext(window.AudioContext, 'AudioContext');
    } catch (e) { /* noop */ }
    try {
      window.webkitAudioContext = wrapAudioContext(window.webkitAudioContext, 'webkitAudioContext');
    } catch (e) { /* noop */ }
  }

  // 5) Quan sát DOM để xử lý media mới thêm
  const processNode = (node) => {
    if (node instanceof HTMLMediaElement) {
      neuterAutoplay(node);
      silenceMedia(node);
    } else if (node && node.querySelectorAll) {
      node.querySelectorAll('video, audio').forEach(el => {
        neuterAutoplay(el);
        silenceMedia(el);
      });
    }
  };

  // Xử lý sẵn những phần tử hiện có
  document.addEventListener('DOMContentLoaded', () => processNode(document), { once: true });

  // MutationObserver
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes && m.addedNodes.forEach(processNode);
      if (m.target instanceof HTMLMediaElement) processNode(m.target);
    }
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: true });

  // 6) Chặn play inline HTML thuộc tính
  window.addEventListener('play', (ev) => {
    const el = ev.target;
    if (!(el instanceof HTMLMediaElement)) return;
    if (!userInteracted && config.requireUserGestureToPlay) {
      safe(() => el.pause());
      ev.stopPropagation();
    } else {
      if (config.defaultMute) safe(() => el.muted = true);
    }
  }, true);

  // 7) Nút nhanh để bật tiếng toàn trang (tùy chọn)
  const addToggle = () => {
    const btn = Object.assign(document.createElement('button'), {
      textContent: 'Bật tiếng (tạm thời)',
      style: `
        position: fixed; z-index: 999999; right: 12px; bottom: 12px;
        padding: 8px 10px; font: 12px/1.2 system-ui; color: #111;
        background: #ffd24c; border: 1px solid #cc9f1a; border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2); cursor: pointer;
      `
    });
    btn.addEventListener('click', () => {
      userInteracted = true;
      document.querySelectorAll('video, audio').forEach(el => {
        el.muted = false;
        el.volume = Math.min(el.volume || 1, 1);
      });
      alert('Đã cho phép phát âm thanh. Bạn có thể tắt tab hoặc tải lại để chặn lại.');
    });
    document.addEventListener('DOMContentLoaded', () => {
      document.body && document.body.appendChild(btn);
    });
  };
  addToggle();

})();
