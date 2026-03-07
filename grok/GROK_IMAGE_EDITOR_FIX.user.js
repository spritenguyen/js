// ==UserScript==
// @name         Grok Image Editor Fix
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const style=document.createElement("style");

style.innerHTML=`

img{
max-height:65vh!important;
object-fit:contain!important;
margin:auto!important;
display:block;
}

textarea{
min-height:80px!important;
font-size:16px!important;
}

form{
position:fixed!important;
bottom:0;
width:100%;
}

`;

document.head.appendChild(style);

})();
