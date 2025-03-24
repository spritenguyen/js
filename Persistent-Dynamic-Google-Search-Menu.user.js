// ==UserScript==
// @name         Persistent Dynamic Google Search Menu with Updated Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Tạo menu tùy chọn tìm kiếm động trên Google với menu theo chuột và phím tắt Ctrl + Shift + F để mở box cập nhật định nghĩa tùy chọn tìm kiếm
// @author
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'customSearchOptions';

    // Hàm lấy các tùy chọn tìm kiếm từ localStorage
    function loadSearchOptions() {
        const savedOptions = localStorage.getItem(STORAGE_KEY);
        return savedOptions ? JSON.parse(savedOptions) : [
            { name: 'Search Google with IMDb', suffix: ' imdb ' },
            { name: 'Search Google Normally', suffix: ' ' }
        ];
    }

    // Hàm lưu các tùy chọn tìm kiếm vào localStorage
    function saveSearchOptions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchOptions));
    }

    // Định nghĩa các tùy chọn tìm kiếm ban đầu
    let searchOptions = loadSearchOptions();

    // Hàm hiển thị giao diện tùy chỉnh
    function showSettingsUI() {
        let ui = document.createElement('div');
        ui.id = 'settings-ui';
        ui.style.position = 'fixed';
        ui.style.top = '50%';
        ui.style.left = '50%';
        ui.style.transform = 'translate(-50%, -50%)';
        ui.style.backgroundColor = 'white';
        ui.style.border = '1px solid black';
        ui.style.padding = '20px';
        ui.style.zIndex = '10000';

        let title = document.createElement('h3');
        title.textContent = 'Search Options Settings';
        ui.appendChild(title);

        let list = document.createElement('div');
        searchOptions.forEach((option, index) => {
            let item = document.createElement('div');
            item.style.marginBottom = '10px';

            let inputName = document.createElement('input');
            inputName.value = option.name;
            inputName.placeholder = 'Option Name';
            item.appendChild(inputName);

            let inputSuffix = document.createElement('input');
            inputSuffix.value = option.suffix;
            inputSuffix.placeholder = 'Suffix';
            inputSuffix.style.marginLeft = '10px';
            item.appendChild(inputSuffix);

            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.onclick = () => {
                searchOptions.splice(index, 1);
                saveSearchOptions(); // Lưu thay đổi
                ui.remove();
                showSettingsUI();
            };
            item.appendChild(deleteBtn);

            list.appendChild(item);

            inputName.onchange = () => {
                option.name = inputName.value;
                saveSearchOptions(); // Lưu thay đổi
            };
            inputSuffix.onchange = () => {
                option.suffix = inputSuffix.value;
                saveSearchOptions(); // Lưu thay đổi
            };
        });

        ui.appendChild(list);

        let addBtn = document.createElement('button');
        addBtn.textContent = 'Add Option';
        addBtn.onclick = () => {
            searchOptions.push({ name: 'New Option', suffix: ' ' });
            saveSearchOptions(); // Lưu thay đổi
            ui.remove();
            showSettingsUI();
        };
        ui.appendChild(addBtn);

        let clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.style.marginLeft = '10px';
        clearAllBtn.onclick = () => {
            searchOptions = [];
            saveSearchOptions(); // Lưu thay đổi
            ui.remove();
            showSettingsUI();
        };
        ui.appendChild(clearAllBtn);

        let closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginLeft = '10px';
        closeBtn.onclick = () => document.body.removeChild(ui);
        ui.appendChild(closeBtn);

        document.body.appendChild(ui);
    }

    // Hàm tạo menu tìm kiếm
    function createContextMenu(selectedText, mouseX, mouseY) {
        let searchMenu = document.createElement('div');
        searchMenu.id = 'custom-search-menu';
        searchMenu.style.position = 'absolute';
        searchMenu.style.backgroundColor = 'white';
        searchMenu.style.border = '1px solid black';
        searchMenu.style.padding = '5px';
        searchMenu.style.zIndex = '9999';
        searchMenu.style.cursor = 'pointer';

        // Định vị menu theo tọa độ chuột
        searchMenu.style.left = `${mouseX}px`;
        searchMenu.style.top = `${mouseY}px`;

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
    }

    // Lắng nghe phím tắt Ctrl + Shift + F để mở giao diện
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'F') {
            showSettingsUI();
        }
    });

    // Hiển thị menu tùy chọn tìm kiếm khi click chuột phải
    document.addEventListener('contextmenu', function(event) {
        let selectedText = window.getSelection().toString().trim();
        let searchMenu = document.getElementById('custom-search-menu');

        // Xóa menu cũ nếu tồn tại
        if (searchMenu) {
            document.body.removeChild(searchMenu);
        }

        if (selectedText) {
            // Hiển thị menu tại vị trí chuột
            createContextMenu(selectedText, event.pageX, event.pageY);
            event.preventDefault(); // Ngăn menu chuột phải mặc định
        }
    });

    // Ẩn menu khi click bất kỳ nơi nào khác
    document.addEventListener('click', function() {
        let searchMenu = document.getElementById('custom-search-menu');
        if (searchMenu) {
            document.body.removeChild(searchMenu);
        }
    });
})();
