// ==UserScript==
// @name         Instagram Image Downloader
// @namespace    https://your-namespace-here
// @version      1.0
// @description  Download images from Instagram posts
// @author       ndb1987
// @match        https://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // Get the post element
    let post = document.querySelector("article");

    // Check if the post element exists
    if (post) {
        // Get the image element
        let img = post.querySelector("img");

        // Check if the image element exists
        if (img) {
            // Get the image source
            let src = img.src;

            // Check if the image source is valid
            if (src) {
                // Create a download button
                let btn = document.createElement("button");
                btn.textContent = "Download";
                btn.style.position = "absolute";
                btn.style.top = "10px";
                btn.style.right = "10px";
                btn.style.zIndex = "9999";

                // Add a click event listener to the button
                btn.addEventListener("click", function() {
                    // Use GM_xmlhttpRequest to get the image data
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: src,
                        responseType: "blob",
                        onload: function(response) {
                            // Use GM_download to save the image data
                            GM_download({
                                url: URL.createObjectURL(response.response),
                                name: src.split("/").pop(),
                                saveAs: true
                            });
                        }
                    });
                });

                // Append the button to the post element
                post.appendChild(btn);
            }
        }
    }
})();
