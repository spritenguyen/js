// ==UserScript==
// @name         YouTube H.264
// @namespace    https://www.youtube.com
// @version      1.3.3
// @description  Clone of h264ify with optional limit up to 30 FPS.
// @description:ru Клон h264ify с опциональным ограничением до 30 FPS.
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    const DISALLOWED_TYPES_REGEX = /webm|vp8|vp9|av01/i;

    function overrideIsTypeSupported() {
        const originalIsTypeSupported = MediaSource.isTypeSupported.bind(MediaSource);

        MediaSource.isTypeSupported = (type) => {
            if (typeof type !== 'string') return false;

            // Block disallowed types
            if (DISALLOWED_TYPES_REGEX.test(type)) return false;

            return originalIsTypeSupported(type);
        };
    }

    function blockMediaSourceExtensions() {
        const originalIsTypeSupported = window.MediaSource.isTypeSupported;
        window.MediaSource.isTypeSupported = function(type) {
            if (DISALLOWED_TYPES_REGEX.test(type)) {
                return false;
            }
            return originalIsTypeSupported.apply(this, arguments);
        };

        if ('SourceBuffer' in window) {
            const originalIsTypeSupported = window.SourceBuffer.prototype.appendBuffer;
            window.SourceBuffer.prototype.appendBuffer = function(data) {
                const type = this.mimeType;
                if (DISALLOWED_TYPES_REGEX.test(type)) {
                    throw new Error('Disallowed type');
                }
                return originalIsTypeSupported.apply(this, arguments);
            };
        }
    }

    overrideIsTypeSupported();
    blockMediaSourceExtensions();
})();
