// ==UserScript==
// @name         Grok Layout Width Fix
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const style=document.createElement("style");

style.innerHTML=`

html,body{
max-width:100vw!important;
overflow-x:hidden!important;
}

main{
width:100%!important;
max-width:100%!important;
padding:10px!important;
}

.message{
max-width:100%!important;
}

img{
max-width:100%!important;
height:auto!important;
}

`;

document.head.appendChild(style);

})();
