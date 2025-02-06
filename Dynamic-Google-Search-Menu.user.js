// ==UserScript==
// @name         Dynamic Google Search Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tạo menu tùy chọn tìm kiếm động trên Google
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Định nghĩa các tùy chọn tìm kiếm
    const searchOptions = [
        { name: 'Search Google with IMDb', suffix: ' imdb' },
        { name: 'Search Google Normally', suffix: '' },
        // Thêm các tùy chọn khác tại đây
        // { name: 'Search on YouTube', suffix: ' site:youtube.com' }
    ];

    function createContextMenu(selectedText) {
        let searchMenu = document.createElement('div');
        searchMenu.id = 'custom-search-menu';
        searchMenu.style.position = 'absolute';
        searchMenu.style.backgroundColor = 'white';
        searchMenu.style.border = '1px solid black';
        searchMenu.style.padding = '5px';
        searchMenu.style.zIndex = '9999';
        searchMenu.style.cursor = 'pointer';

        searchOptions.forEach(option => {
            let optionElement = document.createElement('div');
            optionElement.textContent = option.name;
            optionElement.style.padding = '5px';
            optionElement.onclick = function() {
                let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedText + option.suffix)}`;
                window.open(searchUrl, '_blank');
                document.body.removeChild(searchMenu);
            };
            searchMenu.appendChild(optionElement);
        });

        document.body.appendChild(searchMenu);

        return searchMenu;
    }

    document.addEventListener('contextmenu', function(event) {
        let selectedText = window.getSelection().toString().trim();
        let searchMenu = document.getElementById('custom-search-menu');

        if (selectedText) {
            if (!searchMenu) {
                searchMenu = createContextMenu(selectedText);
            }

            searchMenu.style.top = `${event.clientY}px`;
            searchMenu.style.left = `${event.clientX}px`;
            event.preventDefault();
        } else if (searchMenu) {
            document.body.removeChild(searchMenu);
        }

        document.addEventListener('click', function() {
            if (document.body.contains(searchMenu)) {
                document.body.removeChild(searchMenu);
            }
        }, {once: true});
    });
})();
