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
