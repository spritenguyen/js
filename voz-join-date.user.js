// ==UserScript==
// @name         Hiện Join date (giới hạn + loading)
// @namespace
// @version      2024.11.25.05
// @description  Hiển thị ngày join của user trên voz.vn, giới hạn 3 request đồng thời và có loading indicator
// @author
// @match        https://voz.vn/t/*
// @match        https://voz.vn/direct-messages/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const warningDate = new Date(Date.now() - 3 * 30 * 86400 * 1000);

    let cachedIds = GM_getValue("cachedIds", {});
    const dataVersion = 1;
    if (GM_getValue("dataVersion", 0) < dataVersion) {
        cachedIds = {};
        GM_setValue("dataVersion", dataVersion);
    }

    const done = new Set();

    // ==== Queue để giới hạn số request đồng thời ====
    const queue = [];
    let active = 0;
    const MAX_CONCURRENT = 3;

    function enqueue(task) {
        queue.push(task);
        runNext();
    }

    function runNext() {
        if (active >= MAX_CONCURRENT || queue.length === 0) return;

        const task = queue.shift();
        active++;
        task().finally(() => {
            active--;
            runNext();
        });
    }
    // ===============================================

    async function gnsJd(id, el) {
        if (id in cachedIds) {
            showJd(id);
            return;
        }

        // Thêm indicator "Đang tải..."
        addLoadingIndicator(el);

        const username = el.innerText;
        const requestUri = location.pathname;
        const queryUrl = `https://voz.vn/u/${encodeURIComponent(username)}.${id}/?tooltip=true&_xfRequestUri=${requestUri}&_xfWithData=1&_xfToken=&_xfResponseType=json`;

        try {
            const res = await fetch(queryUrl, { credentials: "include" });
            if (!res.ok) return;
            const data = await res.json();
            const match = data.html.content.match(/data-timestamp="(\d+)"/);
            if (match) {
                cachedIds[id] = Number(match[1]);
                showJd(id);
            } else {
                removeLoadingIndicator(el);
            }
        } catch (e) {
            console.warn("Fetch error", e);
            removeLoadingIndicator(el);
        }
    }

    function showJd(id) {
        if (done.has(id)) return;

        document.querySelectorAll(`.message-userDetails a.username[data-user-id="${id}"]`).forEach(el => {
            removeLoadingIndicator(el);

            let jd = new Date(cachedIds[id] * 1000);
            const jdText = jd.toLocaleDateString("vi-VN") + (jd < warningDate ? "" : " *");

            const parent = el.closest(".message-userDetails");
            if (!parent) return;

            const userTitle = parent.querySelector(".userTitle");
            if (!userTitle) return;

            const userBanners = parent.querySelectorAll(".userBanner");
            const br = (userBanners.length >= 2) ? "<br/>" : "";

            userTitle.insertAdjacentHTML('afterend',
                `<h5 class="message-userTitle joindate" dir="auto" itemprop="joindate">Joined: ${jdText}</h5>${br}`);
        });

        done.add(id);
    }

    // ==== Loading indicator helpers ====
    function addLoadingIndicator(el) {
        const parent = el.closest(".message-userDetails");
        if (!parent) return;
        const userTitle = parent.querySelector(".userTitle");
        if (!userTitle) return;

        if (!parent.querySelector(".joindate-loading")) {
            userTitle.insertAdjacentHTML('afterend',
                `<h5 class="message-userTitle joindate-loading" dir="auto">Đang tải…</h5>`);
        }
    }

    function removeLoadingIndicator(el) {
        const parent = el.closest(".message-userDetails");
        if (!parent) return;
        const loadingEl = parent.querySelector(".joindate-loading");
        if (loadingEl) loadingEl.remove();
    }
    // ==================================

    window.addEventListener("beforeunload", () => {
        GM_setValue("cachedIds", cachedIds);
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute("data-user-id");
            if (!id) return;
            if (id in cachedIds) {
                observer.unobserve(entry.target);
                showJd(id);
            } else {
                enqueue(() => gnsJd(id, entry.target));
            }
        });
    });

    document.querySelectorAll(".message-userDetails a.username").forEach(el => observer.observe(el));

    const style = document.createElement('style');
    style.textContent =
        '.message-userTitle.joindate-loading { color: gray; font-style: italic; }' +
        '@media (max-width: 751px) { .message-userTitle.joindate:before {content: ". "} }' +
        '@media (min-width: 752px) { .message-userTitle.joindate + br {display: none;} }';
    document.head.appendChild(style);
})();
