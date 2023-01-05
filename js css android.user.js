// ==UserScript==
// @name          style text
// @namespace SpriteNguyen
// @match      *://*/*
// @exclude     *://listenaminute.com/*
// @exclude     *://docsach24.co/*
// @exclude     *://truyenful.vn/*
// @version        0.3
// @description 26/12/2022
// @author         zNDB
// @run-at          document-start
// @icon        https://e7.pngegg.com/pngimages/247/169/png-clipart-high-heeled-shoe-supermodel-scary-beautiful-model-celebrities-fashion.png
// ==/UserScript==
(function() {

var css = ["p,.bbWrapper,.js-expandContent.bbCodeBlock-expandContent{font-size: 22px !important; color:#C0C0C0;} a{color:#C0C0C0 !important;} .link{color:red !important;} /*voz.vn*/.bbCodeBlock-expandContent,.fauxBlockLink-blockLink{font-size:17px;} .node-extra-title{font-size:18px !important;} .js-nodeMain.node-main > .node-title,.structItem-cell--main.structItem-cell > .structItem-title{font-size:20px;} .userTitle,.message-inner > .message-cell--main.message-cell > .js-quickEditTarget.message-main > .js-messageContent.message-content > .message-signature > .bbWrapper{font-size:13px} /*just vnexpress.net*/.content-comment > .full_content,.title-detail,/*just dantri.com.vn*/.e-magazine__title,.detail.title-page{color:#C0C0C0 !important; font-size:22px;}"].join("\n");

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
