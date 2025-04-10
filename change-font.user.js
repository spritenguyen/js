// ==UserScript==
// @name         Change Font Family & CSS Variable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change font family and override CSS variables on a webpage
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Specify your desired font-family here
    const newFontFamily = 'Arial';

    // Change the value of the --body-font CSS variable
    document.documentElement.style.setProperty('--body-font', newFontFamily);

    // Apply the font-family with !important to all elements
    document.querySelectorAll('*').forEach(element => {
        element.style.setProperty('font-family', newFontFamily, 'important');
    });
})();
