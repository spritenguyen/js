// ==UserScript==
// @name         Stylus-lite per-domain CSS manager
// @namespace    
// @version      1.2.0
// @description  Quản lý CSS tùy chỉnh cho từng tên miền: gõ CSS, bật/tắt, sửa/xóa, áp dụng ngay, lưu bền; UI có thể ẩn/hiện.
// @match        *://*/*
// @run-at       document-end
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
  'use strict';

  // -------- Helpers: chờ body sẵn sàng --------
  function ready(fn) {
    if (document.body) return fn();
    const id = setInterval(() => {
      if (document.body) { clearInterval(id); fn(); }
    }, 50);
  }

  ready(init);

  function init() {
    // -------- Storage per-domain --------
    const DOMAIN = location.hostname;
    const STORAGE_KEY = 'stylusLiteStyles_' + DOMAIN;

    const storage = {
      get() {
        try {
          if (typeof GM_getValue === 'function') {
            const v = GM_getValue(STORAGE_KEY, []);
            return Array.isArray(v) ? v : [];
          }
        } catch(e) {}
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const v = raw ? JSON.parse(raw) : [];
          return Array.isArray(v) ? v : [];
        } catch(e) { return []; }
      },
      set(value) {
        try {
          if (typeof GM_setValue === 'function') {
            GM_setValue(STORAGE_KEY, value);
            return;
          }
        } catch(e) {}
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch(e) {}
      }
    };

    // -------- State --------
    let styles = storage.get(); // [{id,name,css,enabled}]
    let editingId = null;
    const styleElements = new Map();

    // -------- Utils --------
    function uid() {
      return 's' + Math.random().toString(36).slice(2, 9);
    }
    function applyStyle(item) {
      removeStyle(item.id);
      const el = document.createElement('style');
      el.type = 'text/css';
      el.textContent = item.css || '';
      el.setAttribute('data-stylus-lite-id', item.id);
      document.documentElement.appendChild(el);
      styleElements.set(item.id, el);
    }
    function removeStyle(id) {
      const el = styleElements.get(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
      styleElements.delete(id);
    }
    function reapplyEnabled() {
      styles.forEach(s => s.enabled ? applyStyle(s) : removeStyle(s.id));
    }
    function save() { storage.set(styles); }

    // -------- UI elements --------
    const panel = document.createElement('div');
    panel.id = 'stylus-lite-panel';
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'stylus-lite-toggle';

    panel.innerHTML = `
      <div class="sl-header">
        <div class="sl-title">CSS manager (${DOMAIN})</div>
        <div class="sl-actions">
          <button class="sl-hide" title="Ẩn">Ẩn</button>
        </div>
      </div>
      <div class="sl-body">
        <div class="sl-editor">
          <label class="sl-label">Tên thay đổi</label>
          <input type="text" class="sl-name" placeholder="Ví dụ: Ẩn quảng cáo, Tăng font...">
          <label class="sl-label">CSS</label>
          <textarea class="sl-css" placeholder="/* Dán hoặc gõ CSS tại đây */"></textarea>
          <div class="sl-buttons">
            <button class="sl-save">Lưu</button>
            <button class="sl-clear">Xóa nội dung ô CSS</button>
            <span class="sl-status"></span>
          </div>
        </div>
        <div class="sl-list">
          <div class="sl-list-header">
            <div class="sl-list-title">Danh sách thay đổi</div>
          </div>
          <div class="sl-items"></div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    document.body.appendChild(toggleBtn);
    panel.style.display = 'none';     // Ẩn panel khi khởi tạo
    toggleBtn.style.display = 'block';// Hiện nút toggle khi khởi tạo

    // -------- UI styles --------
    const uiCss = `
#stylus-lite-panel {
  position: fixed;
  top: 12px;
  right: 12px;
  width: 420px;
  max-height: 70vh;
  background: rgba(14,14,17,0.95);
  color: #eaeaf0;
  border: 1px solid #3a3a46;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  font: 13px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  z-index: 2147483647;
  display: none;
  flex-direction: column;
  backdrop-filter: blur(4px);
}
#stylus-lite-panel * { box-sizing: border-box; }
#stylus-lite-panel .sl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #2c2c36;
}
#stylus-lite-panel .sl-title { font-weight: 600; letter-spacing: 0.2px; }
#stylus-lite-panel .sl-actions button {
  background: #222230;
  border: 1px solid #3a3a46;
  color: #ddd;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
}
#stylus-lite-panel .sl-actions button:hover { background: #2a2a3a; }
#stylus-lite-panel .sl-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 10px;
  overflow: auto;
}
#stylus-lite-panel .sl-editor { display: grid; grid-template-columns: 1fr; gap: 6px; }
#stylus-lite-panel .sl-label { color: #b9b9c9; }
#stylus-lite-panel .sl-name {
  width: 100%; padding: 8px 10px; border-radius: 8px;
  border: 1px solid #3a3a46; background: #1a1a26; color: #ddd;
}
#stylus-lite-panel .sl-css {
  width: 100%; min-height: 140px; max-height: 45vh;
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid #3a3a46; background: #141420; color: #eaeaf0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  resize: vertical;
}
#stylus-lite-panel .sl-buttons { display: flex; align-items: center; gap: 8px; }
#stylus-lite-panel .sl-save {
  background: #3d7cff; border: 1px solid #2d6ae0; color: #fff;
  padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600;
}
#stylus-lite-panel .sl-save:hover { background: #306ef0; }
#stylus-lite-panel .sl-clear {
  background: #222230; border: 1px solid #3a3a46; color: #ddd;
  padding: 8px 12px; border-radius: 8px; cursor: pointer;
}
#stylus-lite-panel .sl-clear:hover { background: #2a2a3a; }
#stylus-lite-panel .sl-status { color: #8fd3ff; font-size: 12px; }
#stylus-lite-panel .sl-list { margin-top: 8px; border-top: 1px solid #2c2c36; padding-top: 8px; }
#stylus-lite-panel .sl-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
#stylus-lite-panel .sl-list-title { font-weight: 600; color: #cfd4ff; }
#stylus-lite-panel .sl-items { display: flex; flex-direction: column; gap: 6px; }
#stylus-lite-panel .sl-item {
  display: grid; grid-template-columns: auto 1fr auto auto;
  gap: 8px; align-items: center; padding: 6px 8px;
  background: #171727; border: 1px solid #2b2b3a; border-radius: 8px;
}
#stylus-lite-panel .sl-item .sl-enable { width: 18px; height: 18px; }
#stylus-lite-panel .sl-item .sl-name-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#stylus-lite-panel .sl-item button {
  background: #222230; border: 1px solid #3a3a46; color: #ddd;
  padding: 6px 10px; border-radius: 7px; cursor: pointer;
}
#stylus-lite-panel .sl-item button:hover { background: #2a2a3a; }
#stylus-lite-toggle {
  position: fixed; top: 12px; right: 12px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #3d7cff; border: 1px solid #2d6ae0;
  box-shadow: 0 0 0 2px rgba(61,124,255,0.25);
  display: block;
  z-index: 2147483647; cursor: pointer; display: none;
}
#stylus-lite-toggle:hover { background: #306ef0; }
    `;
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(uiCss);
    } else {
      const uiStyle = document.createElement('style');
      uiStyle.textContent = uiCss;
      document.documentElement.appendChild(uiStyle);
    }

    // -------- Bindings --------
    const $ = sel => panel.querySelector(sel);
    const nameInput = $('.sl-name');
    const cssTextarea = $('.sl-css');
    const saveBtn = $('.sl-save');
    const clearBtn = $('.sl-clear');
    const statusSpan = $('.sl-status');
    const hideBtn = panel.querySelector('.sl-hide');
    const listEl = panel.querySelector('.sl-items');

    function status(text) {
      statusSpan.textContent = text || '';
      if (text) setTimeout(() => { statusSpan.textContent = ''; }, 1500);
    }

    function renderList() {
      listEl.innerHTML = '';
      if (!styles.length) {
        const empty = document.createElement('div');
        empty.style.color = '#9aa0c3';
        empty.textContent = 'Chưa có thay đổi nào. Thêm CSS ở bên trên và bấm Lưu.';
        listEl.appendChild(empty);
        return;
      }
      styles.forEach(item => {
        const row = document.createElement('div');
        row.className = 'sl-item';

        const enable = document.createElement('input');
        enable.type = 'checkbox';
        enable.className = 'sl-enable';
        enable.checked = !!item.enabled;
        enable.title = 'Bật / tắt';
        enable.addEventListener('change', () => {
          item.enabled = enable.checked;
          if (item.enabled) applyStyle(item); else removeStyle(item.id);
          save();
        });

        const name = document.createElement('div');
        name.className = 'sl-name-text';
        name.textContent = item.name || '(không tên)';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.addEventListener('click', () => {
          editingId = item.id;
          nameInput.value = item.name || '';
          cssTextarea.value = item.css || '';
          status('Đang sửa…');
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Xóa';
        delBtn.addEventListener('click', () => {
          const idx = styles.findIndex(s => s.id === item.id);
          if (idx >= 0) {
            removeStyle(item.id);
            styles.splice(idx, 1);
            save();
            renderList();
            status('Đã xóa.');
          }
          if (editingId === item.id) {
            editingId = null;
            nameInput.value = '';
          }
        });

        row.appendChild(enable);
        row.appendChild(name);
        row.appendChild(editBtn);
        row.appendChild(delBtn);
        listEl.appendChild(row);
      });
    }

    saveBtn.addEventListener('click', () => {
      const name = (nameInput.value || '').trim();
      const css = cssTextarea.value || '';
      if (!css.trim()) { status('CSS trống.'); return; }

      if (editingId) {
        const item = styles.find(s => s.id === editingId);
        if (item) {
          item.name = name || item.name || 'Style';
          item.css = css;
          if (item.enabled) applyStyle(item);
          save();
          renderList();
          status('Đã cập nhật.');
        }
        editingId = null;
      } else {
        const item = { id: uid(), name: name || `Style ${styles.length + 1}`, css, enabled: true };
        styles.push(item);
        applyStyle(item);
        save();
        renderList();
        status('Đã thêm và áp dụng.');
      }
    });

    clearBtn.addEventListener('click', () => {
      cssTextarea.value = '';
      status('Đã xóa nội dung ô CSS.');
    });

    hideBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      toggleBtn.style.display = 'block';
    });

    toggleBtn.addEventListener('click', () => {
      panel.style.display = 'flex';
      toggleBtn.style.display = 'none';
    });

    // -------- Khởi tạo --------
    reapplyEnabled();
    renderList();

    // Menu command (tùy trình quản lý)
    try {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Hiện/Ẩn CSS Manager', () => {
          const hidden = panel.style.display === 'none';
          panel.style.display = hidden ? 'flex' : 'none';
          toggleBtn.style.display = hidden ? 'none' : 'block';
        });
      }
    } catch(e) {}
  }
})();
