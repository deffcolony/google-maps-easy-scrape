function getBrowserTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

var options = {
    theme: getBrowserTheme(),
    language: 'en'
};

function setTheme(theme) {
    document.body.setAttribute('theme', theme);
}

function saveOptions(opts) {
    chrome.storage.local.set({ data: opts }).then(function() {
        console.log('Options saved', opts);
    });
}

function getOptions() {
    try {
        chrome.storage.local.get("data", function
        (items) {
            console.log('Options retrieved', items);
            options = items;
        });
        // apply
        setTheme(options.theme);
    } catch (e) {
        console.error(e);
    }
    return options;
}

// dom loaded
document.addEventListener('DOMContentLoaded', function() {
    document.body.setAttribute('theme', getBrowserTheme());

    // get options
    getOptions();

    // get buttons with class "url-button"
    const urlButtons = document.querySelectorAll('.url-button');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
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

        getButtonGroup('themeSelect').forEach(function(button) {
            button.addEventListener('click', function() {
                // remove active class from all buttons
                getButtonGroup('themeSelect').forEach(function(button) {
                    button.classList.remove('active');
                });

                const theme = button.getAttribute('data-theme');
                document.body.setAttribute('theme', theme);
                button.classList.add('active');

                if (theme == "system") {
                    document.body.setAttribute('theme', getBrowserTheme());
                }
            });
        });
    });

    saveSettingsButton.addEventListener('click', function() {
        const theme = document.body.getAttribute('theme');
        saveOptions({theme: theme});
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