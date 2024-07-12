// ==UserScript==
// @run-at                      document-start
// @name                       Bing to Google
// @namespace          Bing to Google
// @description           This will redirect you to Google from Bing after you search.
// @include                   https://*.bing.com/search?*
// @exclude                  https://www.bing.com/search?q=Bing+AI&showconv=1
// @version                   1.0
// @grant                        none
// @icon                         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// ==/UserScript==

var newurl = "https://google.com/search?"+document.URL.match(/q\=[^&]*/);
if (newurl != document.URL) location.replace(newurl);

