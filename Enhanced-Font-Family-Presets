// ==UserScript==
// @name         Tùy chỉnh font + nhiều selector + UI nổi khối + xuất/nhập cấu hình
// @namespace    
// @version      2.1
// @description  Tùy chỉnh font, màu, nền, viền, tên font; lưu nhiều rule theo selector cho từng domain; UI nổi khối; quản lý bật/tắt/sửa/xóa; xuất/nhập cấu hình JSON (copy/paste, file)
// @author       
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const domain = location.hostname;
  const storageKey = `fontStyle_${domain}`;

  // -----------------------------
  // State & storage
  // -----------------------------
  let loadedFonts = new Set();
  let currentEditingSelector = null;

  // Cấu trúc lưu:
  // {
  //   rules: { "p": { selector:"p", enabled:true, ... }, ... },
  //   order: ["p","a"]
  // }
  function getDefaultStore() {
    return { rules: {}, order: [] };
  }

  function loadStore() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return getDefaultStore();
    try {
      const data = JSON.parse(raw);

      // Migration từ bản cũ (1 rule)
      if (data && data.selector) {
        const store = getDefaultStore();
        const key = (data.selector || '').trim();
        if (key) {
          data.enabled = true;
          store.rules[key] = data;
          store.order.push(key);
        }
        saveStore(store);
        return store;
      }

      if (!data || typeof data !== 'object') return getDefaultStore();
      if (!data.rules || typeof data.rules !== 'object') data.rules = {};
      if (!Array.isArray(data.order)) data.order = Object.keys(data.rules);
      return data;
    } catch {
      return getDefaultStore();
    }
  }

  function saveStore(store) {
    localStorage.setItem(storageKey, JSON.stringify(store));
    updateExportField();
  }

  let store = loadStore();

  // -----------------------------
  // Style management
  // -----------------------------
  const STYLE_ID = 'font-tool-styles-' + domain.replace(/[^a-z0-9-_.]/gi, '_');
  function ensureStyleEl() {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    return el;
  }

  function fontLinkHref(fontName) {
    const normalized = fontName.trim();
    return `https://fonts.googleapis.com/css2?family=${normalized.replace(/ /g, '+')}&display=swap`;
  }

  function loadGoogleFont(fontName) {
    if (!fontName) return;
    const normalized = fontName.trim();
    if (!normalized) return;

    const href = fontLinkHref(normalized);
    // Tránh nhân bản thẻ link
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(l => l.href === href)) return;

    if (loadedFonts.has(normalized.toLowerCase())) return;
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    loadedFonts.add(normalized.toLowerCase());
  }

  function ruleToCSS(rule) {
    if (!rule.selector || !rule.enabled) return '';
    const parts = [];

    if (rule.enableFontSize && rule.fontSize) {
      parts.push(`font-size:${Number(rule.fontSize)}px !important;`);
    }
    if (rule.enableFontColor && rule.fontColor) {
      parts.push(`color:${rule.fontColor} !important;`);
    }
    if (rule.enableBgColor && rule.bgColor) {
      parts.push(`background-color:${rule.bgColor} !important;`);
    }
    if (rule.enableFontName && rule.fontName) {
      parts.push(`font-family:'${rule.fontName}',sans-serif !important;`);
      loadGoogleFont(rule.fontName);
    }
    if (rule.enableTextStroke && rule.textStroke) {
      parts.push(`-webkit-text-stroke:${rule.textStroke} !important;`);
    }

    if (parts.length === 0) return '';
    return `${rule.selector} { ${parts.join(' ')} }`;
  }

  function rebuildStyles() {
    const cssChunks = [];
    for (const sel of store.order) {
      const r = store.rules[sel];
      if (!r) continue;
      const css = ruleToCSS(r);
      if (css) cssChunks.push(css);
    }
    ensureStyleEl().textContent = cssChunks.join('\n');
  }

  // -----------------------------
  // UI
  // -----------------------------
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🎨 Font Tool';
  toggleBtn.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 2147483647;
    background: linear-gradient(135deg, #0a84ff, #0078d4);
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 10px 20px rgba(0,120,212,0.3), 0 3px 6px rgba(0,0,0,0.15);
    transition: transform .08s ease;
  `;
  toggleBtn.onmousedown = () => (toggleBtn.style.transform = 'scale(0.98)');
  toggleBtn.onmouseup = () => (toggleBtn.style.transform = 'scale(1)');
  document.body.appendChild(toggleBtn);

  const panel = document.createElement('div');
  panel.style = `
    position: fixed;
    top: 56px;
    right: 10px;
    z-index: 2147483647;
    width: 340px;
    max-height: 78vh;
    overflow: hidden;
    background: #f7f9fc;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
    display: none;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  `;
  panel.innerHTML = `
    <div style="padding: 14px 14px 8px; background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%); border-bottom: 1px solid rgba(0,0,0,0.06); border-top-left-radius:16px;border-top-right-radius:16px;">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <h3 style="margin:0; font-size:16px; font-weight:700; color:#111827;">Tùy chỉnh font</h3>
        <button id="closePanel" title="Đóng" style="border:none;background:transparent;font-size:18px;cursor:pointer;color:#6b7280;">✕</button>
      </div>
    </div>

    <div style="padding: 12px; overflow-y: auto; max-height: calc(78vh - 52px);">
      <div style="background:#fff;border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:12px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
        <label style="font-weight:600; color:#111827;">Phần tử (p, .class, #id)</label>
        <input type="text" id="selector" placeholder="VD: p, a, .content, #title" style="width:100%; margin-top:6px; margin-bottom:10px; padding:8px 10px; border-radius:10px; border:1px solid #e5e7eb; outline:none; box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);" />

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="enableFontSize" />
              <span style="font-weight:600;">Cỡ chữ (px)</span>
            </label>
            <input type="number" id="fontsize" value="16" min="1" style="width:100%; margin-top:6px; padding:6px 8px; border-radius:8px; border:1px solid #e5e7eb;" />
          </div>

          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="enableFontColor" />
              <span style="font-weight:600;">Màu chữ</span>
            </label>
            <input type="color" id="fontcolor" value="#111111" style="width:100%; margin-top:6px; height:34px; border-radius:8px; border:1px solid #e5e7eb; padding:0;" />
          </div>

          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="enableBgColor" />
              <span style="font-weight:600;">Nền chữ</span>
            </label>
            <input type="color" id="bgcolor" value="#ffffff" style="width:100%; margin-top:6px; height:34px; border-radius:8px; border:1px solid #e5e7eb; padding:0;" />
          </div>

          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="enableTextStroke" />
              <span style="font-weight:600;">Viền chữ</span>
            </label>
            <input type="text" id="textstroke" placeholder="VD: 1px black" style="width:100%; margin-top:6px; padding:6px 8px; border-radius:8px; border:1px solid #e5e7eb;" />
          </div>

          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="enableFontName" />
              <span style="font-weight:600;">Tên font (Google)</span>
            </label>
            <input type="text" id="fontname" placeholder="VD: Roboto" style="width:100%; margin-top:6px; padding:6px 8px; border-radius:8px; border:1px solid #e5e7eb;" />
          </div>

          <div style="background:#f9fafb;border:1px solid #eef2f7; border-radius:10px; padding:8px;">
            <label style="display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="ruleEnabled" checked />
              <span style="font-weight:600;">Bật rule này</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px; margin-top:8px;">
              <input type="checkbox" id="saveDomain" checked />
              <span style="font-weight:600;">Lưu cho tên miền</span>
            </label>
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:12px;">
          <button id="applyStyle" style="flex:1; background:#111827; color:#fff; border:none; padding:10px; border-radius:10px; cursor:pointer; font-weight:700;">Áp dụng / Cập nhật</button>
          <button id="resetForm" style="background:#f3f4f6; color:#111827; border:1px solid #e5e7eb; padding:10px 12px; border-radius:10px; cursor:pointer;">Mới</button>
        </div>
      </div>

      <div style="margin-top:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <h4 style="margin:0; font-size:14px; font-weight:700; color:#111827;">Rule đã lưu</h4>
          <button id="clearAll" style="background:#fff; border:1px solid #ef4444; color:#ef4444; padding:6px 10px; border-radius:10px; cursor:pointer;">Xóa tất cả</button>
        </div>
        <div id="rulesList" style="display:flex; flex-direction:column; gap:8px;"></div>
      </div>

      <div style="margin-top:14px; background:#fff;border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:12px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
        <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:700; color:#111827;">Xuất / Nhập cấu hình</h4>

        <label style="font-weight:600; color:#111827; font-size:12px;">Cấu hình (JSON)</label>
        <textarea id="exportConfig" readonly style="width:100%;height:90px;border:1px solid #e5e7eb;border-radius:8px;padding:8px;margin-top:6px;font-size:12px;background:#f9fafb;"></textarea>

        <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
          <button id="copyConfig" style="background:#111827;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:600;">📋 Sao chép</button>
          <button id="downloadConfig" style="background:#0ea5e9;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:600;">💾 Tải xuống</button>

          <input id="importFile" type="file" accept="application/json,.json" style="display:none;" />
          <button id="chooseFile" style="background:#10b981;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:600;">📥 Nhập từ file</button>
        </div>

        <textarea id="importConfig" placeholder="Dán cấu hình JSON tại đây..." style="width:100%;height:90px;border:1px solid #e5e7eb;border-radius:8px;padding:8px;margin-top:10px;font-size:12px;background:#fff;"></textarea>
        <button id="loadConfig" style="margin-top:8px;background:#16a34a;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:700;width:100%;">Nhập cấu hình (Paste)</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const $ = (sel) => panel.querySelector(sel);

  function renderRulesList() {
    const list = $('#rulesList');
    list.innerHTML = '';
    if (store.order.length === 0) {
      list.innerHTML = `<div style="color:#6b7280; font-size:13px;">Chưa có rule nào. Hãy tạo ở trên.</div>`;
      return;
    }

    for (const sel of store.order) {
      const r = store.rules[sel];
      if (!r) continue;

      const item = document.createElement('div');
      item.style.cssText = `
        background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:10px;
        display:flex; align-items:center; justify-content:space-between;
        box-shadow: 0 8px 16px rgba(0,0,0,0.08);
      `;
      item.innerHTML = `
        <div style="min-width:0; flex:1;">
          <div style="font-weight:700; color:#111827; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${sel}
          </div>
          <div style="font-size:12px; color:#6b7280; margin-top:2px;">
            ${[
              r.enableFontSize ? `size ${r.fontSize}px` : null,
              r.enableFontColor ? `màu ${r.fontColor}` : null,
              r.enableBgColor ? `nền ${r.bgColor}` : null,
              r.enableTextStroke ? `viền ${r.textStroke}` : null,
              r.enableFontName ? `font ${r.fontName}` : null,
            ].filter(Boolean).join(' • ') || 'Không có thuộc tính'}
          </div>
        </div>
        <div style="display:flex; gap:6px; margin-left:8px; flex-shrink:0; align-items:center;">
          <label title="Bật/Tắt" style="display:flex; align-items:center; gap:6px; font-size:12px; color:#111827; background:#f9fafb; border:1px solid #e5e7eb; padding:6px 8px; border-radius:8px; cursor:pointer;">
            <input type="checkbox" class="toggleRule" data-selector="${sel}" ${r.enabled ? 'checked' : ''} />
            <span>${r.enabled ? 'Bật' : 'Tắt'}</span>
          </label>
          <button data-action="edit" data-selector="${sel}" title="Sửa"
            style="background:#111827;color:#fff;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:12px;">Sửa</button>
          <button data-action="delete" data-selector="${sel}" title="Xóa"
            style="background:#fff;color:#ef4444;border:1px solid #ef4444;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:12px;">Xóa</button>
        </div>
      `;
      list.appendChild(item);
    }
  }

  function fillFormFromRule(r) {
    $('#selector').value = r.selector || '';
    $('#fontsize').value = r.fontSize || 16;
    $('#fontcolor').value = r.fontColor || '#111111';
    $('#bgcolor').value = r.bgColor || '#ffffff';
    $('#textstroke').value = r.textStroke || '';
    $('#fontname').value = r.fontName || '';

    $('#enableFontSize').checked = !!r.enableFontSize;
    $('#enableFontColor').checked = !!r.enableFontColor;
    $('#enableBgColor').checked = !!r.enableBgColor;
    $('#enableTextStroke').checked = !!r.enableTextStroke;
    $('#enableFontName').checked = !!r.enableFontName;
    $('#ruleEnabled').checked = r.enabled !== false;
  }

  function clearForm() {
    currentEditingSelector = null;
    $('#selector').value = '';
    $('#fontsize').value = 16;
    $('#fontcolor').value = '#111111';
    $('#bgcolor').value = '#ffffff';
    $('#textstroke').value = '';
    $('#fontname').value = '';

    $('#enableFontSize').checked = false;
    $('#enableFontColor').checked = false;
    $('#enableBgColor').checked = false;
    $('#enableTextStroke').checked = false;
    $('#enableFontName').checked = false;
    $('#ruleEnabled').checked = true;
  }

  function updateExportField() {
    const exportArea = $('#exportConfig');
    if (exportArea) {
      exportArea.value = JSON.stringify(store, null, 2);
    }
  }

  toggleBtn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });
  $('#closePanel').addEventListener('click', () => {
    panel.style.display = 'none';
  });

  // Khởi tạo từ store
  function initFromStore() {
    rebuildStyles();
    renderRulesList();
    updateExportField();
  }
  initFromStore();

  // -----------------------------
  // Actions
  // -----------------------------
  $('#applyStyle').addEventListener('click', () => {
    const selector = $('#selector').value.trim();
    if (!selector) {
      alert('Vui lòng nhập selector (vd: p, a, .class, #id)');
      return;
    }

    const newRule = {
      selector,
      enabled: $('#ruleEnabled').checked,
      enableFontSize: $('#enableFontSize').checked,
      fontSize: Number($('#fontsize').value.trim() || 16),
      enableFontColor: $('#enableFontColor').checked,
      fontColor: $('#fontcolor').value.trim(),
      enableBgColor: $('#enableBgColor').checked,
      bgColor: $('#bgcolor').value.trim(),
      enableTextStroke: $('#enableTextStroke').checked,
      textStroke: $('#textstroke').value.trim(),
      enableFontName: $('#enableFontName').checked,
      fontName: $('#fontname').value.trim(),
    };

    const existing = store.rules[selector];
    const isEditingRename = currentEditingSelector && currentEditingSelector !== selector;

    if (!existing && !store.order.includes(selector)) {
      store.order.push(selector);
    }

    if (isEditingRename && store.rules[currentEditingSelector]) {
      delete store.rules[currentEditingSelector];
      store.order = store.order.filter(s => s !== currentEditingSelector);
      if (!store.order.includes(selector)) store.order.push(selector);
    }

    store.rules[selector] = newRule;

    rebuildStyles();
    renderRulesList();

    if ($('#saveDomain').checked) {
      saveStore(store);
    } else {
      updateExportField();
    }

    currentEditingSelector = selector;
  });

  $('#resetForm').addEventListener('click', () => {
    clearForm();
  });

  $('#clearAll').addEventListener('click', () => {
    if (!confirm('Xóa tất cả rule của tên miền này?')) return;
    store = getDefaultStore();
    saveStore(store);
    rebuildStyles();
    renderRulesList();
    clearForm();
  });

  // Edit/Delete buttons
  $('#rulesList').addEventListener('click', (e) => {
    const target = e.target;
    const action = target.getAttribute('data-action');
    if (!action) return;

    const sel = target.getAttribute('data-selector');
    if (!sel) return;

    if (action === 'edit') {
      const r = store.rules[sel];
      if (!r) return;
      currentEditingSelector = sel;
      fillFormFromRule(r);
      panel.style.display = 'block';
      return;
    }

    if (action === 'delete') {
      if (!confirm(`Xóa rule "${sel}"?`)) return;
      delete store.rules[sel];
      store.order = store.order.filter(s => s !== sel);
      saveStore(store);
      rebuildStyles();
      renderRulesList();
      if (currentEditingSelector === sel) clearForm();
      return;
    }
  });

  // Toggle checkbox (change event để không lật 2 lần)
  $('#rulesList').addEventListener('change', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement)) return;
    if (!el.classList.contains('toggleRule')) return;
    const sel = el.getAttribute('data-selector');
    const r = sel && store.rules[sel];
    if (!r) return;
    r.enabled = !!el.checked;
    saveStore(store);
    rebuildStyles();
    renderRulesList();
  });

  // -----------------------------
  // Export / Import
  // -----------------------------
  $('#copyConfig').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#exportConfig').value);
      alert('Đã sao chép cấu hình vào clipboard!');
    } catch {
      // Fallback
      $('#exportConfig').select();
      document.execCommand('copy');
      alert('Đã sao chép cấu hình (fallback).');
    }
  });

  $('#downloadConfig').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    const stamp = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    a.download = `font_tool_config_${domain}_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  $('#chooseFile').addEventListener('click', () => {
    $('#importFile').click();
  });

  $('#importFile').addEventListener('change', () => {
    const file = $('#importFile').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        validateAndApplyImport(obj);
      } catch {
        alert('File cấu hình không hợp lệ.');
      }
      $('#importFile').value = '';
    };
    reader.readAsText(file, 'utf-8');
  });

  $('#loadConfig').addEventListener('click', () => {
    const raw = $('#importConfig').value.trim();
    if (!raw) return alert('Vui lòng dán dữ liệu JSON cấu hình.');
    try {
      const obj = JSON.parse(raw);
      validateAndApplyImport(obj);
    } catch {
      alert('Cấu hình không hợp lệ.');
    }
  });

  function validateAndApplyImport(obj) {
    // Kiểm tra tối thiểu
    if (!obj || typeof obj !== 'object' || !obj.rules || !obj.order) {
      return alert('Cấu hình không đúng định dạng.');
    }
    // Rà soát quy tắc
    const safeStore = getDefaultStore();
    const seen = new Set();

    for (const sel of Array.isArray(obj.order) ? obj.order : Object.keys(obj.rules)) {
      const r = obj.rules[sel];
      if (!r || typeof r !== 'object') continue;
      const selector = (r.selector || sel || '').trim();
      if (!selector || seen.has(selector)) continue;

      safeStore.rules[selector] = {
        selector,
        enabled: r.enabled !== false,
        enableFontSize: !!r.enableFontSize,
        fontSize: Number(r.fontSize || 16),
        enableFontColor: !!r.enableFontColor,
        fontColor: r.fontColor || '#111111',
        enableBgColor: !!r.enableBgColor,
        bgColor: r.bgColor || '#ffffff',
        enableTextStroke: !!r.enableTextStroke,
        textStroke: r.textStroke || '',
        enableFontName: !!r.enableFontName,
        fontName: r.fontName || '',
      };
      safeStore.order.push(selector);
      seen.add(selector);
    }

    // Nếu không có rule hợp lệ
    if (safeStore.order.length === 0) {
      return alert('Không có rule hợp lệ trong cấu hình.');
    }

    // Áp dụng
    store = safeStore;
    saveStore(store);
    rebuildStyles();
    renderRulesList();
    clearForm();
    alert('Đã nhập cấu hình thành công!');
  }

  // Rebuild khi DOM sẵn sàng (phòng trường hợp head chưa sẵn)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rebuildStyles, { once: true });
  }
})();
