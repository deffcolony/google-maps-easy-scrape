const icons = {
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>`,
    cross: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`,
}

/**
 * Button Group
 * @class buttonGroup
 * 
 * Events:
 * - change (id, value)
 */
class buttonGroup extends EventTarget {
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
        console.log('Adding items', items);
        items = items.filter((item) => item);
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
            // is value or text missing?
            if (!item.value || !item.text) {
                console.error('Invalid item', item);
                return;
            }

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
    label = '';
    constructor(id, label) {
        super();
        this.id = id;
        this.label = label;
        this.checkbox = `div.checkbox${ id ? `#${id}` : '' }`;
    }

    draw(opts) {
        const base = $(`<div class='checkbox' id='${this.id}' style='${opts && opts.style ? opts.style : ''}'>
            <input type='checkbox' id='${this.id}' />
            <div class="checkbox-box">
                <div class="checkbox-check">
                    <div class="icon">
                        ${icons.cross}
                    </div>
                </div>
            </div>
            <p>${this.label}</p>
        </div>`);


        base.find('input').on('change', () => {
            const checkbox = base.find('input');
            this.value = checkbox.prop('checked');
        });

        return base;
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
        $(checkbox).on('click', function() {
            const checkbox = $(this).find('input');
            const icon = $(this).find('.icon');
            const newval = !checkbox.prop('checked');
            checkbox.prop('checked', newval);
            if (newval) {
                $(this).addClass('checked');
                icon.html(icons.check);
            } else {
                $(this).removeClass('checked');
                icon.html(icons.cross);
            }
            dispatch(this.id, newval);
        });
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            callback(event);
        });
    }

    setValue(value) {
        this.value = value;
        $(this.checkbox).find('input').prop('checked', value);
        if (value) {
            $(this.checkbox).addClass('checked');
            $(this.checkbox).find('.icon').html(icons.check);
        } else {
            $(this.checkbox).removeClass('checked');
            $(this.checkbox).find('.icon').html(icons.cross);
        }
    }
}