// ==UserScript==
// @name         Domain-Based Web Editor Panel v1.5
// @namespace    https://github.com/spritenguyen
// @version      1.5
// @description  thay doi css website
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const domainKey = `web_editor_${location.hostname}`;

  // --- Styles ---
  const styles = `
    #webEditorPanel {
      position: fixed !important;
      top: 50px !important;
      right: 0 !important;
      width: 360px !important;
      height: 580px !important;
      background: #fefefe !important;
      border: 1px solid #aaa !important;
      font-family: Arial, sans-serif !important;
      font-size: 13px !important;
      z-index: 999999 !important;
      box-shadow: 0 0 8px rgba(0,0,0,0.2) !important;
      display: flex !important;
      flex-direction: column !important;
      transition: width .2s, height .2s !important;
    }
    #webEditorPanel.collapsed {
      width: 200px !important;
      height: 36px !important;
    }
    #webEditorPanel .section {
      padding: 8px !important;
      flex: 1 !important;
      overflow: auto !important;
      display: block !important;
    }
    #webEditorPanel.collapsed .section {
      display: none !important;
    }
    #webEditorPanel header {
      background: #eee !important;
      padding: 6px 10px !important;
      font-weight: bold !important;
      border-bottom: 1px solid #ccc !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      cursor: pointer !important;
    }
    #webEditorPanel textarea {
      width: 100% !important;
      box-sizing: border-box !important;
      resize: none !important;
      font-family: monospace !important;
      padding: 4px !important;
    }
    #webEditorPanel button {
      margin-top: 6px !important;
      padding: 4px 8px !important;
      font-size: 12px !important;
      cursor: pointer !important;
    }
    #webEditorPanel .list-item {
      border-top: 1px solid #ddd !important;
      padding: 6px 0 !important;
      display: flex !important;
      align-items: center !important;
    }
    #webEditorPanel .list-item span {
      font-weight: bold !important;
      margin-left: 6px !important;
      flex: 1 !important;
    }
    #webEditorPanel .list-item button {
      margin-left: 6px !important;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // --- Tạo panel ---
  const panel = document.createElement('div');
  panel.id = 'webEditorPanel';
  panel.innerHTML = `
    <header>
      <span>🛠 Web Editor Panel</span>
      <button id="toggleBtn">–</button>
    </header>
    <div class="section">
      <label>Selector (CSS):</label>
      <textarea id="selectorInput" rows="2" placeholder=".myClass, #myId"></textarea>
      <label>Code (JS/CSS/HTML):</label>
      <textarea id="codeInput" rows="5" placeholder="/* CSS: .myClass { color: red; } */"></textarea>
      <button id="applyBtn">Áp dụng</button>
    </div>
    <div class="section">
      <label>📋 Danh sách thay đổi:</label>
      <div id="changeList"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // --- UI references ---
  const toggleBtn     = panel.querySelector('#toggleBtn');
  const selectorInput = panel.querySelector('#selectorInput');
  const codeInput     = panel.querySelector('#codeInput');
  const applyBtn      = panel.querySelector('#applyBtn');
  const changeList    = panel.querySelector('#changeList');

  // --- Load / Save ---
  function loadChanges() {
    return JSON.parse(localStorage.getItem(domainKey) || '[]');
  }
  function saveChanges(data) {
    localStorage.setItem(domainKey, JSON.stringify(data));
  }

  // --- Chạy 1 change (CSS/JS) với index để quản style tag ---
  function runChange(item, idx) {
    const { selector, code } = item;
    const sels = selector.split(',').map(s => s.trim()).filter(Boolean);
    const isCSS = /\/\*\s*CSS:/.test(code);
    if (isCSS) {
      const styleId = `web-editor-style-${idx}`;
      let st = document.getElementById(styleId);
      if (!st) {
        st = document.createElement('style');
        st.id = styleId;
        document.head.appendChild(st);
      }
      const css = code.replace(/\/\*\s*CSS:\s*([\s\S]*?)\s*\*\//, '$1');
      st.textContent = css;
    } else {
      sels.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          try {
            new Function('el', code)(el);
          } catch (e) {
            console.error('WebEditor JS error:', e);
          }
        });
      });
    }
  }

  // --- Áp dụng toàn bộ changes được bật ---
  function applyStored() {
    loadChanges().forEach((item, idx) => {
      if (item.enabled) runChange(item, idx);
    });
  }

  // --- Thêm / Cập nhật change mới ---
  function applyChange(selector, code, idx = null) {
    const data = loadChanges();
    if (idx !== null) {
      data[idx].selector = selector;
      data[idx].code = code;
      // giữ nguyên enabled
    } else {
      data.push({ selector, code, enabled: true });
      idx = data.length - 1;
    }
    saveChanges(data);
    runChange(data[idx], idx);
    renderList();
  }

  // --- Vẽ list kèm checkbox ---
  function renderList() {
    const data = loadChanges();
    changeList.innerHTML = '';
    data.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `
        <input type="checkbox" data-toggle="${i}" ${item.enabled ? 'checked' : ''}/>
        <span>${i+1}. ${item.selector}</span>
        <button data-edit="${i}">Sửa</button>
        <button data-delete="${i}">Xóa</button>
      `;
      changeList.appendChild(div);
    });
  }

  // --- Toggle panel kích thước ---
  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    toggleBtn.textContent = panel.classList.contains('collapsed') ? '+' : '–';
  });

  // --- Event apply nút chính ---
  applyBtn.addEventListener('click', () => {
    const sel  = selectorInput.value.trim();
    const code = codeInput.value.trim();
    if (!sel || !code) return;
    const data = loadChanges();
    const idx  = data.findIndex(d => d.selector === sel);
    applyChange(sel, code, idx >= 0 ? idx : null);
  });

  // --- Event sửa / xóa và toggle bật tắt ngay ---
  changeList.addEventListener('click', e => {
    const editIdx   = e.target.getAttribute('data-edit');
    const deleteIdx = e.target.getAttribute('data-delete');
    if (editIdx != null) {
      const item = loadChanges()[editIdx];
      selectorInput.value = item.selector;
      codeInput.value     = item.code;
    }
    if (deleteIdx != null) {
      const d = loadChanges();
      // xóa style tag nếu CSS
      const styleNode = document.getElementById(`web-editor-style-${deleteIdx}`);
      if (styleNode) styleNode.remove();
      d.splice(deleteIdx, 1);
      // phải re-id lại các style tags còn lại
      d.forEach((_, i) => {
        const old = document.getElementById(`web-editor-style-${i+1}`);
        if (old) old.id = `web-editor-style-${i}`;
      });
      saveChanges(d);
      renderList();
    }
  });

  changeList.addEventListener('change', e => {
    const toggleIdx = e.target.getAttribute('data-toggle');
    if (toggleIdx != null) {
      const d = loadChanges();
      d[toggleIdx].enabled = e.target.checked;
      saveChanges(d);
      // bật thì apply ngay, tắt thì remove style nếu CSS
      const item = d[toggleIdx];
      if (item.enabled) {
        runChange(item, toggleIdx);
      } else {
        const st = document.getElementById(`web-editor-style-${toggleIdx}`);
        if (st) st.remove();
        // lưu ý: các JS thay đổi DOM đã apply sẽ không tự rollback được
      }
    }
  });

  // --- Khởi chạy ---
  applyStored();
  renderList();

})();
