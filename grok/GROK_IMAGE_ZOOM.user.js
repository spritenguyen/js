// ==UserScript==
// @name         Grok Image Zoom
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

document.addEventListener("click",(e)=>{

const img=e.target.closest("img");

if(!img) return;

const overlay=document.createElement("div");

overlay.style.position="fixed";
overlay.style.top=0;
overlay.style.left=0;
overlay.style.width="100%";
overlay.style.height="100%";
overlay.style.background="rgba(0,0,0,.9)";
overlay.style.display="flex";
overlay.style.alignItems="center";
overlay.style.justifyContent="center";
overlay.style.zIndex="99999";

const zoomImg=document.createElement("img");

zoomImg.src=img.src;
zoomImg.style.maxWidth="95%";
zoomImg.style.maxHeight="95%";

overlay.appendChild(zoomImg);

overlay.onclick=()=>overlay.remove();

document.body.appendChild(overlay);

});

})();
