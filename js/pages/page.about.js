// dom loaded
document.addEventListener('DOMContentLoaded', function() {
    // get buttons with class "url-button"
    const urlButtons = document.querySelectorAll('.url-button');
    // loop through buttons
    urlButtons.forEach(function(button) {
        // get the url from the button's data-url attribute
        const url = button.getAttribute('data-url');
        // add event listener to each button
        button.addEventListener('click', function() {
            // open the url in a new tab
            openUrl(url);
        });
        // middle click
        button.addEventListener('auxclick', function(event) {
            if (event.button === 1) {
                openUrl(url, true);
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

function openUrl(url, newTab = false) {
    if (url == null) return;
    // href
    if (url.includes('http')) {
        if (newTab) {
            window.open(url, '_blank');
        } else {
            document.location.href = url;
        }
    }
    // chrome
    else {
        chrome.tabs.create({url: url});
    }
}