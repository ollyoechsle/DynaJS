(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Player} player The player to control
     */
    function ComputerController(player, map) {
        this.player = player;
        this.map = map;
        this.initialise();
    }

    /**
     * The player to control
     * @private
     * @type {Dyna.model.Player}
     */
    ComputerController.prototype.player = null;

    /**
     * Reference to the map, so the controller can explore
     * @private
     * @type {Dyna.model.Map}
     */
    ComputerController.prototype.map = null;

    /**
     * Ensures that the controller will stop working if the player dies
     * @private
     */
    ComputerController.prototype.initialise = function() {
        this.player.on(Dyna.model.Player.DIED, this.stopControlling.bind(this));
        window.setInterval(this.think.bind(this), ComputerController.SPEED);
    };

    /**
     * Consider what to do with the player next
     */
    ComputerController.prototype.think = function() {
        log("Thinking..");
        var pathFinder = new Dyna.util.PathFinder(this.map, this.player.x, this.player.y);

        var potentialDestinations = pathFinder.getAvailableDestinations();

        // choose the most useful destination
        for (var i = 0; i < potentialDestinations.length; i++) {

            var destination = potentialDestinations[i];

            if (Math.random() < (1 / potentialDestinations.length)) {
                log("Computer is moving to ", destination);
                this.player.fire(Dyna.model.Player.WANTS_TO_MOVE, this.player, destination.x, destination.y);
                break;
            }

        }

        log(potentialDestinations);
    };

    /**
     * Stops the computer controller from affecting the player
     */
    ComputerController.prototype.stopControlling = function() {
    };

    ComputerController.SPEED = 2000;

    Dyna.app.ComputerController = ComputerController;

})(window.Dyna);