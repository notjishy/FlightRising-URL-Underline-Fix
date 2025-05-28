if (typeof browser === 'undefined') {
    browser = chrome
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the toggle checkboxes and status texts
    const removeUnderlines = document.getElementById('removeUnderlines');
    const hoverUnderlines = document.getElementById('hoverUnderlines');
    const removeStatus = document.getElementById('removeStatus');
    const hoverStatus = document.getElementById('hoverStatus');
    const colorSelect = document.getElementById('color-select')
    const customColor = document.getElementById('custom-color')

    // Function to update status text
    function updateStatus(element, enabled) {
        element.textContent = enabled ? "Enabled" : "Disabled";
        element.style.color = enabled ? "#2e8b57" : "#d9534f";
    }

    // Load saved settings
    const settings = ['removeUnderlines', 'hoverUnderlines', 'colorSetting', 'customColor'];
    chrome.storage.sync.get(settings, function(data) {
        // Default removeUnderlines to true if not set
        const removeEnabled = data.removeUnderlines !== false;
        removeUnderlines.checked = removeEnabled;
        updateStatus(removeStatus, removeEnabled);

        // Default hoverUnderlines to false if not set
        const hoverEnabled = data.hoverUnderlines === true;
        hoverUnderlines.checked = hoverEnabled;
        updateStatus(hoverStatus, hoverEnabled);

        // Load color setting
        colorSelect.value = data.colorSetting || 'default';
        customColor.value = data.customColor || '#000000';

        customColor.style.display = colorSelect.value === 'custom' ? 'block' : 'none';
    });

    // Save color selection when changed
    colorSelect.addEventListener('change', function() {
        chrome.storage.sync.set({
            'colorSetting': colorSelect.value
        });

        customColor.style.display = colorSelect.value === 'custom' ? 'block' : 'none';
    });

    // Handle custom color changes
    customColor.addEventListener('input', function() {
        chrome.storage.sync.set({
            'customColor': customColor.value
        });
    });

    // Handle remove underlines toggle
    removeUnderlines.addEventListener('change', function() {
        const enabled = removeUnderlines.checked;
        chrome.storage.sync.set({
            'removeUnderlines': enabled
        });
        updateStatus(removeStatus, enabled);

        // If turning on remove underlines, disable hover underlines
        if (enabled && hoverUnderlines.checked) {
            hoverUnderlines.checked = false;
            chrome.storage.sync.set({
                'hoverUnderlines': false
            });
            updateStatus(hoverStatus, false);
        }
    });

    // Handle hover underlines toggle
    hoverUnderlines.addEventListener('change', function() {
        const enabled = hoverUnderlines.checked;
        chrome.storage.sync.set({
            'hoverUnderlines': enabled
        });
        updateStatus(hoverStatus, enabled);

        // If turning on hover underlines, disable remove underlines
        if (enabled && removeUnderlines.checked) {
            removeUnderlines.checked = false;
            chrome.storage.sync.set({
                'removeUnderlines': false
            });
            updateStatus(removeStatus, false);
        }
    });
});
