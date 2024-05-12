// ==UserScript==
// @name        YouTube Background Playback - Kiwi Browser
// @namespace   Kiwi Browser Userscript
// @match       *://*.youtube.com/*
// @match       *://*.youtube-nocookie.com/*
// @grant       none
// @version     1.0
// @run-at      document-end
// @author      -
// @description Enable YouTube background playback in Kiwi
// @downloadURL https://update.greasyfork.org/scripts/437123/YouTube%20Background%20Playback%20-%20Kiwi%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/437123/YouTube%20Background%20Playback%20-%20Kiwi%20Browser.meta.js
// ==/UserScript==

'use strict';				   
const lactRefreshInterval = 5 * 60 * 1000; // 5 mins
const initialLactDelay = 1000;


// Page Visibility API
Object.defineProperties(document, { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);

// _lact stuff
function waitForYoutubeLactInit(delay = initialLactDelay) {
  if (window.hasOwnProperty('_lact')) { 
	window.setInterval(() => { window._lact = Date.now(); }, lactRefreshInterval); 
  }
  else{ 
    window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay); 
  }

}

waitForYoutubeLactInit();