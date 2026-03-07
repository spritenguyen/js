// ==UserScript==
// @name         Grok Quick Style Buttons
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const styles=[

"cinematic lighting, ultra realistic photo",

"natural candid photography, unretouched skin",

"studio portrait lighting, 85mm lens",

"street photography, raw realism",

"fashion editorial photography"

];

function createButtons(){

const bar=document.createElement("div");

bar.style.position="fixed";
bar.style.left="50%";
bar.style.bottom="160px";
bar.style.transform="translateX(-50%)";
bar.style.display="flex";
bar.style.gap="6px";
bar.style.zIndex="9999";

styles.forEach(style=>{

const btn=document.createElement("button");

btn.innerText="style";

btn.style.fontSize="11px";

btn.onclick=()=>{

const textarea=document.querySelector("textarea");

if(!textarea) return;

textarea.value += ", "+style;

};

bar.appendChild(btn);

});

document.body.appendChild(bar);

}

setTimeout(createButtons,2000);

})();
