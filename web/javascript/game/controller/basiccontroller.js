(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Lifeform} player The life form to control
     */
    function BasicController(player) {
        this.player = player;
        this.initialiseEvents();
    }

    /**
     * The player to control
     * @protected
     * @type {Dyna.model.Player}
     */
    BasicController.prototype.player = null;

    /**
     * @private
     * Stops control when the player dies or when the game ends
     */
    BasicController.prototype.initialiseEvents = function() {
        this.player.on(Dyna.model.Lifeform.DIED, this.stopControlling.bind(this));
        Dyna.app.GlobalEvents.on("gameover", this.stopControlling.bind(this));
    };

    /**
     * Stops the computer controller from affecting the player
     */
    BasicController.prototype.stopControlling = function() {
        log("Controller should stop controlling here")
    };

    Dyna.app.BasicController = BasicController;

})(window.Dyna);