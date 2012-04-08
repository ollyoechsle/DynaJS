(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {Dyna.util.KeyboardInput} keyboardInput Keyboard input mappings
     */
    function MenuControl(keyboardInput) {
        this.items = [];
        keyboardInput.on(MenuControl.UP, this.moveSelection.bind(this, MenuControl.UP));
        keyboardInput.on(MenuControl.DOWN, this.moveSelection.bind(this, MenuControl.DOWN));
        keyboardInput.on(MenuControl.SELECT, this.chooseSelection.bind(this));
    }

    /**
     * The menu container
     * @private
     * @type {jQuery}
     */
    MenuControl.prototype.jMenu = null;

    /**
     * A list of items to display
     * @private
     * @type {Object[]}
     */
    MenuControl.prototype.items = null;

    /**
     * Adds a new item to the menu control
     * @param {String} text The name of the menu item
     * @param {Function} callback A function to call when the item is selected
     * @returns This, for chaining
     */
    MenuControl.prototype.withItem = function(text, callback) {
        this.items.push({
            text: text,
            callback: callback
        });
        return this;
    };

    /**
     * Moves the selection back or forth
     * @param {Dyna.ui.MenuControl.UP|Dyna.ui.MenuControl.DOWN} dir The menu control direction
     */
    MenuControl.prototype.moveSelection = function(dir) {
        var selected = this.jMenu.find(".selected").removeClass("selected"),
            next = dir.getNext(selected);

        if (!next.length) {
            next = dir.getFirst(this.jMenu.find("li"));
        }

        next.addClass("selected");
    };

    /**
     * Triggers a click on the selected item
     */
    MenuControl.prototype.chooseSelection = function() {
        Dyna.util.Sound.play(Dyna.util.Sound.SELECT);
        this.jMenu.find(".selected").click();
    };

    /**
     * Displays all the items on the menu control
     */
    MenuControl.prototype.showOn = function(jMenu) {
        this.jMenu = jMenu;
        var i, numItems, item;
        this.jMenu.empty();
        for (i = 0,numItems = this.items.length; i < numItems; i++) {
            item = this.items[i];
            if (!this.selectedItem) {
                this.selectedItem = item;
            }
            jMenu.append(MenuControl.createMenuItem(item.text, item.callback, item === this.selectedItem));
        }
        return this;
    };

    /**
     * Creates a menu item
     * @param {String} text The item text
     * @param {Function} callback A function to call when the item is selected
     * @param {Boolean} selected Whether the item is selected
     */
    MenuControl.createMenuItem = function(text, callback, selected) {
        return jQuery("<li></li>").text(text).click(callback).toggleClass("selected", selected);
    };

    /**
     * When the user goes up a selection
     * @static
     */
    MenuControl.UP = {
        getNext: function(item) {
            return item.prev();
        },
        getFirst: function(items) {
            return items.last();
        }
    };

    /**
     * When the user moves the selection down
     * @static
     */
    MenuControl.DOWN = {
        getNext: function(item) {
            return item.next();
        },
        getFirst: function(items) {
            return items.first();
        }
    };

    /**
     * When the user chooses the selected item
     * @static
     */
    MenuControl.SELECT = "select";

    Dyna.ui.MenuControl = MenuControl;

})(window.Dyna, jQuery);