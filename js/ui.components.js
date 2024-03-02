
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
        this.items = $(this.buttonGroup).find('.item');
        console.log("construct: ",this.buttonGroup)
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
        this.items.each(function(index, button) {
            console.log('button', button);
            button.addEventListener('click', function() {
                $(`${buttonGroup} .item`).removeClass('active');
                $(button).addClass('active');
                dispatch(0, $(button).attr('data-value'));
                // this.dispatchEvent('change', {id: this.id, value: button.getAttribute('data-value')});
            });
        });
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            console.log('event', event);
            callback(event);
        });
    }

    setValue(value) {
        $(`${this.buttonGroup} .item`).removeClass('active');
        $(`${this.buttonGroup} .item[data-value="${value}"]`).addClass('active');
    }
}

class dropdown extends EventTarget {
    dialog = null;
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

    draw() {
        const base = $("<div class='dropdown' id='"+this.id+"'>"+
            "<p class='selected'>Select</p>"+
        "</div>");
        console.log('base', base);
        return base;
    }

    openDropdown(c) {
        const dialog = $("<div class='dropdown-dialog'></div>");
        c.dialog = dialog;
        $('body').append(c.dialog);

        c.items.forEach((item) => {
            const el = $("<div class='item' data-value='"+item.value+"'>"+item.text+"</div>");
            el.on('click', () => {
                this.setValue(item.value);
                dialog.remove();
            });
            dialog.append(el);
        });

        const topbottom_padding = 
            $(c.dropdown).css('padding-top').replace('px', '') * 1 +
            $(c.dropdown).css('padding-bottom').replace('px', '') * 1;

        const leftright_padding =
            $(c.dropdown).css('padding-left').replace('px', '') * 1 +
            $(c.dropdown).css('padding-right').replace('px', '') * 1;

        // is scrollbar visible
        const scrollbar = c.dialog[0].scrollHeight > c.dialog.width();
        
        c.dialog.css({
            top:  $(c.dropdown).offset().top + $(c.dropdown).height() + topbottom_padding + 1,
            left: $(c.dropdown).offset().left,
            width: $(c.dropdown).width() + leftright_padding + 1,
        });

        // call resize event
        // $(window).trigger('resize');
    }

    init() {
        const dropdown = $(this.dropdown);
        const openDropdown = this.openDropdown;
        const c = this;

        // watch for window resize
        $(window).on('resize', function() {
            if (c.dialog) {
                const topbottom_padding = 
                    $(c.dropdown).css('padding-top').replace('px', '') * 1 +
                    $(c.dropdown).css('padding-bottom').replace('px', '') * 1;
        
                const leftright_padding =
                    $(c.dropdown).css('padding-left').replace('px', '') * 1 +
                    $(c.dropdown).css('padding-right').replace('px', '') * 1;
        
                c.dialog.css({
                    top:  $(c.dropdown).offset().top + $(c.dropdown).height() + topbottom_padding + 1,
                    left: $(c.dropdown).offset().left,
                    width: $(c.dropdown).width() + leftright_padding + 1,
                });
        
            }
        });

        dropdown.on('click', function() {
            if (dropdown.hasClass('open')) {
                dropdown.removeClass('open');
                c.dialog.remove();
            } else {
                dropdown.addClass('open');
                openDropdown(c);
            }
        });
    }

    on(event, callback) {
        this.addEventListener(event, (event) => {
            callback(event);
        });
    }

    setValue(value) {
        this.value = value;
        $(`${this.dropdown} .selected`).text(this.items.filter((item) => item.value === value)[0].text);
    }
}