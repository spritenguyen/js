// ==UserScript==
// @name          Font family
// @namespace SpriteNguyen
// @match      *://*/*
// @exclude     *://biphims.*/*
// @version        0.2.1.3
// @description 05/01/2023
// @author         zNDB
// @run-at          document-start
// @icon        https://e7.pngegg.com/pngimages/247/169/png-clipart-high-heeled-shoe-supermodel-scary-beautiful-model-celebrities-fashion.png
// ==/UserScript==
(function() {

//var css = ["@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&family=Quicksand:wght@500&display=swap'); a,p,.bbWrapper{font-family: 'Quicksand', sans-serif !important;}"].join("\n");
  //https://fonts.google.com/specimen/Poppins link font chu
var css = ["@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); a,p,h1,h2,h3,html{font-family: 'Be Vietnam Pro', sans-serif !important;}"].join("\n");

if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();
