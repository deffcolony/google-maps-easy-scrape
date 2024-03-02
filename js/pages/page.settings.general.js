/// <reference path="../ui.components.js" />

document.addEventListener('DOMContentLoaded', function() {
    
    const lang = new dropdown("languageSelect");
    lang.addItems([
        { value: "en", text: "English" },
        { value: "es", text: "Español" },
        { value: "fr", text: "Français" },
        { value: "de", text: "Deutsch" },
        { value: "it", text: "Italiano" },
        { value: "pt", text: "Português" },
        { value: "ja", text: "日本語" },
        { value: "ko", text: "한국어" },
        { value: "zh", text: "中文" }
    ])
    lang.setValue("en");
    $(".setting-lang").append(lang.draw());
    lang.init();
    lang.on('change', function(event) {
        console.log('lang changed', event.detail.value);
        const lang = event.detail.value;
        setLanguage(lang);
    });
});