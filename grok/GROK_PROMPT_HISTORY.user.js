// ==UserScript==
// @name         Grok Prompt History
// @match        https://grok.com/*
// @grant        none
// ==/UserScript==

(function(){

const STORAGE_KEY="grok_prompt_history";

function getHistory(){
return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
}

function saveHistory(list){
localStorage.setItem(STORAGE_KEY,JSON.stringify(list.slice(-30)));
}

function capturePrompt(){

const textarea=document.querySelector("textarea");

if(!textarea) return;

textarea.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

let history=getHistory();
history.push(textarea.value.trim());
saveHistory(history);

}

});

}

function createPanel(){

const panel=document.createElement("div");

panel.style.position="fixed";
panel.style.right="10px";
panel.style.bottom="200px";
panel.style.width="220px";
panel.style.maxHeight="240px";
panel.style.overflow="auto";
panel.style.background="#111";
panel.style.color="#fff";
panel.style.padding="8px";
panel.style.borderRadius="12px";
panel.style.fontSize="12px";
panel.style.zIndex="9999";

document.body.appendChild(panel);

function refresh(){

panel.innerHTML="Prompt history<br><br>";

getHistory().reverse().forEach(p=>{

const item=document.createElement("div");

item.innerText=p.slice(0,60);
item.style.marginBottom="6px";
item.style.cursor="pointer";

item.onclick=()=>{
const textarea=document.querySelector("textarea");
if(textarea) textarea.value=p;
};

panel.appendChild(item);

});

}

setInterval(refresh,3000);

}

setTimeout(capturePrompt,1500);
setTimeout(createPanel,2000);

})();
