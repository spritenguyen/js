// ==UserScript==
// @name         Grok Floating Toolbar SAFE
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

function moveToolbar(){

const toolbar=document.querySelector("div button")?.parentElement;

if(!toolbar) return;

toolbar.style.position="fixed";
toolbar.style.bottom="140px";
toolbar.style.left="50%";
toolbar.style.transform="translateX(-50%)";
toolbar.style.zIndex="9999";

}

setInterval(moveToolbar,1000);

})();
