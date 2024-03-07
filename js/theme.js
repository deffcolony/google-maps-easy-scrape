const getSavedTheme = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['theme'], (result) => {
            if (!result.theme) {
                resolve('system');
                return;
            }
            resolve(result.theme);
        });
    });
}

const colors = {
    "body.background": {
        "css-var": "--page-bkg-color",
        value: "#121212"
    },
    "colors.static.primary.color": {
        "css-var": "--primary-color",
        value: "#ff0000"
    },
    "colors.static.primary.textover": {
        "css-var": "--text-color-on-primary",
        value: "#ffffff"
    },
    "colors.static.primary.hover": {
        "css-var": "--primary-hover-color",
        value: "#ff0000"
    },
    "colors.theme.background1": {
        "css-var": "--bkg-color-1",
        value: "#242424"
    },
    "colors.theme.background2": {
        "css-var": "--bkg-color-2",
        value: "#333333"
    },
    "colors.theme.text": {
        "css-var": "--text-color",
        value: "#ffffff"
    },
    "colors.theme.tableText": {
        "css-var": "--table-text",
        value: "#ffffff"
    },
    "colors.theme.tableborder": {
        "css-var": "--table-border-color",
        value: "#3f3f3f"
    },
    "modal.background": {
        "css-var": "--modal-body-color",
        value: "#121212"
    },
}


const applyColors = (colors) => {
    if (!colors) {
        console.log('No colors to apply');
        return;
    }
    Object.keys(colors).forEach((key) => {
        $('body').css(colors[key]['css-var'], colors[key].value);
    });
}

const clearColors = () => {
    Object.keys(colors).forEach((key) => {
        $('body').css(colors[key]['css-var'], '');
    });
}

const getSavedColors = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['colors'], (result) => {
            if (!result.colors) {
                resolve({});
                return;
            }
            resolve(result.colors);
        });
    });
}

const saveCurrentTheme = (theme) => { chrome.storage.sync.set({ theme: theme }); }

const applyDefaultColors = () => {
    applyColors(colors);
}

function getBrowserTheme() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function setTheme(theme) { document.body.setAttribute('theme', theme == 'system' ? getBrowserTheme() : theme); }
document.addEventListener('DOMContentLoaded', function() { 
    document.body.setAttribute('theme', getBrowserTheme());

    // load saved theme
    getSavedTheme().then((theme) => {
        setTheme(theme);

        if (theme == "custom") {
            // get saved colors
            getSavedColors().then((colors) => {
                applyColors(colors);
            });
        }
    });

});