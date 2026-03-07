// ==UserScript==
// @name         Grok Prompt Auto Expand
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

function expand(){

const textarea=document.querySelector("textarea");

if(!textarea) return;

textarea.style.minHeight="80px";

textarea.addEventListener("input",function(){

this.style.height="auto";
this.style.height=this.scrollHeight+"px";

});

}

setInterval(expand,1500);

})();
