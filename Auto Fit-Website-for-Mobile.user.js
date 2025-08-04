// ==UserScript==
// @name         Auto Fit Website for Mobile
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adjust website layout for mobile screens
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to fit the website to the mobile screen
    function fitWebsiteForMobile() {
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0';
        document.getElementsByTagName('head')[0].appendChild(viewportMeta);

        document.body.style.maxWidth = '100%';
        document.body.style.width = '100%';
        document.body.style.overflowX = 'hidden';
    }

    // Run the function on page load
    window.addEventListener('load', fitWebsiteForMobile);
})();
