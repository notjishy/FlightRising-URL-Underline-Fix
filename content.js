(function() {
    console.log("Flight Rising URL Fixer is running!");

    let removeUnderlines = true; // Default settings
    let hoverUnderlines = false;

    // Create a style element for our CSS
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    // Apply settings
    function applySettings() {
        if (removeUnderlines) {
            styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url span {
                        text-decoration: none !important;
                    }
                `;
        } else if (hoverUnderlines) {
            styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url:hover {
                        text-decoration: underline !important;
                    }
                    .bbcode_url span {
                        text-decoration: none !important;
                    }
                    .bbcode_url:hover span {
                        text-decoration: underline !important;
                    }
                `;
        } else {
            // Reset to default (empty styles)
            styleElement.textContent = '';
        }

        // Apply inline styles to existing elements
        const bbcodeUrls = document.querySelectorAll('.bbcode_url');

        if (bbcodeUrls.length > 0) {
            console.log(`Applying settings to ${bbcodeUrls.length} .bbcode_url elements`);

            bbcodeUrls.forEach((element) => {
                if (removeUnderlines || hoverUnderlines) {
                    element.style.textDecoration = 'none';

                    const spans = element.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.textDecoration = 'none';

                        // Add hover event listeners for spans if needed
                        if (hoverUnderlines) {
                            element.addEventListener('mouseenter', () => {
                                span.style.textDecoration = 'underline';
                            });

                            element.addEventListener('mouseleave', () => {
                                span.style.textDecoration = 'none';
                            });
                        }
                    });

                    // Add hover event listeners for the element itself
                    element.addEventListener('mouseenter', () => {
                        element.style.textDecoration = 'underline';
                    });

                    element.addEventListener('mouseleave', () => {
                        element.style.textDecoration = 'none';
                    });
                } else {
                    // Reset to default
                    element.style.textDecoration = '';

                    if (usesSpans) {
                        const spans = element.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.textDecoration = '';
                        });
                    }

                    // Remove any event listeners (not directly possible, but will be overridden)
                }
            });
        }
    }

    // Check settings on load
    chrome.storage.sync.get(['removeUnderlines', 'hoverUnderlines'], function(data) {
        removeUnderlines = data.removeUnderlines !== false;
        hoverUnderlines = data.hoverUnderlines === true;

        // Ensure only one setting is active
        if (removeUnderlines && hoverUnderlines) {
            removeUnderlines = true;
            hoverUnderlines = false;
        }

        applySettings();
    });

    // Listen for setting changes
    chrome.storage.onChanged.addListener(function(changes) {
        if (changes.removeUnderlines) {
            removeUnderlines = changes.removeUnderlines.newValue;
        }

        if (changes.hoverUnderlines) {
            hoverUnderlines = changes.hoverUnderlines.newValue;
        }

        console.log("Settings changed - Remove:", removeUnderlines, "Hover:", hoverUnderlines);
        applySettings();
    });

    // Watch for DOM changes
    const observer = new MutationObserver(function() {
        applySettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
