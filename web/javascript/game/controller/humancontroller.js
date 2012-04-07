(function(Dyna) {

    /**
     * @constructor
     * @param player The player to control
     */
    function HumanController(player) {
        this.superclass.constructor.call(this, player);
    }

    Object.extend(HumanController, Dyna.app.BasicController);

    /**
     * The input method.
     * @type {Dyna.util.KeyboardInput}
     */
    HumanController.prototype.keyboardInput = null;

    /**
     * Sets up some controls to allow the player to be controlled by a human
     * @param {Dyna.util.KeyboardInput} keyboardInput The input method
     */
    HumanController.prototype.withControls = function(keyboardInput) {
        var movePlayerTo = this.movePlayerTo;
        this.keyboardInput = keyboardInput;
        keyboardInput.on(Dyna.model.Player.UP, movePlayerTo.bind(this, 0, -1));
        keyboardInput.on(Dyna.model.Player.DOWN, movePlayerTo.bind(this, 0, +1));
        keyboardInput.on(Dyna.model.Player.LEFT, movePlayerTo.bind(this, -1, 0));
        keyboardInput.on(Dyna.model.Player.RIGHT, movePlayerTo.bind(this, +1, 0));
        keyboardInput.on(Dyna.model.Player.ENTER, this.player.layBomb.bind(this.player));
        return this;
    };

    /**
     * Alerts the user that it needs to move to a given location
     * @param dx The change in X
     * @param dy The change in Y
     */
    HumanController.prototype.movePlayerTo = function(dx, dy) {
        this.player.move(this.player.x + dx, this.player.y + dy);
    };

    /**
     * Stops the input method from affecting the player
     */
    HumanController.prototype.stopControlling = function() {
        if (this.keyboardInput) {
            this.keyboardInput.unsubscribeAll();
        }
    };

    Dyna.app.HumanController = HumanController;

})(window.Dyna);