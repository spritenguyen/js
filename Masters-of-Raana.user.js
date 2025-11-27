// ==UserScript==
// @name         Masters-of-Raana (Optimized 1.0 + UX)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Thay đổi thư mục ảnh/video cho game HTML cục bộ, tập trung vào ổn định và cải tiến giao diện.
// @author       You
// @match        http://192.168.1.175:1314/Masters-of-Raana/start_game.html*
// @match        http://192.168.1.175:1314/Masters_of_Raana/start_game_tier4.html*
// @match        http://192.168.1.175:1314/Masters_of_Raana/start_game.html*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // *** Cấu hình Ban Đầu ***
    const DEFAULT_PIC_FOLDER = 'pics';
    const FOLDER_MAPPINGS = {
        'data-1': 'pics',
        'data-2': 'pics-1',
        'data-3': 'pics-2'
    };
    const STORAGE_KEY = 'currentGameResourceFolder';

    // Chuỗi Regex chứa tất cả các thư mục có thể thay thế (e.g., 'pics|pics-1|pics-2')
    const ALL_FOLDERS_REGEX_STRING = Object.values(FOLDER_MAPPINGS).join('|');

    /**
     * Lấy thư mục hiện tại từ LocalStorage.
     */
    function getCurrentFolder() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_PIC_FOLDER;
    }

    // 💡 Chức năng 1: Cập nhật chỉ báo trạng thái
    /**
     * Cập nhật văn bản chỉ báo thư mục đang sử dụng.
     * @param {string} folder - Tên thư mục hiện tại.
     */
    function updateStatusIndicator(folder) {
        const statusElement = document.getElementById('resource-switcher-status');
        if (statusElement) {
            statusElement.innerHTML = `Đang sử dụng thư mục: <strong>${folder}</strong>`;
        }
    }

    /**
     * Hàm xử lý thay đổi đường dẫn tài nguyên bằng cách thay thế thư mục gốc.
     * @param {HTMLElement} element - Thẻ IMG, VIDEO, hoặc SOURCE.
     */
    function handleResourceNode(element) {
        const currentFolder = getCurrentFolder();
        let originalSrc = element.getAttribute('data-original-src') || element.src || element.getAttribute('src');

        // 1. Kiểm tra tính hợp lệ
        if (!originalSrc || originalSrc.startsWith('data:') || !(element.tagName === 'IMG' || element.tagName === 'VIDEO' || element.tagName === 'SOURCE')) {
            return;
        }

        // 2. Lưu đường dẫn gốc ban đầu (chỉ khi chưa lưu)
        if (!element.getAttribute('data-original-src')) {
             element.setAttribute('data-original-src', originalSrc);
        }
        const sourceToUse = element.getAttribute('data-original-src');

        // 3. Thực hiện thay thế thư mục
        const folderRegex = new RegExp(`(${ALL_FOLDERS_REGEX_STRING})(?=[\\/])`, 'i');
        let newSrc = sourceToUse.replace(folderRegex, currentFolder);

        // 4. Cập nhật thuộc tính src của phần tử nếu có sự thay đổi
        if (newSrc !== sourceToUse && newSrc !== (element.src || element.getAttribute('src'))) {
            element.src = newSrc;
            if (element.tagName !== 'IMG') {
                element.setAttribute('src', newSrc);
            }
            if (element.tagName === 'VIDEO') {
                element.load(); // Buộc video tải lại tài nguyên mới
            }
            // console.log(`[Swapper] Thay đổi ${element.tagName}: ${sourceToUse} -> ${newSrc}`);
        }
    }

    // --- MutationObserver để bắt các phần tử được thêm vào DOM ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        handleResourceNode(node);
                        node.querySelectorAll('img, video, source').forEach(handleResourceNode);
                    }
                });
            }
        });
    });

    /**
     * Hàm duyệt qua toàn bộ thẻ tài nguyên và cập nhật lại đường dẫn.
     */
    function updateAllResources() {
        document.querySelectorAll('img, video, source').forEach(handleResourceNode);
        updateStatusIndicator(getCurrentFolder());
    }

    // 💡 Chức năng 2: Thêm nút ẩn/hiện và các nút điều khiển
    /**
     * Hàm thêm nút điều khiển vào giao diện.
     */
    function addControlButtons() {
        // --- Container Chính ---
        const container = document.createElement('div');
        container.id = 'resource-switcher-container';
        container.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; background-color: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; color: white; font-family: sans-serif; min-width: 250px;';

        // --- Tiêu đề và Nút Ẩn ---
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;';
        headerDiv.innerHTML = '<strong>📂 Chọn Thư Mục Ảnh:</strong>';
        container.appendChild(headerDiv);

        const togglerButton = document.createElement('button');
        togglerButton.textContent = '✖️'; // Dùng biểu tượng đóng/ẩn
        togglerButton.title = 'Ẩn bảng điều khiển';
        togglerButton.style.cssText = 'background: none; border: none; color: white; cursor: pointer; font-size: 16px; margin-left: 10px;';
        headerDiv.appendChild(togglerButton);

        // --- Vùng chứa các nút chọn thư mục ---
        const buttonsDiv = document.createElement('div');
        buttonsDiv.id = 'switcher-buttons-area';
        container.appendChild(buttonsDiv);

        Object.keys(FOLDER_MAPPINGS).forEach(dataKey => {
            const button = document.createElement('button');
            button.textContent = dataKey;
            button.dataset.option = dataKey;
            button.style.cssText = 'margin: 5px 5px 0 0; padding: 5px 10px; cursor: pointer; background-color: #333; color: white; border: 1px solid #555; border-radius: 3px;';

            if (FOLDER_MAPPINGS[dataKey] === getCurrentFolder()) {
                button.style.backgroundColor = '#007bff';
            }

            button.addEventListener('click', () => {
                const newFolder = FOLDER_MAPPINGS[dataKey];
                localStorage.setItem(STORAGE_KEY, newFolder);
                console.log(`[GameResourceSwapper] Đã chuyển thư mục sang: ${newFolder}`);

                document.querySelectorAll('#switcher-buttons-area button').forEach(btn => {
                    btn.style.backgroundColor = '#333';
                });
                button.style.backgroundColor = '#007bff';

                updateAllResources();
            });

            buttonsDiv.appendChild(button);
        });

        // --- Chỉ báo Trạng thái (Chức năng 1) ---
        const statusP = document.createElement('p');
        statusP.id = 'resource-switcher-status';
        statusP.style.cssText = 'margin-top: 10px; margin-bottom: 0; font-size: 14px;';
        container.appendChild(statusP);


        document.body.appendChild(container);

        // --- Logic Ẩn/Hiện (Chức năng 2) ---
        togglerButton.addEventListener('click', () => {
            container.style.display = 'none';
            showTemporaryButton();
        });

        function showTemporaryButton() {
            let showButton = document.getElementById('resource-switcher-show-btn');
            if (!showButton) {
                showButton = document.createElement('button');
                showButton.id = 'resource-switcher-show-btn';
                showButton.textContent = '🖼️'; // Biểu tượng nhỏ để click mở lại
                showButton.title = 'Hiện bảng điều khiển';
                showButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; background-color: rgba(0, 0, 0, 0.7); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; font-size: 18px; line-height: 1; cursor: pointer;';
                document.body.appendChild(showButton);

                showButton.addEventListener('click', () => {
                    container.style.display = 'block';
                    showButton.style.display = 'none';
                });
            } else {
                showButton.style.display = 'block';
            }
        }
    }

    // --- Khởi động Userscript ---
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        addControlButtons();
        updateAllResources(); // Cập nhật tài nguyên và Status Indicator lần đầu
    });

    // Xử lý các tài nguyên được tải trước sự kiện load
    document.querySelectorAll('img, video, source').forEach(handleResourceNode);

})();
