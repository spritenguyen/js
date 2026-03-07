// ==UserScript==
// @name         Grok Floating Menu Button
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const btn=document.createElement("div");

btn.innerHTML="☰";

btn.style.position="fixed";
btn.style.top="120px";
btn.style.left="12px";
btn.style.width="46px";
btn.style.height="46px";
btn.style.borderRadius="50%";
btn.style.background="#111";
btn.style.color="#fff";
btn.style.display="flex";
btn.style.alignItems="center";
btn.style.justifyContent="center";
btn.style.fontSize="22px";
btn.style.zIndex="9999";

document.body.appendChild(btn);

})();
