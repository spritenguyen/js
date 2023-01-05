// ==UserScript==
// @name          Font family
// @namespace SpriteNguyen
// @match      *://*/*
// @version        0.1
// @description 05/01/2023
// @author         zNDB
// @run-at          document-start
// @icon        https://e7.pngegg.com/pngimages/247/169/png-clipart-high-heeled-shoe-supermodel-scary-beautiful-model-celebrities-fashion.png
// ==/UserScript==
(function() {

var css = ["@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap'); *{font-family: 'Poppins', sans-serif !important;}"].join("\n");
  //https://fonts.google.com/specimen/Poppins link font chu

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
