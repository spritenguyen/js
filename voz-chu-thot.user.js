// ==UserScript==
// @name         Oánh dấu chủ thớt (tối ưu)
// @namespace
// @version      2025.01.22.02
// @description  Đánh dấu chủ thớt trên voz.vn
// @author
// @match        https://voz.vn/t/*
// @match        https://voz.vn/direct-messages/*
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const starterEl = document.querySelector(".username.u-concealed");
    if (!starterEl) return;

    const starterId = starterEl.getAttribute("data-user-id");
    if (!starterId) return;

    const starters = document.querySelectorAll(`.message-userDetails a.username[data-user-id="${starterId}"]`);
    if (starters.length === 0) return;

    // Thêm CSS
    const style = document.createElement('style');
    style.textContent = `
        .userBanner.userBanner--starter {
            background-color: #eaeaea;
            color: #282828;
            border-color: #828282;
        }
    `;
    document.head.appendChild(style);

    // Thêm flair "Chủ thớt"
    starters.forEach(el => {
        const container = el.closest(".message-userDetails");
        if (!container) return;

        const flair = document.createElement("div");
        flair.className = "userBanner userBanner--starter message-userBanner";
        flair.textContent = "Chủ thớt";

        container.appendChild(flair);
    });
})();
