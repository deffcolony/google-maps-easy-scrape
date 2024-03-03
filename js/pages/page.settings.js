const nav = $('.sidebar-left .nav');
console.log('nav', nav);
const iframe = $('#settings-iframe');
const ext_ver = $('#ext-ver');

function getBrowserTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    $('body').attr('theme', theme);
}

// dom loaded
document.addEventListener('DOMContentLoaded', function() {
    $('body').attr('theme', getBrowserTheme());
    // get extension version
    ext_ver.text(`Version: ${chrome.runtime.getManifest().version}`);

    // get buttons with class "attr-page"
    const pages = nav.find('.item[attr-page]');
    console.log('pages', pages);
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
            console.log('Clicked', page);
            loadSettingsPage(page);
        });

        // check url for page param
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        if (pageParam && page === pageParam) {
            loadSettingsPage(page);
        }
    });
});

const loadSettingsPage = (page) => {
    console.log('Loading settings page', page);
    nav.find('.item[attr-page]').removeClass('active');
    nav.find('.item[attr-page="' + page + '"]').addClass('active');
    iframe.attr('src', `/pages/settings/${page}.html`);
    // set param to url
    window.history.pushState({}, '', `?page=${page}`);
    watchEventsFromIframe();
}

const watchEventsFromIframe = () => {
    window.addEventListener('message', function(event) {
        console.log('received', event);
        if (event.data.type === 'setTheme') {
            setTheme(event.data.theme);
        }
    });
}