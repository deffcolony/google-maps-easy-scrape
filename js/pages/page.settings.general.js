/// <reference path="../ui.components.js" />

const sendMessage = (message) => {
    window.parent.postMessage(message, '*');
}


document.addEventListener('DOMContentLoaded', function() {
    // const openFailedSave = (stack) => {
    //     const m_body = `
    //         <p>Failed to save settings</p><br>
    //         <pre>${stack}</pre>
    //     `;
    //     const m_footer = `<button class="btn btn-primary btn-modal" id="closeWarningModal" data-dismiss="modal">Close</button>`;
    //     const modal = new modalCreator(
    //         "savefailed",
    //         "Error saving settings",
    //         m_body,
    //         m_footer,
    //         {}
    //     )
    //     const m = modal.create();
    //     modal.show();
    //     $(`#${m.id} #closeWarningModal`).click(function() {
    //         modalAPI.removeModal(m.id);
    //     });
    // }

    const lang = new dropdown("languageSelect");
    lang.addItems([
        { value: "en-US", text: "English (US)" },
        // dutch
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

    // saveGeneralButton
    // $("#saveGeneralButton").click(function() {
    //     try {
    //         saveLanguage(lang.value);
    //     } catch (e) {
    //         openFailedSave(e.stack);
    //     }
    // });
});