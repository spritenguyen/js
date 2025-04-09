// ==UserScript==
// @name         Block Fonts on msn.com
// @match        *://*.msn.com/*
// @run-at       document-start
// ==/UserScript==

const blockFonts = () => {
    const css = "* { font-family: Arial, sans-serif !important; }";
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
};
blockFonts();
