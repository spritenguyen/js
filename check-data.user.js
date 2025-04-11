// ==UserScript==
// @name        Phát hiện loại mạng (Tối ưu hóa Android)
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      Your Name
// @description Hiển thị loại mạng đang dùng (tối ưu hóa cho Android)
// ==/UserScript==

(function() {
    'use strict';

    function kiemTraLoaiMang() {
        if (navigator.connection && navigator.connection.effectiveType) {
            const loaiMang = navigator.connection.effectiveType;
            if (loaiMang.includes('wifi')) {
                hienThiThongBao('Bạn đang dùng Wi-Fi.');
                return;
            } else if (loaiMang.includes('cellular')) {
                hienThiThongBao('Bạn đang dùng mạng di động.');
                return;
            }
        }
        kiemTraTocDoMang();
    }

    function kiemTraTocDoMang() {
        var startTime, endTime;
        var downloadSize = 512 * 1024; // 0.5MB, giảm kích thước tải xuống

        startTime = (new Date()).getTime();
        fetch('data:application/octet-stream;base64,' + 'A'.repeat(downloadSize))
            .then(function(response) {
                endTime = (new Date()).getTime();
                var duration = (endTime - startTime) / 1000;
                var speed = downloadSize / duration;
                var nguongTocDo = 500000; // 0.5MB/s, giảm ngưỡng tốc độ
                if (speed > nguongTocDo) {
                    hienThiThongBao('Có thể bạn đang dùng Wi-Fi (Tốc độ cao).');
                } else {
                    hienThiThongBao('Có thể bạn đang dùng mạng di động (Tốc độ thấp).');
                }
            })
            .catch(function() {
                hienThiThongBao('Không thể xác định mạng.');
            });
    }

    function hienThiThongBao(thongBao) {
        const thongBaoDiv = document.createElement('div');
        thongBaoDiv.textContent = thongBao;
        thongBaoDiv.style.position = 'fixed';
        thongBaoDiv.style.bottom = '10px'; // Điều chỉnh vị trí
        thongBaoDiv.style.left = '10px';
        thongBaoDiv.style.background = 'rgba(0, 0, 0, 0.8)'; // Tăng độ đậm
        thongBaoDiv.style.color = 'white';
        thongBaoDiv.style.padding = '8px'; // Giảm padding
        thongBaoDiv.style.borderRadius = '4px'; // Giảm bo tròn
        thongBaoDiv.style.fontSize = '14px'; // Giảm kích thước chữ
        thongBaoDiv.style.zIndex = '9999';
        document.body.appendChild(thongBaoDiv);
        setTimeout(() => {
            thongBaoDiv.remove();
        }, 4000); // Giảm thời gian hiển thị
    }
    kiemTraLoaiMang();
})();
