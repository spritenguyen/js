// ==UserScript==
// @name                 Voz BeVietnam Font
// @namespace            Voz BeVietnam Font
// @version              1.1
// @description          Rollback old Voz font
// @author               Fioren
// @run-at               document-start
// @include              http*://voz.vn/*
// @downloadURL https://raw.githubusercontent.com/FiorenMas/Userscripts/release/release/Voz20BeVietnam20Font.user.js
// @updateURL https://raw.githubusercontent.com/FiorenMas/Userscripts/release/release/Voz20BeVietnam20Font.meta.js
// ==/UserScript==
function(){
var css = [.message-body,html,htmlbutton,input,optgroup,select,textarea,.fr-box.fr-basic .fr-element{","font-color:'red' !important","}"].join("\n");
if("undefined"!=typeof GM_addStyle)GM_addStyle(e);else if("undefined"!=typeof PRO_addStyle)PRO_addStyle(e);else if("undefined"!=typeof addStyle)addStyle(e);else{var t=document.createElement("style");t.type="text/css",t.appendChild(document.createTextNode(e));var n=document.getElementsByTagName("head");n.length>0?n[0].appendChild(t):document.documentElement.appendChild(t)}}();
