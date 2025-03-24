// ==UserScript==
// @name         Optimized Dynamic Search Menu
// @namespace    http://tampermonkey.net/
// @version      1.9.5
// @description  Tạo menu tìm kiếm linh hoạt, ổn định trên mọi trình duyệt và website (hỗ trợ Desktop + Android)
// @author       
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'customSearchOptions';
    let menuVisible = false; // Trạng thái menu hiển thị
    let hoverTimeout; // Đếm thời gian hiển thị menu
    let hideTimeout; // Đếm thời gian ẩn menu

    // Tải tùy chọn tìm kiếm từ localStorage
    function loadSearchOptions() {
        const savedOptions = localStorage.getItem(STORAGE_KEY);
        return savedOptions ? JSON.parse(savedOptions) : [
            { name: 'Search Google with IMDb', suffix: ' imdb ' },
            { name: 'Search Google Normally', suffix: ' ' }
        ];
    }

    // Lưu tùy chọn tìm kiếm vào localStorage
    function saveSearchOptions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchOptions));
    }

    // Các tùy chọn tìm kiếm
    let searchOptions = loadSearchOptions();

    // Hàm tạo và hiển thị menu tìm kiếm
    function createContextMenu(selectedText, mouseX, mouseY) {
        // Xóa menu cũ nếu tồn tại
        const existingMenu = document.getElementById('custom-search-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

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
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedText + option.suffix)}`;
                const newTab = window.open(searchUrl, '_blank');
                if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                    alert('Trình duyệt của bạn đang chặn cửa sổ bật lên. Vui lòng cho phép popup để sử dụng tính năng này.');
                } else {
                    newTab.focus(); // Đảm bảo tab mới mở được kích hoạt
                }

                if (searchMenu.parentNode) {
                    searchMenu.remove(); // Xóa menu sau khi click
                }
                menuVisible = false;
            };
            searchMenu.appendChild(optionElement);
        });

        document.body.appendChild(searchMenu);

        // Tính toán vị trí menu so với màn hình và bù cuộn
        const menuWidth = searchMenu.offsetWidth;
        const menuHeight = searchMenu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let finalX = mouseX;
        let finalY = mouseY;

        if (finalX + menuWidth > viewportWidth + window.scrollX) finalX = viewportWidth + window.scrollX - menuWidth - 10;
        if (finalY + menuHeight > viewportHeight + window.scrollY) finalY = viewportHeight + window.scrollY - menuHeight - 10;
        if (finalX < window.scrollX) finalX = window.scrollX + 10;
        if (finalY < window.scrollY) finalY = window.scrollY + 10;

        searchMenu.style.left = `${finalX}px`;
        searchMenu.style.top = `${finalY}px`;
        menuVisible = true;

        // Tự động ẩn menu sau 3 giây nếu không tương tác
        hideTimeout = setTimeout(() => {
            if (searchMenu.parentNode) {
                searchMenu.remove();
            }
            menuVisible = false;
        }, 3000);
    }

    // Desktop: Xử lý sự kiện chuột
    document.addEventListener('mousemove', function(event) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && !menuVisible) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                createContextMenu(selectedText, event.pageX, event.pageY);
            }, 1000); // Trì hoãn 1 giây
        } else {
            clearTimeout(hoverTimeout);
        }
    });

    // Android: Xử lý sự kiện chạm
    document.addEventListener('touchstart', function(event) {
        const selectedText = window.getSelection().toString().trim();
        const touch = event.touches[0];
        if (selectedText && !menuVisible) {
            clearTimeout(hideTimeout);
            createContextMenu(selectedText, touch.pageX, touch.pageY);
        }
    });

    // Giao diện quản lý tùy chọn tìm kiếm
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
                saveSearchOptions();
                ui.remove();
                showSettingsUI();
            };
            item.appendChild(deleteBtn);

            list.appendChild(item);

            inputName.onchange = () => {
                option.name = inputName.value;
                saveSearchOptions();
            };
            inputSuffix.onchange = () => {
                option.suffix = inputSuffix.value;
                saveSearchOptions();
            };
        });

        ui.appendChild(list);

        let addBtn = document.createElement('button');
        addBtn.textContent = 'Add Option';
        addBtn.onclick = () => {
            searchOptions.push({ name: 'New Option', suffix: ' ' });
            saveSearchOptions();
            ui.remove();
            showSettingsUI();
        };
        ui.appendChild(addBtn);

        let clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.style.marginLeft = '10px';
        clearAllBtn.onclick = () => {
            searchOptions = [];
            saveSearchOptions();
            ui.remove();
            showSettingsUI();
        };
        ui.appendChild(clearAllBtn);

        let closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginLeft = '10px';
        closeBtn.onclick = () => ui.remove();
        ui.appendChild(closeBtn);

        document.body.appendChild(ui);
    }

    // Gọi giao diện chỉnh sửa (Ctrl + Shift + F)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'F') {
            showSettingsUI();
        }
    });
})();
