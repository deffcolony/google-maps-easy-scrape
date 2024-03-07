const ext_ver = $('#ext-ver');
// dom loaded
document.addEventListener('DOMContentLoaded', function() {
    // get buttons with class "url-button"
    const urlButtons = document.querySelectorAll('.url-button');
    // loop through buttonsconst ext_ver = $('#ext-ver');
    ext_ver.text(`Version: ${chrome.runtime.getManifest().version}`);

    urlButtons.forEach(function(button) {
        // get the url from the button's data-url attribute
        const url = button.getAttribute('data-url');
        // add event listener to each button
        button.addEventListener('click', function() {
            // open the url in a new tab
            u(url);
        });
        // middle click
        button.addEventListener('auxclick', function(event) {
            if (event.button === 1) {
                u(url);
            }
        });
    });
});

function getButtonGroup(id) {
    const buttonGroup = document.getElementById(id);
    // list buttons
    const buttons = buttonGroup.querySelectorAll('.item');
    return buttons;
}

function u(url) {
    if (url == null) return;

    const ops = {
        action: 'openUrl',
        url: url,
    }
    // href
    window.parent.postMessage(ops, '*');
}