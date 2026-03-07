// ==UserScript==
// @name         Grok Copy Code Button
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

function addCopy(){

document.querySelectorAll("pre").forEach(pre=>{

if(pre.querySelector(".copyBtn")) return;

const btn=document.createElement("button");

btn.innerText="Copy";

btn.className="copyBtn";

btn.style.position="absolute";
btn.style.right="8px";
btn.style.top="8px";
btn.style.fontSize="12px";

btn.onclick=()=>{

navigator.clipboard.writeText(pre.innerText);

btn.innerText="Copied";

setTimeout(()=>btn.innerText="Copy",1200);

};

pre.style.position="relative";
pre.appendChild(btn);

});

}

setInterval(addCopy,2000);

})();
