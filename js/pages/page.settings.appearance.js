/// <reference path="../ui.components.js" />

document.addEventListener('DOMContentLoaded', function() {
    const group = new buttonGroup('themeSelect');
    group.init();
    group.setValue(getBrowserTheme());
    group.on('change', function(event) {
        console.log('theme changed', event.detail.value);
        const theme = event.detail.value;
        setTheme(theme);
    });

    // setting-lang

    // iframe
    // send event to set theme
    window.postMessage({ type: 'setTheme', theme: getBrowserTheme() }, '*');
});