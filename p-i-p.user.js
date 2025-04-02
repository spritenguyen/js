// ==UserScript== 
// @name Video PiP Button 
// @namespace http://tampermonkey.net/ 
// @version 1.0 
// @description Thêm nút PiP cho video trên trang web 
// @include *://*/* 
// @grant none 
// ==/UserScript== 
(function() { 'use strict';
// Tạo nút PiP const createPiPButton = (video) =>
{ const button = document.createElement('button');
button.innerText = 'PiP';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.right = '10px';
button.style.zIndex = '1000';
button.style.backgroundColor = 'white';
button.style.border = '1px solid black';
button.style.padding = '5px';
button.onclick = async () =>
{ if (document.pictureInPictureElement) { await document.exitPictureInPicture();
} else { await video.requestPictureInPicture();
} };
video.parentElement.style.position = 'relative';
// Để nút không bị rời khỏi video video.parentElement.appendChild(button);
};
// Tìm và thêm nút vào các video const videos = document.querySelectorAll('video');
videos.forEach(video =>
{ createPiPButton(video);
});
// Thêm nút cho video mới được tải const observer = new MutationObserver(() =>
{ const newVideos = document.querySelectorAll('video:not([data-pip-added])');
newVideos.forEach(video =>
{ video.setAttribute('data-pip-added', 'true');
createPiPButton(video);
});
});
observer.observe(document.body, { childList: true, subtree: true });
})();
