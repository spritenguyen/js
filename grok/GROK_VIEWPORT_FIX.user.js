// ==UserScript==
// @name         Grok Viewport Fix
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

function setVH(){
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

})();
