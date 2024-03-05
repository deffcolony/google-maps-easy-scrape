const getHistory = async () => {
    return await new Promise((resolve, reject) => {
        chrome.storage.local.get(['history'], (result) => {
            if (!result.history) {
                console.log("%cNo history found", "color: red;")
                resolve([]);
                return;
            }
            console.log('%cHistory found', 'color: lime;', result.history);
            resolve(result.history);
        });
    });
}

// placeholder getHistory
// const getHistory = () => {
//     return placeholder_item;
// }

const noHistory = () => {
    return `
    <tr>
        <td colspan="3" id="nohistorystatus">
            <div style="display: flex; gap: 18px; margin: 0;" class="card">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>sim-alert-outline</title><path d="M13 13H11V7H13M13 17H11V15H13M18 4V20H6V8.8L10.8 4H18M18 2H10L4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z" /></svg>
                </div>
                <div>
                    <h2 data-i18n="text.settings.nohistory.title" >No history found</h2>
                    <p  data-i18n="text.settings.nohistory.text" >Scrape some places to see history</p>
                </div>
            </div>
        </td>
    </tr>
    `
}

const viewHistory = (history) => {
    console.log('Viewing history', history);
    const places = $(`<tbody></tbody>`);

    history.places.forEach((item, index) => {
        places.append(`
            <tr>
                <td>${item.title}</td>
                <td><a href="${item.href}" target="_blank" rel="noopener noreferrer">View map</a></td>
                <td>${item.rating}</td>
            </tr>
        `);
    });

    const m_body = `
    <div class="card">
        <div style="display: flex; gap: 18px; margin: 0;" class="card-header">
            <h2 data-i18n="modal.history.view.title">History</h2>
            <p data-i18n="modal.history.view.text">Showing ${history.places.length} places</p>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th data-i18n="modal.history.view.title">Name</th>
                    <th data-i18n="modal.history.view.map">Map</th>
                    <th data-i18n="modal.history.view.rating">Rating</th>
                </tr>
            </thead>
            <tbody id="history-table">
                ${places.html()}
            </tbody>
        </table>
        </div>
    `;
    const m_footer = `
    <div style="display: flex; justify-content: space-between; gap: 12px;">
        <button data-i18n="text.close" class="btn btn-primary btn-modal" id="close" data-dismiss="modal">Close</button>
    </div>
    `;
    const modal = new modalCreator(
        "view-history",
        "View history",
        m_body,
        m_footer,
        {}
    )
    const m = modal.create();
    modal.show();

    const d = new dropdown("sortby");
    d.addItems([
        {text: "Name", value: "name"},
        {text: "Rating", value: "rating"},
    ])
    d.setValue("name");
    $(`#${m.id} .card-header`).append(d.draw());
    d.init();

    d.on('change', function(event) {
        console.log('Sort by', event.detail.value);
        $(`#${m.id} #history-table`).html(places.html());
        const sorted = history.places.sort((a, b) => {
            if (event.detail.value === "name") {
                return a.title.localeCompare(b.title);
            } else if (event.detail.value === "rating") {
                return b.rating - a.rating;
            }
        });

        $(`#${m.id} #history-table`).empty();

        sorted.forEach((item, index) => {
            $(`#${m.id} #history-table`).append(`
                <tr>
                    <td>${item.title}</td>
                    <td><a href="${item.href}" target="_blank" rel="noopener noreferrer">View map</a></td>
                    <td>${item.rating}</td>
                </tr>
            `);
        });
    });

    $(`#${m.id} #close`).click(function() {
        modalAPI.removeModal(m.id);
    });
};

const createHistoryTable = (history) => {
    let html = $("<tr></tr>")
    html.append(`
        <td>${history.scrapedate}</td>
        <td>${history.places.length}</td>
        <td style="width: max-content;">
            <button id="openhistory" style="height: min-content;" class="btn btn-primary btn-sm" data-i18n="modal.history.view">View</button>
        </td>
    `);
    html.find('#openhistory').click(function() {
        viewHistory(history);
    });
    return html;
}

document.addEventListener('DOMContentLoaded', async function() {
    const table = $('#history-table tbody');

    const deleteHistory = () => {
        const m_body = `
        <p data-i18n="modal.clearhistory.text">Are you sure you want to clear your history?</p>
        `;
        const m_footer = `
        <div style="display: flex; justify-content: space-between; gap: 12px;">
            <button data-i18n="modal.clearhistory.cancel" class="btn btn-primary btn-modal" id="no" data-dismiss="modal">Clear history!</button>
            <button data-i18n="modal.clearhistory.clear" class="btn btn-danger btn-modal" id="yes" data-dismiss="modal">Keep!</button>
        </div>
            `;
        const modal = new modalCreator(
            "delete-history",
            "Clear history",
            m_body,
            m_footer,
            {
                title_i18n: "modal.clearhistory.title",
            }
        )
        const m = modal.create();
        modal.show();
        $(`#${m.id} #no`).click(function() {
            modalAPI.removeModal(m.id);
        });
        $(`#${m.id} #yes`).click(function() {
            modalAPI.removeModal(m.id);
            chrome.storage.local.remove('history', function() {
                console.log('History cleared');
                table.html(noHistory());
            });
            initTranslations();
        });
    }
    
    $("#clear-history").click(function() {
        deleteHistory();
        initTranslations();
    });

    const history = await getHistory();
    console.log('history', history);
    
    try {
        if (history != undefined) {
            if (history.length === 0) {
                initTranslations();
            } else {
                // empty table
                table.empty();
                history.reverse();
                history.forEach((item, index) => {
                    table.append(createHistoryTable(item));
                });
                initTranslations();
            }
        } else {
            console.warn('No history found');
        }
    } catch (error) {
        console.error('Error getting history', error);
        const m_body = `
        <p data-i18n="modal.clearhistory.error">An error occurred while getting your history</p><br>
        <pre>${error.stack}</pre>
        `;
        const m_footer = `
        <div style="display: flex; justify-content: space-between; gap: 12px;">
            <button data-i18n="text.ok" class="btn btn-primary btn-modal" id="ok" data-dismiss="modal">OK</button>
        </div>
            `;
        const modal = new modalCreator(
            "err",
            "Error",
            m_body,
            m_footer,
            {}
        )
        const m = modal.create();
        modal.show();
        $(`#${m.id} #ok`).click(function() {
            modalAPI.removeModal(m.id);
        });
    }
});