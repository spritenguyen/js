// ==UserScript==
// @name         Optimized Capture and Save Video Helper
// @namespace    https://example.com
// @version      1.4
// @description  Adds buttons to capture screenshots, save video, and manage active domains efficiently.
// @author       YourName
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // Initialize the domain list with default domain "google.com" if not already set
    const defaultDomains = ["google.com"];
    const savedDomains = GM_getValue("domains", []);
    if (savedDomains.length === 0) {
        GM_setValue("domains", defaultDomains);
    }
    const domainList = GM_getValue("domains", []);

    // Get the current domain
    const currentDomain = window.location.hostname;

    // Check if the current domain is in the active list
    if (!domainList.includes(currentDomain)) {
        return; // Stop execution if the domain is not in the list
    }

    // Create buttons for screenshot and video saving
    const captureButton = document.createElement('button');
    captureButton.innerText = "Capture Screenshot";
    styleButton(captureButton, "10px");

    const saveVideoButton = document.createElement('button');
    saveVideoButton.innerText = "Start/Stop Saving Video";
    styleButton(saveVideoButton, "50px");

    const toggleDomainButton = document.createElement('button');
    toggleDomainButton.innerText = "Manage Domains";
    styleButton(toggleDomainButton, "90px");

    // Append buttons to body
    document.body.appendChild(captureButton);
    document.body.appendChild(saveVideoButton);
    document.body.appendChild(toggleDomainButton);

    // Add domain manager container (hidden by default)
    const domainManager = document.createElement('div');
    domainManager.style.position = "fixed";
    domainManager.style.bottom = "140px";
    domainManager.style.left = "10px";
    domainManager.style.zIndex = "9999";
    domainManager.style.backgroundColor = "#ffffff";
    domainManager.style.color = "#000";
    domainManager.style.border = "1px solid #ccc";
    domainManager.style.padding = "10px";
    domainManager.style.display = "none";

    const domainInput = document.createElement('input');
    domainInput.placeholder = "Enter domain...";
    const addDomainButton = document.createElement('button');
    addDomainButton.innerText = "Add Domain";
    const domainListDisplay = document.createElement('ul');

    domainManager.appendChild(domainInput);
    domainManager.appendChild(addDomainButton);
    domainManager.appendChild(domainListDisplay);

    document.body.appendChild(domainManager);

    // Show/hide domain manager
    toggleDomainButton.addEventListener('click', () => {
        domainManager.style.display = domainManager.style.display === "none" ? "block" : "none";
    });

    // Add domain functionality
    addDomainButton.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (domain && !domainList.includes(domain)) {
            domainList.push(domain);
            GM_setValue("domains", domainList);
            updateDomainListDisplay();
            domainInput.value = "";
            alert(`Domain "${domain}" has been added.`);
        }
    });

    // Display domain list
    function updateDomainListDisplay() {
        domainListDisplay.innerHTML = "";
        domainList.forEach(domain => {
            const listItem = document.createElement('li');
            listItem.innerText = domain;
            domainListDisplay.appendChild(listItem);
        });
    }

    // Initialize domain list display
    updateDomainListDisplay();

    // Functionality for screenshot capture
    captureButton.addEventListener('click', () => {
        const video = document.querySelector('video');
        if (video) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const screenshot = canvas.toDataURL('image/png');
                GM_download(screenshot, `screenshot_${Date.now()}.png`);
                alert('Screenshot captured successfully!');
            } catch (error) {
                alert('Failed to capture screenshot. Error: ' + error.message);
            }
        } else {
            alert('No video found on the page!');
        }
    });

    // Functionality for video saving
    let recording = false;
    let mediaRecorder;
    let recordedChunks = [];
    saveVideoButton.addEventListener('click', () => {
        const video = document.querySelector('video');
        if (video) {
            try {
                if (!recording) {
                    const stream = video.captureStream();
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (event) => {
                        recordedChunks.push(event.data);
                    };
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        GM_download(URL.createObjectURL(blob), `video_${Date.now()}.webm`);
                        recordedChunks = [];
                        alert('Video saved successfully!');
                    };
                    mediaRecorder.start();
                    recording = true;
                    saveVideoButton.innerText = "Stop Saving Video";
                } else {
                    mediaRecorder.stop();
                    recording = false;
                    saveVideoButton.innerText = "Start Saving Video";
                }
            } catch (error) {
                alert('Failed to save video. Error: ' + error.message);
            }
        } else {
            alert('No video found on the page!');
        }
    });

    // Style buttons
    function styleButton(button, bottomPosition) {
        button.style.position = "fixed";
        button.style.bottom = bottomPosition;
        button.style.left = "10px";
        button.style.zIndex = "9999";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "10px";
        button.style.cursor = "pointer";
    }
})();
