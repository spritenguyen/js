// ==UserScript==
// @name         Grok Mobile Pro UX
// @namespace    grok.mobile.pro
// @version      1.0
// @description  Mobile UX overhaul for grok.com
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function() {
'use strict';

/* -------------------------
   MOBILE DETECTION
------------------------- */

const isMobile = window.innerWidth < 900;
if (!isMobile) return;

/* -------------------------
   CSS ENGINE
------------------------- */

const style = document.createElement("style");
style.innerHTML = `

html,body{
max-width:100vw!important;
overflow-x:hidden!important;
}

/* main container */

main{
width:100vw!important;
padding:10px!important;
}

/* chat width */

.chat-container,
.message-list{
width:100%!important;
max-width:100%!important;
}

/* message bubble */

.message{
max-width:100%!important;
}

/* prompt box */

textarea{
font-size:16px!important;
min-height:90px!important;
line-height:1.4!important;
}

/* sticky input */

form{
position:sticky!important;
bottom:0;
background:inherit;
padding-bottom:6px;
}

/* image scaling */

img{
max-width:100%!important;
height:auto!important;
}

/* buttons */

button{
min-height:44px!important;
}

/* sidebar */

aside{
position:fixed!important;
left:-85vw;
top:0;
height:100%;
width:85vw;
max-width:420px;
z-index:9999;
transition:left .25s ease;
background:inherit;
overflow:auto;
box-shadow:0 0 20px rgba(0,0,0,.4);
}

/* sidebar open */

body.grokSidebarOpen aside{
left:0;
}

/* overlay */

#grokOverlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.35);
z-index:9998;
display:none;
}

body.grokSidebarOpen #grokOverlay{
display:block;
}

`;
document.head.appendChild(style);

/* -------------------------
   OVERLAY
------------------------- */

const overlay=document.createElement("div");
overlay.id="grokOverlay";
document.body.appendChild(overlay);

overlay.onclick=()=>toggleSidebar(false);

/* -------------------------
   SIDEBAR CONTROL
------------------------- */

function toggleSidebar(state){

if(state===undefined)
state=!document.body.classList.contains("grokSidebarOpen");

if(state){
document.body.classList.add("grokSidebarOpen");
}else{
document.body.classList.remove("grokSidebarOpen");
}

}

/* -------------------------
   SWIPE GESTURE
------------------------- */

let touchStartX=0;
let touchEndX=0;

document.addEventListener("touchstart",(e)=>{
touchStartX=e.changedTouches[0].screenX;
});

document.addEventListener("touchend",(e)=>{

touchEndX=e.changedTouches[0].screenX;

if(touchStartX<40 && touchEndX>140){
toggleSidebar(true);
}

if(touchStartX>200 && touchEndX<80){
toggleSidebar(false);
}

});

/* -------------------------
   FLOAT MENU BUTTON
------------------------- */

const btn=document.createElement("div");
btn.innerHTML="☰";

btn.style.position="fixed";
btn.style.left="12px";
btn.style.bottom="90px";
btn.style.width="46px";
btn.style.height="46px";
btn.style.borderRadius="50%";
btn.style.background="#111";
btn.style.color="#fff";
btn.style.display="flex";
btn.style.alignItems="center";
btn.style.justifyContent="center";
btn.style.fontSize="22px";
btn.style.zIndex="10000";
btn.style.boxShadow="0 4px 14px rgba(0,0,0,.35)";
btn.style.cursor="pointer";

btn.onclick=()=>toggleSidebar();

document.body.appendChild(btn);

/* -------------------------
   AUTO EXPAND PROMPT
------------------------- */

function autoExpand(){

const textarea=document.querySelector("textarea");
if(!textarea) return;

textarea.addEventListener("input",function(){

this.style.height="auto";
this.style.height=(this.scrollHeight)+"px";

});

}

setInterval(autoExpand,1500);

/* -------------------------
   IMAGE TAP ZOOM
------------------------- */

document.addEventListener("click",function(e){

const img=e.target.closest("img");
if(!img) return;

img.style.maxWidth="100%";
img.style.height="auto";

});

/* -------------------------
   SCROLL IMPROVEMENT
------------------------- */

document.body.style.webkitOverflowScrolling="touch";

/* -------------------------
   DEBUG LOG
------------------------- */

console.log("Grok Mobile Pro loaded");

// ===== FIX GROK PROJECT CREATE SHEET =====

const fixProjectModal = () => {

const style = document.createElement("style");

style.innerHTML = `

/* bottom sheet container */

[role="dialog"]{
height:calc(var(--vh)*90) !important;
max-height:90vh !important;
top:auto !important;
bottom:0 !important;
transform:none !important;
border-top-left-radius:18px;
border-top-right-radius:18px;
overflow:auto !important;
}

/* sheet content */

[role="dialog"] *{
max-height:none !important;
}

/* fix textarea */

[role="dialog"] textarea{
min-height:120px !important;
font-size:16px !important;
}

/* fix button area */

[role="dialog"] button{
min-height:44px !important;
}

/* allow scroll */

[role="dialog"]{
-webkit-overflow-scrolling:touch;
}

`;

document.head.appendChild(style);

};

setTimeout(fixProjectModal,1500);

// mobile vh fix

function setVH() {
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

})();
