// ==UserScript==
// @name         Ultra Lite Font Engine – Multi Target (Tab & Color Edition)
// @namespace    ultra-font-clean
// @version      3.0.0
// @description  Engine font đa quy tắc theo tab, hỗ trợ tùy chỉnh font, scale, màu chữ độc lập cho từng đối tượng.
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "ultraFontConfig_" + location.hostname;
    const STYLE_ID = "ultraFontStyle";
    const FONT_PREFIX = "ultraFontLink_";
    const TARGET_ATTR = "data-ultra-target";
    const ORIG_FS_ATTR = "data-ultra-orig-fs";
    const ORIG_LH_ATTR = "data-ultra-orig-lh";

    const systemFonts = [
        "Arial", "Verdana", "Tahoma", "Georgia",
        "Times New Roman", "Segoe UI", "system-ui", "sans-serif"
    ];

    const DEFAULT_RULE = {
        id: "rule_1",
        name: "Quy tắc 1",
        selector: "body",
        font: "Inter",
        scale: 1.0,
        enableColor: false,
        color: "#38bdf8",
        weight: 400,
        stroke: 0,
        protectIcons: true,
        protectCode: true,
        protectImages: true
    };

    const DEFAULT_CONFIG = {
        rules: [ { ...DEFAULT_RULE } ]
    };

    // ============================================================
    // STORAGE & MIGRATION
    // ============================================================

    function save(config) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (e) {
            console.error("[Ultra Font] Không thể lưu cấu hình:", e);
        }
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || typeof data !== "object") return null;

            // Tương thích ngược với cấu hình v2.x cũ
            if (!Array.isArray(data.rules)) {
                return {
                    rules: [{
                        ...DEFAULT_RULE,
                        id: "rule_" + Date.now(),
                        name: "Quy tắc 1",
                        selector: data.selector || DEFAULT_RULE.selector,
                        font: data.font || DEFAULT_RULE.font,
                        scale: data.scale || DEFAULT_RULE.scale,
                        weight: data.weight || DEFAULT_RULE.weight,
                        stroke: data.stroke || DEFAULT_RULE.stroke,
                        protectIcons: data.protectIcons ?? true,
                        protectCode: data.protectCode ?? true,
                        protectImages: data.protectImages ?? true
                    }]
                };
            }

            if (data.rules.length === 0) {
                return { rules: [{ ...DEFAULT_RULE }] };
            }

            return data;
        } catch {
            return null;
        }
    }

    // ============================================================
    // FONT LOADER
    // ============================================================

    function loadFont(fontName, weight) {
        if (!fontName || systemFonts.includes(fontName)) return;

        const cleanWeight = parseInt(weight, 10) || 400;
        const id = FONT_PREFIX + fontName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

        if (document.getElementById(id)) return;

        const weightsToLoad = Array.from(new Set([400, cleanWeight])).sort((a, b) => a - b).join(";");
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, "+")}:wght@${weightsToLoad}&display=swap`;

        (document.head || document.documentElement).appendChild(link);
    }

    // ============================================================
    // CSS ESCAPE & SELECTOR VALIDATION
    // ============================================================

    function escapeCssString(value) {
        return String(value)
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");
    }

    function isValidSelector(selector) {
        if (!selector || typeof selector !== "string") return false;
        try {
            document.createDocumentFragment().querySelector(selector);
            return true;
        } catch {
            return false;
        }
    }

    // ============================================================
    // KÍCH THƯỚC GỐC & SCALE CACHE
    // ============================================================

    function getOrCacheMetrics(element) {
        let origFs = element.getAttribute(ORIG_FS_ATTR);
        let origLh = element.getAttribute(ORIG_LH_ATTR);

        if (origFs && origLh) {
            return {
                fontSize: parseFloat(origFs),
                lineHeightRatio: parseFloat(origLh)
            };
        }

        const computed = window.getComputedStyle(element);
        const fs = parseFloat(computed.fontSize);
        if (!Number.isFinite(fs) || fs <= 0) return null;

        let lhRatio = 1.4;
        const lh = computed.lineHeight;
        if (lh && lh !== "normal") {
            const lhPx = parseFloat(lh);
            if (Number.isFinite(lhPx) && lhPx > 0) {
                lhRatio = parseFloat((lhPx / fs).toFixed(3));
            }
        }

        element.setAttribute(ORIG_FS_ATTR, fs.toString());
        element.setAttribute(ORIG_LH_ATTR, lhRatio.toString());

        return { fontSize: fs, lineHeightRatio: lhRatio };
    }

    // ============================================================
    // ENGINE ÁP DỤNG STYLESHEET
    // ============================================================

    function ensureGlobalStyle() {
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            (document.head || document.documentElement).appendChild(style);
        }

        style.textContent = `
[${TARGET_ATTR}] {
    font-family: var(--ultra-font) !important;
    font-size: var(--ultra-fs) !important;
    line-height: var(--ultra-lh) !important;
    font-weight: var(--ultra-weight, 400) !important;
    -webkit-text-stroke: var(--ultra-stroke, 0) currentColor !important;
    letter-spacing: -0.01em !important;
}

[${TARGET_ATTR}][data-ultra-color="true"] {
    color: var(--ultra-color) !important;
}

[${TARGET_ATTR}] [class*="fa-"],
[${TARGET_ATTR}] [class*="fa--"],
[${TARGET_ATTR}] [class*="material-icons"],
[${TARGET_ATTR}] [class*="bi-"],
[${TARGET_ATTR}] [class*="lucide-"],
[${TARGET_ATTR}] svg {
    -webkit-text-stroke: 0 !important;
}

[${TARGET_ATTR}] pre,
[${TARGET_ATTR}] code,
[${TARGET_ATTR}] kbd,
[${TARGET_ATTR}] samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    line-height: normal !important;
}

[${TARGET_ATTR}] img.smilie,
[${TARGET_ATTR}] img.emoji,
[${TARGET_ATTR}] [class*="emoji"] {
    max-height: 1.5em !important;
    width: auto !important;
    vertical-align: -0.2em !important;
}
`;
    }

    function clearPreviousTargets() {
        const oldTargets = document.querySelectorAll(`[${TARGET_ATTR}]`);
        for (const el of oldTargets) {
            el.removeAttribute(TARGET_ATTR);
            el.removeAttribute("data-ultra-color");
            el.style.removeProperty("--ultra-font");
            el.style.removeProperty("--ultra-fs");
            el.style.removeProperty("--ultra-lh");
            el.style.removeProperty("--ultra-weight");
            el.style.removeProperty("--ultra-stroke");
            el.style.removeProperty("--ultra-color");
        }
    }

    function applyStyle(config) {
        if (!config || !Array.isArray(config.rules) || config.rules.length === 0) return;

        ensureGlobalStyle();
        clearPreviousTargets();

        for (const rule of config.rules) {
            if (!rule.selector || !isValidSelector(rule.selector)) continue;

            loadFont(rule.font, rule.weight);

            const elements = document.querySelectorAll(rule.selector);
            const scale = Number(rule.scale) || 1.0;
            const fontStack = `'${escapeCssString(rule.font)}', system-ui, -apple-system, sans-serif`;

            for (const el of elements) {
                const metrics = getOrCacheMetrics(el);
                if (!metrics) continue;

                const targetFs = (metrics.fontSize * scale).toFixed(2);
                el.setAttribute(TARGET_ATTR, "true");
                el.style.setProperty("--ultra-font", fontStack);
                el.style.setProperty("--ultra-fs", `${targetFs}px`);
                el.style.setProperty("--ultra-lh", `${metrics.lineHeightRatio}`);
                el.style.setProperty("--ultra-weight", String(rule.weight || 400));
                el.style.setProperty("--ultra-stroke", `${rule.stroke || 0}px`);

                if (rule.enableColor && rule.color) {
                    el.setAttribute("data-ultra-color", "true");
                    el.style.setProperty("--ultra-color", rule.color);
                } else {
                    el.removeAttribute("data-ultra-color");
                    el.style.removeProperty("--ultra-color");
                }
            }
        }
    }

    // ============================================================
    // MODAL GIAO DIỆN MULTI-TAB
    // ============================================================

    let modalHost = null;

    function openConfigModal() {
        if (modalHost) return;

        const currentConfig = load() || DEFAULT_CONFIG;
        let workingRules = JSON.parse(JSON.stringify(currentConfig.rules));
        let activeTabIndex = 0;

        modalHost = document.createElement("div");
        modalHost.id = "ultra-font-modal-root";

        const shadow = modalHost.attachShadow({ mode: "open" });

        function renderModal() {
            const rule = workingRules[activeTabIndex];

            shadow.innerHTML = `
<style>
:host { all: initial; font-family: system-ui, -apple-system, sans-serif; }
.backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 2147483646; display: flex; align-items: center; justify-content: center; }
.modal { width: 500px; max-width: 94vw; max-height: 92vh; overflow-y: auto; background: #1a1f2e; border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; box-shadow: 0 24px 48px rgba(0,0,0,0.6); color: #f8fafc; padding: 22px; box-sizing: border-box; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.badge { font-size: 10px; background: #0284c7; padding: 2px 7px; border-radius: 999px; font-weight: 700; }
.close-btn { background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 22px; line-height: 1; }

/* TABS */
.tabs-wrapper { display: flex; align-items: center; gap: 6px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.tab-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.15s ease; }
.tab-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
.add-tab-btn { background: rgba(56, 189, 248, 0.15); border: 1px dashed #0284c7; color: #38bdf8; padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }

/* TAB HEADER CONTROLS */
.tab-header-row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
.tab-name-input { flex: 1; background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.15); padding: 6px 10px; border-radius: 8px; color: #fff; font-size: 13px; outline: none; }
.del-tab-btn { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 6px 10px; border-radius: 8px; font-size: 12px; cursor: pointer; }

/* FORMS */
.form-group { margin-bottom: 12px; }
label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 500; color: #cbd5e1; margin-bottom: 5px; }
.label-val { color: #38bdf8; font-family: monospace; }
input[type="text"], select { width: 100%; box-sizing: border-box; background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.15); padding: 8px 12px; border-radius: 8px; color: #fff; font-size: 13px; outline: none; }
input[type="text"]:focus, select:focus { border-color: #38bdf8; }
input[type="range"] { width: 100%; cursor: pointer; }

/* COLOR PICKER ROW */
.color-picker-group { display: flex; align-items: center; gap: 10px; background: rgba(15,23,42,.4); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,.08); }
.color-input-native { width: 34px; height: 34px; border: none; padding: 0; background: transparent; cursor: pointer; border-radius: 6px; }
.color-text-input { flex: 1; text-transform: uppercase; font-family: monospace; }

.checkbox-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; }
.checkbox-row label { margin: 0; font-size: 12px; }
.hint { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.4; }
.status { margin-top: 6px; padding: 7px 10px; border-radius: 6px; background: rgba(56,189,248,.1); color: #7dd3fc; font-family: monospace; font-size: 11px; }

/* ACTIONS */
.actions { display: flex; gap: 10px; margin-top: 18px; }
button.btn { flex: 1; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
.btn-primary { background: #0284c7; color: #fff; }
.btn-danger { background: rgba(239,68,68,.15); color: #fca5a5; border: 1px solid rgba(239,68,68,.3) !important; }
</style>

<div class="backdrop" id="backdrop">
    <div class="modal">
        <div class="header">
            <div class="title">Cài đặt Font Chữ <span class="badge">v3.0 Multi-Tab</span></div>
            <button class="close-btn" id="closeBtn">&times;</button>
        </div>

        <!-- TABS NAV -->
        <div class="tabs-wrapper">
            ${workingRules.map((r, i) => `
                <button class="tab-btn ${i === activeTabIndex ? 'active' : ''}" data-idx="${i}">
                    ${r.name || `Tab ${i + 1}`}
                </button>
            `).join("")}
            <button class="add-tab-btn" id="addTabBtn">+ Thêm Tab</button>
        </div>

        <!-- TAB RENAMING & DELETE -->
        <div class="tab-header-row">
            <input type="text" class="tab-name-input" id="tabNameInput" value="${rule.name}" placeholder="Tên gợi nhớ của Tab...">
            <button class="del-tab-btn" id="delTabBtn" title="Xóa tab này">✕ Xóa Tab</button>
        </div>

        <div class="form-group">
            <label>CSS Selector đối tượng</label>
            <input type="text" id="selectorInput" value="${rule.selector}" placeholder="h1, .message-body, .bbWrapper">
            <div class="hint">Áp dụng font riêng biệt cho các class/thẻ khớp bộ chọn này.</div>
            <div class="status" id="selectorStatus">Đang kiểm tra...</div>
        </div>

        <div class="form-group">
            <label>Tên Font</label>
            <input type="text" id="fontInput" value="${rule.font}" placeholder="Inter, Arial, Times New Roman...">
        </div>

        <!-- TÙY CHỌN MÀU CHỮ -->
        <div class="form-group">
            <label>
                <span>Màu chữ</span>
                <span class="label-val" id="colorVal">${rule.enableColor ? rule.color : "Mặc định của web"}</span>
            </label>
            <div class="color-picker-group">
                <input type="checkbox" id="enableColorCheck" ${rule.enableColor ? "checked" : ""}>
                <label for="enableColorCheck" style="margin:0; cursor:pointer;">Bật đổi màu</label>
                <input type="color" class="color-input-native" id="colorPicker" value="${rule.color || '#38bdf8'}" ${rule.enableColor ? "" : "disabled"}>
                <input type="text" class="color-text-input" id="colorTextInput" value="${rule.color || '#38bdf8'}" placeholder="#HEX" ${rule.enableColor ? "" : "disabled"}>
            </div>
        </div>

        <div class="form-group">
            <label>Tỉ lệ Scale <span class="label-val" id="scaleVal">${rule.scale}x</span></label>
            <input type="range" id="scaleInput" min="0.8" max="1.5" step="0.05" value="${rule.scale}">
        </div>

        <div class="form-group">
            <label>Độ đậm</label>
            <select id="weightSelect">
                <option value="300" ${rule.weight === 300 ? "selected" : ""}>300 - Light</option>
                <option value="400" ${rule.weight === 400 ? "selected" : ""}>400 - Regular</option>
                <option value="500" ${rule.weight === 500 ? "selected" : ""}>500 - Medium</option>
                <option value="600" ${rule.weight === 600 ? "selected" : ""}>600 - SemiBold</option>
                <option value="700" ${rule.weight === 700 ? "selected" : ""}>700 - Bold</option>
            </select>
        </div>

        <div class="form-group">
            <label>Độ nét viền <span class="label-val" id="strokeVal">${rule.stroke}px</span></label>
            <input type="range" id="strokeInput" min="0" max="0.6" step="0.05" value="${rule.stroke}">
        </div>

        <div class="form-group">
            <div class="checkbox-row">
                <label>Bảo vệ icon / SVG</label>
                <input type="checkbox" id="protectIcons" ${rule.protectIcons ? "checked" : ""}>
            </div>
            <div class="checkbox-row">
                <label>Bảo vệ code / pre</label>
                <input type="checkbox" id="protectCode" ${rule.protectCode ? "checked" : ""}>
            </div>
            <div class="checkbox-row">
                <label>Giữ kích thước emoji</label>
                <input type="checkbox" id="protectImages" ${rule.protectImages ? "checked" : ""}>
            </div>
        </div>

        <div class="actions">
            <button class="btn btn-danger" id="resetBtn">Reset Tất Cả</button>
            <button class="btn btn-primary" id="saveBtn">Lưu & Áp dụng</button>
        </div>
    </div>
</div>
`;
            bindEvents();
        }

        function saveFormToCurrentRule() {
            const rule = workingRules[activeTabIndex];
            if (!rule) return;

            rule.name = shadow.getElementById("tabNameInput").value.trim() || `Tab ${activeTabIndex + 1}`;
            rule.selector = shadow.getElementById("selectorInput").value.trim();
            rule.font = shadow.getElementById("fontInput").value.trim() || "sans-serif";
            rule.enableColor = shadow.getElementById("enableColorCheck").checked;
            rule.color = shadow.getElementById("colorTextInput").value.trim() || "#38bdf8";
            rule.scale = parseFloat(shadow.getElementById("scaleInput").value);
            rule.weight = parseInt(shadow.getElementById("weightSelect").value, 10);
            rule.stroke = parseFloat(shadow.getElementById("strokeInput").value);
            rule.protectIcons = shadow.getElementById("protectIcons").checked;
            rule.protectCode = shadow.getElementById("protectCode").checked;
            rule.protectImages = shadow.getElementById("protectImages").checked;
        }

        function bindEvents() {
            const backdrop = shadow.getElementById("backdrop");
            const closeBtn = shadow.getElementById("closeBtn");
            const saveBtn = shadow.getElementById("saveBtn");
            const resetBtn = shadow.getElementById("resetBtn");
            const addTabBtn = shadow.getElementById("addTabBtn");
            const delTabBtn = shadow.getElementById("delTabBtn");

            const scaleInput = shadow.getElementById("scaleInput");
            const scaleVal = shadow.getElementById("scaleVal");
            const strokeInput = shadow.getElementById("strokeInput");
            const strokeVal = shadow.getElementById("strokeVal");
            const selectorInput = shadow.getElementById("selectorInput");
            const selectorStatus = shadow.getElementById("selectorStatus");

            const enableColorCheck = shadow.getElementById("enableColorCheck");
            const colorPicker = shadow.getElementById("colorPicker");
            const colorTextInput = shadow.getElementById("colorTextInput");
            const colorVal = shadow.getElementById("colorVal");

            function updateStatus() {
                const sel = selectorInput.value.trim();
                if (!sel) {
                    selectorStatus.textContent = "⚠ Chưa có selector.";
                    return;
                }
                if (!isValidSelector(sel)) {
                    selectorStatus.textContent = "✕ CSS selector không hợp lệ.";
                    return;
                }
                const count = document.querySelectorAll(sel).length;
                selectorStatus.textContent = `✓ Đã khớp: ${count} phần tử thực tế.`;
            }

            selectorInput.addEventListener("input", updateStatus);
            updateStatus();

            scaleInput.oninput = () => { scaleVal.textContent = scaleInput.value + "x"; };
            strokeInput.oninput = () => { strokeVal.textContent = strokeInput.value + "px"; };

            // Logic đồng bộ màu
            enableColorCheck.onchange = () => {
                const isEnabled = enableColorCheck.checked;
                colorPicker.disabled = !isEnabled;
                colorTextInput.disabled = !isEnabled;
                colorVal.textContent = isEnabled ? colorTextInput.value : "Mặc định của web";
            };

            colorPicker.oninput = () => {
                colorTextInput.value = colorPicker.value;
                colorVal.textContent = colorPicker.value;
            };

            colorTextInput.oninput = () => {
                if (/^#[0-9A-F]{6}$/i.test(colorTextInput.value)) {
                    colorPicker.value = colorTextInput.value;
                    colorVal.textContent = colorTextInput.value;
                }
            };

            // Chuyển Tab
            shadow.querySelectorAll(".tab-btn").forEach(btn => {
                btn.onclick = () => {
                    saveFormToCurrentRule();
                    activeTabIndex = parseInt(btn.getAttribute("data-idx"), 10);
                    renderModal();
                };
            });

            // Thêm Tab mới
            addTabBtn.onclick = () => {
                saveFormToCurrentRule();
                const newIdx = workingRules.length + 1;
                workingRules.push({
                    ...DEFAULT_RULE,
                    id: "rule_" + Date.now(),
                    name: `Quy tắc ${newIdx}`,
                    selector: ""
                });
                activeTabIndex = workingRules.length - 1;
                renderModal();
            };

            // Xóa Tab hiện tại
            delTabBtn.onclick = () => {
                if (workingRules.length <= 1) {
                    alert("Anh cần giữ lại ít nhất một quy tắc cấu hình!");
                    return;
                }
                workingRules.splice(activeTabIndex, 1);
                activeTabIndex = Math.max(0, activeTabIndex - 1);
                renderModal();
            };

            function closeModal() {
                if (modalHost) {
                    modalHost.remove();
                    modalHost = null;
                }
            }

            closeBtn.onclick = closeModal;
            backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };

            saveBtn.onclick = () => {
                saveFormToCurrentRule();

                for (let i = 0; i < workingRules.length; i++) {
                    const r = workingRules[i];
                    if (r.selector && !isValidSelector(r.selector)) {
                        alert(`Tab "${r.name}" có CSS Selector không hợp lệ!`);
                        return;
                    }
                }

                const newConfig = { rules: workingRules };
                save(newConfig);
                applyStyle(newConfig);
                closeModal();
            };

            resetBtn.onclick = () => {
                if (confirm("Anh có chắc muốn xóa sạch toàn bộ các tab và cấu hình đã lưu?")) {
                    localStorage.removeItem(STORAGE_KEY);
                    location.reload();
                }
            };
        }

        (document.documentElement || document.body).appendChild(modalHost);
        renderModal();
    }

    // ============================================================
    // PHÍM TẮT & MENU LỆNH
    // ============================================================

    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
            e.preventDefault();
            openConfigModal();
        }
    });

    if (typeof GM_registerMenuCommand !== "undefined") {
        GM_registerMenuCommand("⚙️ Cài đặt Font & Tab", openConfigModal);
    }

    // ============================================================
    // KHỞI ĐỘNG HỆ THỐNG
    // ============================================================

    const activeConfig = load() || DEFAULT_CONFIG;
    applyStyle(activeConfig);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            applyStyle(load() || DEFAULT_CONFIG);
        }, { once: true });
    }

    setTimeout(() => {
        applyStyle(load() || DEFAULT_CONFIG);
    }, 1200);

})();
