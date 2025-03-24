// ==UserScript==
// @name         Notify Network Country Improved
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Notify the country of the current network connection in a subtle way
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a small notification box
    const notifyBox = document.createElement('div');
    notifyBox.style.position = 'fixed';
    notifyBox.style.bottom = '10px';
    notifyBox.style.right = '10px';
    notifyBox.style.padding = '10px 15px';
    notifyBox.style.backgroundColor = '#333';
    notifyBox.style.color = '#fff';
    notifyBox.style.borderRadius = '5px';
    notifyBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    notifyBox.style.fontSize = '14px';
    notifyBox.style.zIndex = '10000';
    notifyBox.style.display = 'none'; // Initially hidden
    document.body.appendChild(notifyBox);

    // Fetch country data
    fetch('https://ipwhois.app/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.country) {
                notifyBox.innerText = `Connected to: ${data.country}`;
                notifyBox.style.display = 'block'; // Show the box

                // Automatically hide after 5 seconds
                setTimeout(() => {
                    notifyBox.style.display = 'none';
                }, 5000);
            } else {
                console.error('Unable to fetch country information.');
            }
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
})();
