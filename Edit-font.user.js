// ==UserScript==
// @name         Ultra Lite Font Engine – Modern UI Edition
// @namespace    ultra-font-clean
// @version      2.0.0
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "ultraFontConfig_" + location.hostname;
  const STYLE_ID = "ultraFontStyle";
  const FONT_PREFIX = "ultraFontLink_";

  const systemFonts = ["Georgia", "Times New Roman", "Arial", "Verdana", "Segoe UI", "Tahoma"];

  const SITE_PRESETS = {
    "voz.vn": {
      selector: ".message-body .bbWrapper",
      customCss: `
        .message-body .bbWrapper img.smilie { max-height: 24px !important; width: auto !important; vertical-align: middle !important; }
        .message-body i.fa--xf, .message-body [class*="fa-"] { font-size: 14px !important; }
      `
    },
    "reddit.com": {
      selector: "shreddit-post [slot='text-body'], .RichTextJSON-root",
      customCss: ""
    },
    "medium.com": {
      selector: "article section",
      customCss: ""
    }
  };

  const DEFAULT_CONFIG = {
    font: "Inter",
    scale: 1.0,
    selector: "auto",
    weight: 400,
    stroke: 0
  };

  function getAutoConfig() {
    const host = location.hostname;
    for (const key in SITE_PRESETS) {
      if (host.includes(key)) return SITE_PRESETS[key];
    }
    return { selector: "body", customCss: "" };
  }

  function loadFont(fontName) {
    if (!fontName || systemFonts.includes(fontName)) return;
    const id = FONT_PREFIX + fontName.replace(/\s+/g, "_");
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  function applyStyle(config) {
    if (!config) return;
    loadFont(config.font);

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.documentElement.appendChild(style);
    }

    const autoPreset = getAutoConfig();
    const isAuto = !config.selector || config.selector.trim().toLowerCase() === "auto";
    const target = isAuto ? autoPreset.selector : config.selector.trim();
    const extraCss = isAuto ? (autoPreset.customCss || "") : "";

    style.textContent = `
      ${target} {
        font-family: '${config.font}', system-ui, -apple-system, sans-serif !important;
        font-weight: ${config.weight || 400} !important;
        -webkit-text-stroke: ${config.stroke || 0}px currentColor !important;
        letter-spacing: -0.01em !important;
        ${config.scale !== 1.0 ? `font-size: ${config.scale}em !important;` : ''}
      }

      /* Bảo vệ Icon & Block Code */
      ${target} [class*="fa-"], ${target} [class*="fa--"], ${target} [class*="icon"],
      ${target} [class*="material-icons"], ${target} [class*="bi-"], ${target} [class*="lucide-"],
      ${target} svg, ${target} i {
        font-family: inherit;
        -webkit-text-stroke: 0px !important;
      }

      ${target} img.smilie, ${target} img.emoji, ${target} [class*="emoji"] {
        max-height: 1.5em !important;
        width: auto !important;
        vertical-align: -0.2em !important;
      }

      ${target} pre, ${target} code, ${target} kbd, ${target} samp {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
      }

      ${extraCss}
    `;
  }

  function save(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  // ================= MODAL GIAO DIỆN HIỆN ĐẠI =================
  let modalHost = null;

  function openConfigModal() {
    if (modalHost) return;

    const current = load() || DEFAULT_CONFIG;

    modalHost = document.createElement("div");
    modalHost.id = "ultra-font-modal-root";
    const shadow = modalHost.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2147483646;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .backdrop.visible {
          opacity: 1;
        }
        .modal {
          width: 440px;
          max-width: 90vw;
          background: rgba(26, 31, 46, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          padding: 24px;
          transform: scale(0.96) translateY(8px);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .backdrop.visible .modal {
          transform: scale(1) translateY(0);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .title {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .badge {
          font-size: 10px;
          background: #3b82f6;
          padding: 2px 7px;
          border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .close-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .form-group {
          margin-bottom: 16px;
        }
        label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
          margin-bottom: 6px;
        }
        .label-val {
          color: #38bdf8;
          font-family: monospace;
          font-weight: 600;
        }
        input[type="text"], select {
          width: 100%;
          box-sizing: border-box;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 9px 12px;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type="text"]:focus, select:focus {
          border-color: #38bdf8;
        }
        input[type="range"] {
          width: 100%;
          accent-color: #38bdf8;
          cursor: pointer;
        }
        .hint {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }
        button.btn {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }
        .btn-primary {
          background: #0284c7;
          color: #fff;
        }
        .btn-primary:hover {
          background: #0369a1;
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
        }
        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.25);
        }
      </style>

      <div class="backdrop" id="backdrop">
        <div class="modal">
          <div class="header">
            <div class="title">
              Cài đặt Font Chữ <span class="badge">Engine</span>
            </div>
            <button class="close-btn" id="closeBtn">&times;</button>
          </div>

          <div class="form-group">
            <label>Tên Font Google</label>
            <input type="text" id="fontInput" value="${current.font}" placeholder="Inter, Roboto, Be Vietnam Pro...">
          </div>

          <div class="form-group">
            <label>Tỉ lệ Scale <span class="label-val" id="scaleVal">${current.scale}x</span></label>
            <input type="range" id="scaleInput" min="0.8" max="1.5" step="0.05" value="${current.scale}">
          </div>

          <div class="form-group">
            <label>Độ đậm (Weight)</label>
            <select id="weightSelect">
              <option value="300" ${current.weight === 300 ? 'selected' : ''}>300 - Light</option>
              <option value="400" ${current.weight === 400 ? 'selected' : ''}>400 - Regular</option>
              <option value="500" ${current.weight === 500 ? 'selected' : ''}>500 - Medium</option>
              <option value="600" ${current.weight === 600 ? 'selected' : ''}>600 - SemiBold</option>
              <option value="700" ${current.weight === 700 ? 'selected' : ''}>700 - Bold</option>
            </select>
          </div>

          <div class="form-group">
            <label>Độ nét viền (Stroke) <span class="label-val" id="strokeVal">${current.stroke}px</span></label>
            <input type="range" id="strokeInput" min="0" max="0.6" step="0.05" value="${current.stroke}">
          </div>

          <div class="form-group">
            <label>Selector</label>
            <input type="text" id="selectorInput" value="${current.selector}" placeholder="auto hoặc điền CSS selector">
            <div class="hint">Nhập <b>auto</b> để kích hoạt bộ nhận diện tối ưu riêng (Voz, Reddit, Medium...)</div>
          </div>

          <div class="actions">
            <button class="btn btn-danger" id="resetBtn">Mặc định</button>
            <button class="btn btn-primary" id="saveBtn">Lưu & Áp dụng</button>
          </div>
        </div>
      </div>
    `;

    document.documentElement.appendChild(modalHost);

    const backdrop = shadow.getElementById("backdrop");
    const closeBtn = shadow.getElementById("closeBtn");
    const saveBtn = shadow.getElementById("saveBtn");
    const resetBtn = shadow.getElementById("resetBtn");

    const scaleInput = shadow.getElementById("scaleInput");
    const scaleVal = shadow.getElementById("scaleVal");
    const strokeInput = shadow.getElementById("strokeInput");
    const strokeVal = shadow.getElementById("strokeVal");

    // Animation mở
    requestAnimationFrame(() => backdrop.classList.add("visible"));

    scaleInput.oninput = () => scaleVal.textContent = scaleInput.value + "x";
    strokeInput.oninput = () => strokeVal.textContent = strokeInput.value + "px";

    function closeModal() {
      backdrop.classList.remove("visible");
      setTimeout(() => {
        if (modalHost) {
          modalHost.remove();
          modalHost = null;
        }
      }, 200);
    }

    closeBtn.onclick = closeModal;
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };

    // Đóng nhanh bằng phím ESC
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    saveBtn.onclick = () => {
      const config = {
        font: shadow.getElementById("fontInput").value.trim() || DEFAULT_CONFIG.font,
        scale: parseFloat(scaleInput.value),
        weight: parseInt(shadow.getElementById("weightSelect").value),
        stroke: parseFloat(strokeInput.value),
        selector: shadow.getElementById("selectorInput").value.trim() || "auto"
      };

      save(config);
      applyStyle(config);
      closeModal();
    };

    resetBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    };
  }

  // Phím tắt mở cài đặt: Alt + Shift + F
  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
      e.preventDefault();
      openConfigModal();
    }
  });

  GM_registerMenuCommand("⚙️ Cài đặt Font", openConfigModal);

  // Áp dụng cấu hình ban đầu
  const config = load() || DEFAULT_CONFIG;
  applyStyle(config);

})();
