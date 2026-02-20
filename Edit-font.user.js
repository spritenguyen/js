// ==UserScript==
// @name         Ultra Lite Font Engine – Partial Edit
// @namespace    ultra-font-clean
// @version      1.0.1
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "ultraFontConfig_" + location.hostname;
  const STYLE_ID = "ultraFontStyle";
  const FONT_PREFIX = "ultraFontLink_";

  const systemFonts = ["Georgia", "Times New Roman", "Arial", "Verdana"];

  function loadFont(fontName) {
    if (!fontName || systemFonts.includes(fontName)) return;

    const id = FONT_PREFIX + fontName.replace(/\s+/g, "_");
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      fontName.replace(/\s+/g, "+") +
      ":wght@300;400;500;600;700&display=swap";

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

    const target = config.selector?.trim() || "body";

    style.textContent = `
      html {
        font-size: ${config.scale}rem !important;
      }
      ${target} {
        font-family: '${config.font}', system-ui, sans-serif !important;
        font-weight: ${config.weight || 400} !important;
        -webkit-text-stroke: ${config.stroke || 0}px currentColor !important;
        letter-spacing: -0.01em !important;
      }
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

  function setFont() {
    const current = load() || {
      font: "Inter",
      scale: 1.0,
      selector: "body",
      weight: 400,
      stroke: 0
    };

    const fontInput = prompt(
      `Font:Weight:Stroke (current: ${current.font}:${current.weight}:${current.stroke})`,
      ""
    );
    if (fontInput === null) return;

    const scaleInput = prompt(
      `Font scale (current: ${current.scale})`,
      ""
    );
    if (scaleInput === null) return;

    const selectorInput = prompt(
      `Selector (current: ${current.selector})`,
      ""
    );
    if (selectorInput === null) return;

    let raw = fontInput.trim() || `${current.font}:${current.weight}:${current.stroke}`;
    let parts = raw.split(":");

    const newFont = parts[0] || current.font;
    const newWeight = parts[1] ? parseInt(parts[1]) : current.weight;
    const newStroke = parts[2] ? parseFloat(parts[2]) : current.stroke;

    const newScale = scaleInput.trim()
      ? parseFloat(scaleInput)
      : current.scale;

    if (isNaN(newScale) || newScale < 0.7 || newScale > 2) {
      alert("Invalid scale (0.9–1.3 recommended)");
      return;
    }

    const newSelector = selectorInput.trim() || current.selector;

    const config = {
      font: newFont,
      scale: newScale,
      selector: newSelector,
      weight: newWeight,
      stroke: newStroke
    };

    save(config);
    applyStyle(config);
  }

  function resetFont() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  GM_registerMenuCommand("Set / Edit Font", setFont);
  GM_registerMenuCommand("Reset Font", resetFont);

  const config = load();
  if (config) applyStyle(config);

})();
