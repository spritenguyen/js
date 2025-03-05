// ==UserScript==
// @name         Auto Fit youtube for Mobile
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adjust website layout for mobile screens and hide recommended channels
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to fit the website to the mobile screen
    function fitWebsiteForMobile() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(viewportMeta);
        }

        document.body.style.maxWidth = '100%';
        document.body.style.width = '100%';
        document.body.style.overflowX = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        const videoContainer = document.getElementById('player-container');
        if (videoContainer) {
            videoContainer.style.maxWidth = '100%';
            videoContainer.style.width = '100%';
        }

        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
            el.style.maxWidth = '100%';
            el.style.boxSizing = 'border-box';
        });
    }

    // Function to remove the "Recommended channels" section
    function removeRecommendedChannels() {
        const recommendedSection = document.querySelector('#secondary #related'); // Adjust selector for specific YouTube layout
        if (recommendedSection) {
            recommendedSection.style.display = 'none';
        }
    }

    // Run functions on page load
    window.addEventListener('load', () => {
        fitWebsiteForMobile();
        removeRecommendedChannels();
    });
})();
