const nav = $('.sidebar-left .nav');
console.log('nav', nav);
const iframe = $('#settings-iframe');
const ext_ver = $('#ext-ver');

async function getBrowserTheme() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['theme'], (result) => {
            resolve(result.theme);
        });
    });
}

function setTheme(theme) {
    $('body').attr('theme', theme);
}


// dom loaded
document.addEventListener('DOMContentLoaded', async function() {
    ext_ver.text(`Version: ${chrome.runtime.getManifest().version}`);
    // get buttons with class "attr-page"
    const pages = nav.find('.item[attr-page]');
    // loop through buttons
    pages.each(function(index, button) {
        const page = button.getAttribute('attr-page');
        // if first button, activate it
        if (index === 0) {
            button.classList.add('active');
            iframe.attr('src', `/pages/settings/${page}.html`);
        }

        // get the url from the button's data-url attribute
        // add event listener to each button
        button.addEventListener('click', function() {
            $('body').removeClass('menu-open');
            loadSettingsPage(page);
        });

        // check url for page param
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        if (pageParam && page === pageParam) {
            loadSettingsPage(page);
        }
    });

    $("#menu-button").on('click', function() {
        $('body').toggleClass('menu-open');
    });
    watchEventsFromIframe();
});

const loadSettingsPage = (page) => {
    console.log('Loading settings page', page);
    nav.find('.item[attr-page]').removeClass('active');

    nav.find('.item[attr-page="' + page + '"]').addClass('active');
    iframe.attr('src', `/pages/settings/${page}.html`);
    // set param to url
    window.history.pushState({}, '', `?page=${page}`);
}

function openUrl(url) {
    if (url == null) return;
    // href
    if (url.includes('http')) {
        window.open(url, '_blank');
    }
    // chrome
    else {
        chrome.tabs.create({url: url});
    }
}

const openModal = (modal) => {
    const m = new modalCreator(
        modal.id,
        modal.title,
        modal.body,
        modal.footer,
        {}
    )
    m.create();
    m.show();
    return m;
}

const watchEventsFromIframe = () => {
    window.addEventListener('message', function(event) {
        switch (event.data.type) {
            case 'setTheme':
                setTheme(event.data.theme);
                if (!event.data.theme || event.data.theme != 'custom') {
                    clearColors();
                }
                if (!event.data.theme || event.data.theme == 'custom') {
                    getSavedColors().then((colors) => {
                        clearColors();
                        applyColors(colors);
                    });
                }
                chrome.storage.sync.set({ theme: event.data.theme }, () => {
                    console.log('Theme saved', event.data.theme);
                });
    	        break;
            case "reloadCustomColors":
                clearColors();
                getSavedColors().then((colors) => {
                    applyColors(colors);
                });
                break;

            case 'setPage':
                loadSettingsPage(event.data.page);
                break;

            case 'language':
                setLanguage(event.data.language, {
                    dontsend: true
                });
                break;

            default:
                console.log('Unknown type event', event.data);
                break;
        }
        // action evets
        if (event.data.action) {
            switch (event.data.action) {
                case 'openUrl':
                    openUrl(event.data.url);
                    break;
                default:
                    console.log('Unknown action event', event.data);
                    break;
            }
        }
        if (event.data.ui) {
            switch (event.data.ui) {
                case 'sidebar-hide':
                    $('body').addClass('hide-sidebar');
                    break;
                case 'sidebar-show':
                    $('body').removeClass('hide-sidebar');
                    break;
                default:
                    console.log('Unknown ui event', event.data);
                    break;
            }
        }
    });
}