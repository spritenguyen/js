// ==UserScript==
// @name         Grok Image Seed Reuse
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

let lastPrompt="";

function capturePrompt(){

const textarea=document.querySelector("textarea");

if(!textarea) return;

textarea.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){
lastPrompt=textarea.value;
}

});

}

function createButton(){

const btn=document.createElement("button");

btn.innerText="Reuse";

btn.style.position="fixed";
btn.style.right="10px";
btn.style.bottom="140px";
btn.style.zIndex="9999";

btn.onclick=()=>{

const textarea=document.querySelector("textarea");

if(textarea && lastPrompt){
textarea.value=lastPrompt;
}

};

document.body.appendChild(btn);

}

setTimeout(capturePrompt,1500);
setTimeout(createButton,2000);

})();
