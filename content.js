if (typeof browser === 'undefined') {
    browser = chrome
}

(function () {
    console.log("Flight Rising URL Fixer is running!");

    let colorSetting
    let customColor
    let removeUnderlines = true; // Default settings
    let hoverUnderlines = false;

    // Create a style element for our CSS
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    // Apply settings
    function applySettings() {
        let css = '';

        if (removeUnderlines) {
            css += `
                    .bbcode_url {
                        text-decoration: none !important;
                    }
                    .bbcode_url span {
                        text-decoration: none !important;
                    }
                `;
        } else if (hoverUnderlines) {
            css += `
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

        // Apply color settings
        switch (colorSetting) {
            case 'old':
                css += `
                    .bbcode_url {
                        color: #b0734f !important;
                    }
                `;
                break;
            case 'custom':
                css += `
                    .bbcode_url {
                        color: ${customColor} !important;
                    }
                `;
                break;
        }

        styleElement.textContent = css;
    }

    // Check settings on load
    const settings = ['removeUnderlines', 'hoverUnderlines', 'colorSetting', 'customColor'];
    browser.storage.sync.get(settings).then(function (data) {
        removeUnderlines = data.removeUnderlines !== false;
        hoverUnderlines = data.hoverUnderlines === true;
        colorSetting = data.colorSetting || 'default';
        customColor = data.customColor || '#000000';

        // Ensure only one setting is active
        if (removeUnderlines && hoverUnderlines) {
            removeUnderlines = true;
            hoverUnderlines = false;
        }

        applySettings();
    });

    // Listen for setting changes
    browser.storage.onChanged.addListener(async (changes) => {
        if (changes.removeUnderlines?.newValue !== undefined) {
            removeUnderlines = changes.removeUnderlines.newValue;
        }

        if (changes.hoverUnderlines?.newValue !== undefined) {
            hoverUnderlines = changes.hoverUnderlines.newValue;
        }

        if (changes.colorSetting?.newValue !== undefined) {
            colorSetting = changes.colorSetting.newValue;
        }

        if (changes.customColor?.newValue !== undefined) {
            customColor = changes.customColor.newValue;
        }

        console.log("Settings changed - Remove:", removeUnderlines, "Hover:", hoverUnderlines);
        applySettings();
    });

    // Watch for DOM changes
    const observer = new MutationObserver(function () {
        applySettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
