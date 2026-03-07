// ==UserScript==
// @name         Grok Prompt Library
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const prompts = {

portrait:"ultra realistic portrait, 85mm lens, natural skin texture",

fashion:"fashion editorial photography, studio lighting, luxury style",

street:"candid street photography, natural lighting",

cinematic:"cinematic lighting, dramatic shadows",

selfie:"phone selfie, natural candid photo"

};

function createLibrary(){

const panel=document.createElement("div");

panel.style.position="fixed";
panel.style.left="10px";
panel.style.bottom="200px";
panel.style.width="180px";
panel.style.background="#111";
panel.style.color="#fff";
panel.style.padding="10px";
panel.style.borderRadius="10px";
panel.style.zIndex="9999";
panel.style.fontSize="12px";

Object.keys(prompts).forEach(key=>{

const btn=document.createElement("div");

btn.innerText=key;
btn.style.cursor="pointer";
btn.style.marginBottom="6px";

btn.onclick=()=>{

const textarea=document.querySelector("textarea");

if(textarea){
textarea.value += ", "+prompts[key];
}

};

panel.appendChild(btn);

});

document.body.appendChild(panel);

}

setTimeout(createLibrary,2000);

})();
