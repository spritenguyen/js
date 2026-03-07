// ==UserScript==
// @name         Grok Prompt Template Engine
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const template =

"{subject}, {style}, ultra realistic photo, natural skin texture, 50mm lens";

function createUI(){

const box=document.createElement("div");

box.style.position="fixed";
box.style.right="10px";
box.style.bottom="260px";
box.style.background="#111";
box.style.color="#fff";
box.style.padding="10px";
box.style.borderRadius="10px";
box.style.fontSize="12px";
box.style.zIndex="9999";

const btn=document.createElement("button");

btn.innerText="Template";

btn.onclick=()=>{

const subject=prompt("Subject?");
const style=prompt("Style?");

if(!subject||!style) return;

const textarea=document.querySelector("textarea");

if(textarea){

textarea.value = template
.replace("{subject}",subject)
.replace("{style}",style);

}

};

box.appendChild(btn);

document.body.appendChild(box);

}

setTimeout(createUI,2000);

})();
