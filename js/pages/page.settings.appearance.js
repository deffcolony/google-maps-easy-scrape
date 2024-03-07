/// <reference path="../ui.components.js" />
const sendMessage = (message) => {
    window.parent.postMessage(message, '*');
}

const saveColors = async (colors) => {
    console.log('Saving colors', colors);
    await chrome.storage.sync.set({ colors: colors });
}
var colorsDupe = {}

document.addEventListener('DOMContentLoaded', async function() {
    const group = new buttonGroup('themeSelect');
    group.addButtons([
        {value: 'dark', text: 'Dark', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2A9.91 9.91 0 0 0 9 2.46A10 10 0 0 1 9 21.54A10 10 0 1 0 12 2Z" /></svg>`},
        {value: 'light', text: 'Light', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13" /></svg>`},
        {value: 'system', text: 'System', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" /></svg>`},
        {value: 'custom', text: 'Custom', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z" /></svg>`}
    ])

    const flashbangMeme = () => {
        const m_body = `
        <a href="https://www.youtube.com/watch?v=epkp1whEW3E&t=16s" target="_blank">
            <img src="/images/flashbang.jpg" alt="Flashbang" style="width: 100%; max-width: 300px;">
        </a>

        `;
        const m_footer = `
        <div style="display: flex; justify-content: space-between; gap: 12px;">
            <button class="btn btn-primary btn-modal" id="cloasemodal" data-dismiss="modal">Burn my retinas!</button>
            <button class="btn btn-primary btn-modal" id="returntodarn" data-dismiss="modal">Return to the dark side!</button>
        </div>
            `;
        const modal = new modalCreator(
            "flashbang",
            "I choose flashbang!",
            m_body,
            m_footer,
            {}
        )
        const m = modal.create();
        modal.show();
        $(`#${m.id} #cloasemodal`).click(function() {
            modalAPI.removeModal(m.id);
            window.parent.postMessage({
                ui: 'sidebar-show'
            }, '*');
        });
        $(`#${m.id} #returntodarn`).click(function() {
            modalAPI.removeModal(m.id);
            setTheme('dark');
            sendMessage({ type: 'setTheme', theme: 'dark' });
            group.setValue('dark');
            window.parent.postMessage({
                ui: 'sidebar-show'
            }, '*');
        });
        window.parent.postMessage({
            ui: 'sidebar-hide'
        }, '*');
    }

    group.init();
    group.setValue(getBrowserTheme());
    group.on('change', async function(event) {
        const currentTheme = await getSavedTheme();
        const theme = event.detail.value;
        clearColors();
        if (theme === 'light') {
            // check if the them is already light
            if (currentTheme === 'dark') {
                flashbangMeme();
            }
            if (currentTheme === 'system') {
                flashbangMeme();
            }
        }
        if (theme === 'custom') {
            const savedcolor = await getSavedColors();
            applyColors(savedcolor);
        }    
        setTheme(theme);
        sendMessage({ type: 'setTheme', theme: theme });
    });
    const currentTheme = await getSavedTheme();
    group.setValue(currentTheme);

    $("button#setup-colors").click(async function() {
        group.setValue('custom');
        const savedcolor = await getSavedColors();
        colorsDupe = savedcolor;

        // is the length of the object 0?
        if (Object.keys(savedcolor).length === 0) {
            console.log('No saved colors, applying default');
            applyDefaultColors();
            saveColors(colors);
            colorsDupe = colors;
        }                 

        const m_body = `
            <div class="alert alert-warning" role="alert">
                <strong>Warning!</strong> Changing the colors can break the UI. Use with caution.
            </div>
            <h2>Static Colors</h2>
            <div class="table-outter">
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Background color</th>
                            <th>Text color</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="primary-color">
                            <td>Priamry Color</td>
                            <td><input data-obj-key="colors.static.primary.color" data-css-attr="--primary-color"" class="static-color-background" type="color" value="#007bff"></td>
                            <td><input data-obj-key="colors.static.primary.textover" data-css-attr="--text-color-on-primary" class="static-color-text" type="color" value="#ffffff"></td>
                        </tr>
                        <tr id="button-color">
                            <td>Button Hover</td>
                            <td><input data-obj-key="colors.static.primary.hover" data-css-attr="--primary-hover-color" class="static-color-background" type="color" value="#007bff"></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2 style="margin-top: 12px;">Theme Colors</h2>
            <div class="table-outter" >
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="main-page">
                            <td>Page background color</td>
                            <td><input data-obj-key="body.background" data-css-attr="--page-bkg-color" type="color" value="#333333"></td>
                        </tr>
                        <tr id="theme-color-bkg1">
                            <td>Background color 1</td>
                            <td><input data-obj-key="colors.theme.background1" data-css-attr="--bkg-color-1" type="color" value="#333333"></td>
                        </tr>
                        <tr id="theme-color-bkg2">
                            <td>Background color 2</td>
                            <td><input data-obj-key="colors.theme.background2" data-css-attr="--bkg-color-2" type="color" value="#242424"></td>
                        </tr>
                        <tr id="theme-color-text">
                            <td>Text color</td>
                            <td><input data-css-attr="--text-color" type="color" value="#cccccc"></td>
                        </tr>
                        <tr id="theme-color-tabletext">
                            <td>Table Text color</td>
                            <td><input data-css-attr="--table-text-color" type="color" value="#ffffff"></td>
                        </tr>
                        <tr id="theme-color-tableborder">
                            <td>Table border color</td>
                            <td><input data-obj-key="colors.theme.tableborder" data-css-attr="--table-border-color" type="color" value="#cfcfcf"></td>
                        </tr>
                        <tr id="theme-color-modal">
                            <td>Modal background color</td>
                            <td><input data-obj-key="modal.background" data-css-attr="--modal-body-color" type="color" value="#121212"></td>
                        </tr>
                        <tr>
                            <td>
                                <div style="margin-left: 0px; height:auto;">
                                    Page section icon color
                                    <input type="checkbox" id="pageSectionIconColor" checked>
                                    <label for="pageSectionIconColor">Use Primary</label>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        const m_footer = `
        <div style="display: flex; justify-content: space-between; gap: 12px;">
            <button class="btn btn-primary btn-modal" id="applycolors" data-dismiss="modal">Apply</button>
            <button class="btn btn-primary btn-modal" id="cloasemodal" data-dismiss="modal">Close</button>
        </div>`;
        const modal = new modalCreator(
            "setupcolors",
            "Setup colors",
            m_body,
            m_footer,
            {}
        )
        const m = modal.create();
        modal.show();
        $(`#${m.id} #cloasemodal`).click(async function() {
            const conf = confirm("Do you want to discard the changes?");
            if (!conf) {
                return;
            }

            modalAPI.removeModal(m.id);
            sendMessage({ ui: 'sidebar-show' })
            sendMessage({ type: 'reloadCustomColors' });
            const savedcolor = await getSavedColors();
            applyColors(savedcolor);
        });
        $(`#${m.id} #applycolors`).click(async function() {
            modalAPI.removeModal(m.id);
            sendMessage({ ui: 'sidebar-show' })
            sendMessage({ type: 'reloadCustomColors' });
            await saveColors(colorsDupe);
            applyColors(colorsDupe);
        });

        $(`#${m.id} input[data-css-attr]`).on('change', function() {
            const cssAttr = $(this).data('css-attr');
            const color = $(this).val();
            $("body").css(cssAttr, color);
            const objKey = $(this).data('obj-key');
            console.table(
                { cssAttr: cssAttr,  objKey: objKey, color: color }
            )
            try {
                if (objKey) {
                    console.log("updated color", objKey, color);
                    colorsDupe[objKey].value = color;
                    console.log(colorsDupe)
                }
            } catch (e) {
                console.error(e);
            }
        });

        // apply colors from saved to the input
        Object.keys(colorsDupe).forEach((key) => {
            $(`#${m.id} input[data-obj-key="${key}"]`).val(colorsDupe[key].value);
        });

        sendMessage({ ui: 'sidebar-hide' });
    });

    $("button#clear-colors").click(async function() {
        const conf = confirm("Do you want to discard the changes?");
        if (!conf) {
            return;
        }
        clearColors();
        saveColors({});
        group.setValue('dark');
    });
});