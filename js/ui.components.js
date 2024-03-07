
/**
 * Button Group
 * @class buttonGroup
 * 
 * Events:
 * - change (id, value)
 */
class buttonGroup extends EventTarget {
    /*
    <div class="item item-dark" data-value="dark">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2A9.91 9.91 0 0 0 9 2.46A10 10 0 0 1 9 21.54A10 10 0 1 0 12 2Z" /></svg>
        </div>
        <div class="text">
            <p>Dark</p>
        </div>
    </div>
    <div class="item item-light" data-value="light">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13" /></svg>
        </div>
        <div class="text">
            <p>Light</p>
        </div>
    </div>
    <div class="item item-system" data-value="system">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" /></svg>
        </div>
        <div class="text">
            <p>System</p>
        </div>
    </div>
    */
    id = '';
    buttonGroup = null;
    items = null;
    constructor(id) {
        super();
        this.id = id;
        this.buttonGroup = `div.button-group${ id ? `#${id}` : '' }`;
        this.items = [];
    }

    addButtons(buttons) {
        // {value: 'dark', text: 'Dark', icon: "HTML"}
        this.items = buttons;

        const buttonGroup = $(this.buttonGroup);
        buttonGroup.html('');

        buttons.forEach((button) => {
            const el = $(`<div class='item item-${button.value}' data-value='${button.value}'>
                ${
                    button.icon ? `<div class='icon'>${button.icon}</div>` : ''
                }
                <div class='text'>
                    <p>${button.text}</p>
                </div>
            </div>`);
            buttonGroup.append(el);
        });
    }

    init() {
        const buttonGroup = this.buttonGroup;
        const dispatch = (id, value) => {
            const event = new Event('change', {});
            event.detail = {
                id: id,
                value: value
            };
            this.dispatchEvent(event);
        }
        this.items.forEach((button) => {
            $(`${buttonGroup} .item[data-value="${button.value}"]`).on('click', function() {
                $(`${buttonGroup} .item`).removeClass('active');
                $(this).addClass('active');
                dispatch(0, $(this).attr('data-value'));
            });
        });
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            callback(event);
        });
    }

    setValue(value) {
        $(`${this.buttonGroup} .item`).removeClass('active');
        $(`${this.buttonGroup} .item[data-value="${value}"]`).addClass('active');

        const event = new Event('change', {});
        event.detail = {
            id: 0,
            value: value
        };
        this.dispatchEvent(event);
    }
}

class dropdown extends EventTarget {
    dialog = null;
    dialogBody = null;
    id = '';
    dropdown = null;
    items = null;
    value = null;
    constructor(id) {
        super();
        this.id = id;
        this.dropdown = `div.dropdown${ id ? `#${id}` : '' }`;
        this.items = [];
    }

    addItems(items) {
        this.items = items;
    }

    draw(opts) {
        const base = $(`<div class='dropdown' id='${this.id}' style='${opts && opts.style ? opts.style : ''}'>
            <p class='selected'>Select</p>
        </div>`);
        return base;
    }

    remove() {
        $(this.dropdown).removeClass('open');
        this.dialog.remove();
    }

    openDropdown(c, dispatch) {
        const dialog = $(`<div class='dropdown-dialog'>
            <div class="dismiss-box"></div>
        </div>`);
        const dialogBody = $(`<div class='body'>
        <div class='item item-select btn-close' style="display: flex;">${
            c.items.filter((item) => item.value === c.value)[0].text
        }
            <div class='icon ico-white' style="margin-left: auto; height:auto;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
            </div>
        </div>
        </div>`);
        dialog.append(dialogBody);
        c.dialog = dialog;
        c.dialogBody = dialogBody;
        $('body').append(c.dialog);

        c.items.forEach((item) => {
            const el = $("<div class='item' data-value='"+item.value+"'>"+item.text+"</div>");
            el.on('click', () => {
                c.setValue(item.value);
                $(c.dropdown).removeClass('open');
                dispatch(c.id, item.value);
                dialog.remove();
            });
            dialogBody.append(el);
        });

        const leftright_padding =
            $(c.dropdown).css('padding-left').replace('px', '') * 1 +
            $(c.dropdown).css('padding-right').replace('px', '') * 1;

        c.dialogBody.css({
            top:  $(c.dropdown).offset().top - window.scrollY,
            left: $(c.dropdown).offset().left,
            width: $(c.dropdown).width() + leftright_padding + 2,
        });
        dialog.addClass('open');
        dialog.find('.dismiss-box').on('click', () => {
            $(c.dropdown).removeClass('open');
            dialog.remove();
        });
        dialogBody.find('.btn-close').on('click', () => {
            $(c.dropdown).removeClass('open');
            dialog.remove();
        });

        // call resize event
        // $(window).trigger('resize');
    }

    init() {
        const dropdown = $(this.dropdown);
        const openDropdown = this.openDropdown;
        const dispatch = (id, value) => {
            const event = new Event('change', {});
            event.detail = {
                id: id,
                value: value
            };
            this.dispatchEvent(event);
        }
        const c = this;

        const relocateDialog = (c) => {
            const leftright_padding =
                $(c.dropdown).css('padding-left').replace('px', '') * 1 +
                $(c.dropdown).css('padding-right').replace('px', '') * 1;

            c.dialogBody.css({
                top:  $(c.dropdown).offset().top - window.scrollY,
                left: $(c.dropdown).offset().left,
                width: $(c.dropdown).width() + leftright_padding + 2,
            });
        }


        // watch for window resize
        $(window).on('resize', function() {
            if (c.dialogBody) {
                relocateDialog(c);
            }
        });
        // watch for window scroll
        $(window).on('scroll', function() {
            if (c.dialogBody) {
                relocateDialog(c);
            }
        });

        dropdown.on('click', function() {
            if (dropdown.hasClass('open')) {
                dropdown.removeClass('open');
                c.dialog.remove();
            } else {
                dropdown.addClass('open');
                openDropdown(c, dispatch);
            }
        });

        // check if the mouse is outside the dropdown
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            callback(event);
        });
    }

    setValue(value) {
        this.value = value;
        try {
            $(`${this.dropdown} .selected`).text(this.items.filter((item) => item.value === value)[0].text);
        } catch (e) {
            console.error('Error setting value', e);
        }
    }
}

class checkbox extends EventTarget {
    id = '';
    checkbox = null;
    value = false;
    constructor(id) {
        super();
        this.id = id;
        this.checkbox = `input[type="checkbox"]${ id ? `#${id}` : '' }`;
    }

    init() {
        const checkbox = this.checkbox;
        const dispatch = (id, value) => {
            const event = new Event('change', {});
            event.detail = {
                id: id,
                value: value
            };
            this.dispatchEvent(event);
        }
        $(checkbox).on('change', function() {
            dispatch(0, $(checkbox).prop('checked'));
        });
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            callback(event);
        });
    }

    setValue(value) {
        this.value = value;
        $(this.checkbox).prop('checked', value);
    }
}