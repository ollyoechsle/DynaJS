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
     * The current path that the computer is walking along
     * @private
     * @type {Object[]}
     */
    ComputerController.prototype.currentPath = null;

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

        if (!this.currentPath || !this.currentPath.length) {
            this.chooseSomewhereToGo();
        }

        this.takeNextStep();

    };

    /**
     * Moves the player one step towards the destination
     */
    ComputerController.prototype.takeNextStep = function() {
        if (this.currentPath && this.currentPath.length) {
            var nextStep = this.currentPath.shift();
            this.player.fire(Dyna.model.Player.WANTS_TO_MOVE, this.player, nextStep.x, nextStep.y);
        }
    };

    /**
     * Finds some place for the player to go to
     */
    ComputerController.prototype.chooseSomewhereToGo = function() {

        var pathFinder = new Dyna.util.PathFinder(this.map, this.player.x, this.player.y),
                potentialDestinations = pathFinder.getAvailableDestinations(),
                chosenDestination = this.chooseDestinationFrom(pathFinder.getAvailableDestinations());

        if (chosenDestination) {
            this.currentPath = pathFinder.getPathTo(chosenDestination.x, chosenDestination.y);
        }

    };

    /**
     * Chooses a destination to travel to from a list of potential destinations
     * @param {Object[]} potentialDestinations The list of destinations
     */
    ComputerController.prototype.chooseDestinationFrom = function(potentialDestinations) {
        for (var i = 0; i < potentialDestinations.length; i++) {

            var destination = potentialDestinations[i];

            if (Math.random() < (1 / potentialDestinations.length)) {
                return destination;
            }

        }
    };

    /**
     * Stops the computer controller from affecting the player
     */
    ComputerController.prototype.stopControlling = function() {
    };

    ComputerController.SPEED = 1000;

    Dyna.app.ComputerController = ComputerController;

})(window.Dyna);