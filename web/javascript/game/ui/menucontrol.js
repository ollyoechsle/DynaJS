(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {Dyna.util.KeyboardInput} keyboardInput Keyboard input mappings
     */
    function MenuControl(keyboardInput) {
        this.items = [];
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
     * Displays all the items on the menu control
     */
    MenuControl.prototype.showOn = function(jMenu) {
        this.jMenu = jMenu;
        var i, numItems, item;
        this.jMenu.empty();
        for (i = 0,numItems = this.items.length; i < numItems; i++) {
            item = this.items[i];
            jMenu.append(MenuControl.createMenuItem(item.text, item.callback));
        }
        return this;
    };

    /**
     * Creates a menu item
     * @param text The item text
     * @param callback A function to call when the item is selected
     */
    MenuControl.createMenuItem = function(text, callback) {
        return jQuery("<li></li>").text(text).click(callback);
    };

    Dyna.ui.MenuControl = MenuControl;

})(window.Dyna, jQuery);