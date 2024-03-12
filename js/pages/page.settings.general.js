/// <reference path="../ui.components.js" />

const sendMessage = (message) => {
    window.parent.postMessage(message, '*');
}

const saveScrapingOptions = (options) => {
    chrome.storage.sync.set({ scrapingOptions: options }, () => {
        console.log('Scraping options saved');
    });
}

const getScrapingOptions = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['scrapingOptions'], (result) => {
            console.log('Scraping options', result);
            if (!result.scrapingOptions) {
                resolve({
                    ratings: true,
                    reviews: true,
                    phone: false,
                    address: false,
                    website: false
                });
                return;
            }
            resolve(result.scrapingOptions);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {

    const lang = new dropdown("languageSelect");
    lang.addItems([
        { value: "en-US", text: "English (US)" },
        { value: "nl", text: "Nederlands" },
        { value: "is", text: "Íslenska" },

        // { value: "es", text: "Español" },
        // { value: "fr", text: "Français" },
        // { value: "de", text: "Deutsch" },
        // { value: "it", text: "Italiano" },
        // { value: "pt", text: "Português" },
        // { value: "ja", text: "日本語" },
        // { value: "ko", text: "한국어" },
        // { value: "zh", text: "中文" }
    ])
    lang.setValue("en-US");
    $(".setting-lang").append(lang.draw());
    lang.init();
    lang.on('change', function(event) {
        console.log('lang changed', event.detail.value);
        const lang = event.detail.value;
        setLanguage(lang);
    });
    // get current language
    chrome.storage.sync.get(['language'], function(result) {
        if (result.language === undefined) {
            result.language = "en-US";
        }
        lang.setValue(result.language);
    });
    const scrapingoptions = {
        appendElement: $(".scraping-options"),
        options: [
            new checkbox('ratings', 'Ratings'),
            new checkbox('reviews', 'Reviews'),
            new checkbox('phone', 'Phone'),
            new checkbox('address', 'Address'),
            new checkbox('industry', 'Industry'),
            new checkbox('website', 'Website')
        ],
        values : {
        }
    }

    scrapingoptions.options.forEach((option) => {
        $(scrapingoptions.appendElement).append(option.draw());
        option.init();
        option.on('change', function(event) {
            console.log('Scraping option changed', event.detail.value);
            scrapingoptions.values[event.detail.id] = event.detail.value;
            saveScrapingOptions(scrapingoptions.values);
        });
    });

    
    getScrapingOptions().then((options) => {
        scrapingoptions.options.forEach((option) => {
            option.setValue(options[option.id]);
            scrapingoptions.values[option.id] = options[option.id];
        });
    });

    $("#scapreEnableAll").click(function() {
        scrapingoptions.options.forEach((option) => {
            option.setValue(true);
            scrapingoptions.values[option.id] = true;
        });
        saveScrapingOptions(scrapingoptions.values);
    });
    $("#scapreDisableAll").click(function() {
        scrapingoptions.options.forEach((option) => {
            option.setValue(false);
            scrapingoptions.values[option.id] = false;
        });
        saveScrapingOptions(scrapingoptions.values);
    });
});