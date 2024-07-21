// ==UserScript==
// @name                 Voz
// @namespace            Voz
// @version              1.3
// @description          
// @author               me
// @run-at               document-start
// @match                http*://voz.vn/*
// ==/UserScript==
(function(){
var css = [".message-body,html,htmlbutton,input,optgroup,select,textarea,.fr-box.fr-basic .fr-element{font-size:18px !important;}"].join("\n");
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
