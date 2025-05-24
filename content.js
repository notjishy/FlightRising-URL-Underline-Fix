(function() {
    console.log("Flight Rising URL Fixer is running!");

    let removeUnderlines = true; // Default settings
    let hoverUnderlines = false;

    // Create a style element for our CSS
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    // Check if the site uses spans inside .bbcode_url elements
    function detectSpanUsage() {
        const bbcodeUrls = document.querySelectorAll('.bbcode_url');
        if (bbcodeUrls.length === 0) return false;

        // Check a sample of links to see if they use spans for text
        let spansFound = 0;

        for (let i = 0; i < Math.min(10, bbcodeUrls.length); i++) {
            if (bbcodeUrls[i].querySelector('span')) {
                spansFound++;
            }
        }

        // If more than half of the sampled links have spans, assume spans are used
        return spansFound > Math.min(5, bbcodeUrls.length / 2);
    }

    // Apply settings
    function applySettings() {
        const usesSpans = detectSpanUsage();
        console.log("Site uses spans in .bbcode_url:", usesSpans);

        if (removeUnderlines) {
            if (usesSpans) {
                styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url span {
                        text-decoration: none !important;
                    }
                `;
            } else {
                styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                `;
            }
        } else if (hoverUnderlines) {
            if (usesSpans) {
                styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url span {
                        text-decoration: none !important;
                    }
                    .bbcode_url:hover span {
                        text-decoration: underline !important;
                    }
                `;
            } else {
                styleElement.textContent = `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url:hover {
                        text-decoration: underline !important;
                    }
                `;
            }
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

                    if (usesSpans) {
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
                    } else if (hoverUnderlines) {
                        // Add hover event listeners for the element itself
                        element.addEventListener('mouseenter', () => {
                            element.style.textDecoration = 'underline';
                        });

                        element.addEventListener('mouseleave', () => {
                            element.style.textDecoration = 'none';
                        });
                    }
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
