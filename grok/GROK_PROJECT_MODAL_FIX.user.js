// ==UserScript==
// @name         Grok Project Modal Fix
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const style=document.createElement("style");

style.innerHTML=`

[role="dialog"]{
height:calc(var(--vh)*90)!important;
max-height:calc(var(--vh)*90)!important;
bottom:0!important;
top:auto!important;
overflow:auto!important;
border-radius:18px 18px 0 0;
}

[role="dialog"] textarea{
min-height:120px!important;
font-size:16px!important;
}

`;

document.head.appendChild(style);

})();
