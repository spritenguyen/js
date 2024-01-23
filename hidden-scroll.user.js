// ==UserScript==
// @name          scrollbar
// @namespace   SpriteNguyen
// @match       *://*/*
// @version        0.1
// @description   23/1/2024
// @author         zNDB
// @run-at          document-start
// @icon        https://e7.pngegg.com/pngimages/247/169/png-clipart-high-heeled-shoe-supermodel-scary-beautiful-model-celebrities-fashion.png
// ==/UserScript==
(function() {

var css = ["html {scrollbar-width: none !important;}"].join("\n");

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
