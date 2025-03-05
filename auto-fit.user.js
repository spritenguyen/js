// ==UserScript==
// @name         Auto Fit youtube for Mobile
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adjust website layout for mobile screens
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to fit the website to the mobile screen
    function fitWebsiteForMobile() {
        // Set viewport meta for mobile compatibility
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(viewportMeta);
        }

        // Adjust body styling for a mobile-friendly layout
        document.body.style.maxWidth = '100%';
        document.body.style.width = '100%';
        document.body.style.overflowX = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        // Make YouTube video container responsive
        const videoContainer = document.getElementById('player-container');
        if (videoContainer) {
            videoContainer.style.maxWidth = '100%';
            videoContainer.style.width = '100%';
        }

        // Ensure images and other elements fit within the viewport
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
            el.style.maxWidth = '100%';
            el.style.boxSizing = 'border-box';
        });
    }

    // Run the function on page load
    window.addEventListener('load', fitWebsiteForMobile);
})();
