(function(Dyna) {

    /**
     * Constructor
     * @param player The player to control
     */
    function HumanController(player) {
        this.player = player;
        this.player.on(Dyna.model.Player.DIED, this.stopControlling.bind(this));
    }

    /**
     * The player to control
     * @type {Dyna.model.Player}
     */
    HumanController.prototype.player = null;

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
        var player = this.player;
        this.keyboardInput = keyboardInput;
        keyboardInput.on(Dyna.model.Player.UP, player.move.bind(player, 0, -1, 'north'));
        keyboardInput.on(Dyna.model.Player.DOWN, player.move.bind(player, 0, +1, 'south'));
        keyboardInput.on(Dyna.model.Player.LEFT, player.move.bind(player, -1, 0, 'west'));
        keyboardInput.on(Dyna.model.Player.RIGHT, player.move.bind(player, +1, 0, 'east'));
        keyboardInput.on(Dyna.model.Player.ENTER, player.layBomb.bind(player));
        return this;
    };

    /**
     * Stops the input method from affecting the player
     */
    HumanController.prototype.stopControlling = function() {
        this.keyboardInput.unsubscribeAll();
        this.keyboardInput = null;
    };

    Dyna.app.HumanController = HumanController;

})(window.Dyna);