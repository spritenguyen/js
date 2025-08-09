// ==UserScript==
// @name         Font Manager Simple UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  
// @author       
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
  'use strict';

  const KEY = 'fontSizes';
  const host = location.hostname;
  let db = GM_getValue(KEY, {});

  // Áp dụng font-size lên html/p/h1/h2/a
  function applyFontSize(size) {
    if (!size) return;
    const style = document.createElement('style');
    style.textContent = `
      html, body, p, h1, h2, a {
        font-size: ${size} !important;
        line-height: 1.4 !important;
      }
    `;
    document.head.appendChild(style);
  }
  if (db[host]) applyFontSize(db[host]);

  // Nút mở UI
  const btn = document.createElement('button');
  btn.textContent = '🅵 Font';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: '99999',
    padding: '8px 12px',
    background: '#007bff',
    color: '#fff',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  });
  document.body.appendChild(btn);

  // Panel UI
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '64px';
  panel.style.right = '16px';
  panel.style.zIndex = '99999';
  panel.style.padding = '16px';
  panel.style.background = '#f4f4f4';
  panel.style.border = '1px solid #ccc';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 4px 12px rgba(0,0,0,.3)';
  panel.style.font = '14px system-ui';
  panel.style.display = 'none';
  panel.style.minWidth = '300px';
  panel.innerHTML = `
    <strong>Quản lý cỡ chữ cho: <span style="color:#007bff">${host}</span></strong><br><br>
    <label>Nhập cỡ chữ cho trang hiện tại:</label><br>
    <input id="fs_input" type="text" placeholder="vd: 18px, 1.2em" style="width:100%;padding:6px;"><br>
    <button id="fs_save" style="margin-top:6px">💾 Lưu & áp dụng</button>
    <button id="fs_delete" style="margin-top:6px;margin-left:6px">❌ Xoá</button>
    <hr>
    <label>Thêm thủ công:</label><br>
    <input id="fs_host" type="text" placeholder="hostname (vd: vnexpress.net)" style="width:100%;padding:6px;margin-top:2px;"><br>
    <input id="fs_value" type="text" placeholder="cỡ chữ (vd: 17px)" style="width:100%;padding:6px;margin-top:6px;"><br>
    <button id="fs_add" style="margin-top:6px">➕ Thêm trang</button>
    <hr>
    <strong>Danh sách đã lưu:</strong><br>
    <ul id="fs_list" style="padding-left:18px"></ul>
  `;
  document.body.appendChild(panel);

  btn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    document.getElementById('fs_input').value = db[host] || '';
    renderList();
  });

  function normalizeSize(val) {
    const v = String(val).trim();
    return /^\d+(\.\d+)?$/.test(v) ? v + 'px' : v;
  }

  function renderList() {
    const ul = document.getElementById('fs_list');
    ul.innerHTML = '';
    Object.entries(db).forEach(([k,v]) => {
      const li = document.createElement('li');
      li.textContent = `${k}: ${v}`;
      ul.appendChild(li);
    });
  }

  document.getElementById('fs_save').onclick = () => {
    const val = normalizeSize(document.getElementById('fs_input').value);
    if (!val) return alert('Cỡ chữ không hợp lệ.');
    db[host] = val;
    GM_setValue(KEY, db);
    applyFontSize(val);
    renderList();
  };

  document.getElementById('fs_delete').onclick = () => {
    delete db[host];
    GM_setValue(KEY, db);
    location.reload();
  };

  document.getElementById('fs_add').onclick = () => {
    let h = document.getElementById('fs_host').value.trim();
    h = h.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]; // trích hostname
    const v = normalizeSize(document.getElementById('fs_value').value);
    if (!h || !v) return alert('Thông tin chưa hợp lệ.');
    db[h] = v;
    GM_setValue(KEY, db);
    renderList();
  };
})();

