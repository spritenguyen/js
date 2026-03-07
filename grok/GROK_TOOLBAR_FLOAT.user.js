// ==UserScript==
// @name         Grok Floating Toolbar
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const style=document.createElement("style");

style.innerHTML=`

div:has(button span){
position:fixed!important;
bottom:140px!important;
left:50%!important;
transform:translateX(-50%);
display:flex!important;
gap:10px;
padding:6px 10px;
border-radius:18px;
}

`;

document.head.appendChild(style);

})();
