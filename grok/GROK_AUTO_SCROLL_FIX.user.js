// ==UserScript==
// @name         Grok Auto Scroll Fix
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

let lastHeight=0;

function autoScroll(){

const chat=document.querySelector("main");

if(!chat) return;

if(chat.scrollHeight!==lastHeight){

chat.scrollTop=chat.scrollHeight;

lastHeight=chat.scrollHeight;

}

}

setInterval(autoScroll,1200);

})();
