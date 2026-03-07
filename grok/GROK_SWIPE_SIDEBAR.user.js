// ==UserScript==
// @name         Grok Swipe Sidebar
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

let startX=0;
let endX=0;

document.addEventListener("touchstart",(e)=>{
startX=e.changedTouches[0].screenX;
});

document.addEventListener("touchend",(e)=>{

endX=e.changedTouches[0].screenX;

if(startX<40 && endX>120){

const aside=document.querySelector("aside");
if(aside) aside.style.left="0";

}

if(startX>200 && endX<80){

const aside=document.querySelector("aside");
if(aside) aside.style.left="-85vw";

}

});

})();
