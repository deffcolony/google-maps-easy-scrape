/// <reference path="../ui.components.js" />
const sendMessage = (message) => {
    window.parent.postMessage(message, '*');
}

document.addEventListener('DOMContentLoaded', async function() {
    const group = new buttonGroup('themeSelect');
    group.init();
    group.setValue(getBrowserTheme());
    group.on('change', function(event) {
        console.log('theme changed', event.detail.value);
        const theme = event.detail.value;
        setTheme(theme);
        sendMessage({ type: 'setTheme', theme: theme });
    });
    const currentTheme = await getSavedTheme();
    console.log('currentTheme', currentTheme);
    group.setValue(currentTheme);

    // setting-lang

    // iframe
    // send event to set theme
});