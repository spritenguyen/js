// ==UserScript==
// @name         YouTube Custom Click Prevention
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Prevent pausing YouTube video on any click
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to disable click event
    function disableClick(event) {
        if (event.target.tagName.toLowerCase() === 'video') {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // Attach the disableClick function to the click event of the document
    document.addEventListener('click', disableClick, true);
})();
