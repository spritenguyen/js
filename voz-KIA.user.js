// ==UserScript==
// @name         Hiện nick bị KIA (tối ưu)
// @namespace
// @version      2025.01.22.02
// @description  Hiển thị "Nơi đảo xa" cho nick đã KIA trên voz.vn
// @author
// @match        https://voz.vn/t/*
// @match        https://voz.vn/direct-messages/*
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    async function findUser(id, el) {
        const username = el.innerText.trim();
        const requestUri = location.pathname;
        const queryUrl = `https://voz.vn/index.php?members/find&q=${encodeURIComponent(username)}&_xfRequestUri=${requestUri}&_xfWithData=1&_xfToken=&_xfResponseType=json`;

        try {
            const res = await fetch(queryUrl, { credentials: "include" });
            if (!res.ok) return;
            const data = await res.json();

            // Kiểm tra xem có kết quả trùng user-id
            const found = data.results.some(r => String(r.id) === id || r.text === username);
            gotResult(id, !found);
        } catch (e) {
            console.warn("Fetch error:", e);
        }
    }

    function gotResult(id, isKIA) {
        if (!isKIA) return;

        document.querySelectorAll(`.message-userDetails a.username[data-user-id="${id}"]`)
            .forEach(el => {
                const userTitle = el.closest(".message-userDetails")?.querySelector(".userTitle");
                if (userTitle) userTitle.textContent = "Nơi đảo xa";
            });
    }

    const handledIds = new Set();

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("data-user-id");
            if (!id || handledIds.has(id)) {
                observer.unobserve(entry.target);
                return;
            }
            handledIds.add(id);
            findUser(id, entry.target);
            observer.unobserve(entry.target);
        });
    });

    document.querySelectorAll(".message-userDetails a.username")
        .forEach(el => observer.observe(el));
})();
