(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Player} player The player to control
     * @param {Dyna.model.Level} level Provides access to the positions of other players
     * @param {Dyna.model.Map} map Allows the controller to navigate around the map
     * @param {Dyna.ai.DestinationChooser} destinationChooser Makes decisions about where to go
     * @param {Dyna.ai.Bomber} bomber Decides when to lay bombs
     * @param {Dyna.ai.Walker} bomber Decides when to take a step
     */
    function ComputerController(player, level, map, destinationChooser, bomber, walker) {
        ComputerController.superclass.constructor.call(this, player);
        this.level = level;
        this.map = map;
        this.destinationChooser = destinationChooser;
        this.bomber = bomber;
        this.walker = walker;
        this.initialiseAnimation();
    }

    Object.extend(ComputerController, Dyna.app.BasicController);

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
     * Chooses destinations from possibilities
     * @private
     * @type {Dyna.ai.DestinationChooser}
     */
    ComputerController.prototype.destinationChooser = null;

    /**
     * Decides when to lay bombs
     * @private
     * @type {Dyna.ai.Bomber}
     */
    ComputerController.prototype.bomber = null;

    /**
     * Decides when to walk
     * @private
     * @type {Dyna.ai.Walker}
     */
    ComputerController.prototype.walker = null;

    /**
     * Ensures that the controller stops operating if the player dies
     * @private
     */
    ComputerController.prototype.initialiseAnimation = function() {
        this.interval = window.setInterval(this.think.bind(this), ComputerController.SPEED);
    };

    /**
     * Consider what to do with the player next
     */
    ComputerController.prototype.think = function() {

        if (!this.currentPath) {
            this.chooseSomewhereToGo();
        }

        this.takeNextStep();

    };

    /**
     * Moves the player one step towards the destination
     */
    ComputerController.prototype.takeNextStep = function() {
        if (this.currentPath) {
            if (this.currentPath.length) {
                var nextStep = this.currentPath[0];
                if (this.player.layBomb && this.bomber.canLayBombOnRoute(this.currentPath, this.player.x, this.player.y, this.player)) {
                    this.player.layBomb();
                }
                // todo: change course if the current path is now too dangerous or a better one has come up
                if (this.walker.shouldWalkTo(nextStep.x, nextStep.y, this.player)) {
                    this.player.move(nextStep.x, nextStep.y);
                    this.currentPath.shift();
                } else {
                    // freeze!
                    log("Freezing!");
                }
            } else {
                if (this.player.layBomb && this.bomber.layingBombHereIsAGoodIdea(this.player.x, this.player.y, this.map, this.player)) {
                    this.player.layBomb();
                }
                this.currentPath = null;
            }
        }
    };

    /**
     * Finds some place for the player to go to
     */
    ComputerController.prototype.chooseSomewhereToGo = function() {

        var pathFinder = new Dyna.util.PathFinder(this.map, this.player.x, this.player.y),
            potentialDestinations = pathFinder.getAvailableDestinations(),
            chosenDestination = this.destinationChooser.chooseDestinationFrom(
                pathFinder.getAvailableDestinations(),
                this.level,
                this.map,
                this.player
                );

        if (chosenDestination) {
            this.currentPath = pathFinder.getPathTo(chosenDestination.x, chosenDestination.y);
            if (!this.currentPath) {
                log(this.player.name + " cannot get to chosen destination", this.player.x, this.player.y, chosenDestination);
            }
        } else {
            log(this.player.name + " has nowhere to go");
        }

    };

    /**
     * Stops the computer controller from affecting the player
     */
    ComputerController.prototype.stopControlling = function() {
        window.clearInterval(this.interval);
    };

    /**
     * The interval during which the computer controller takes its turns.
     * @type {Number}
     */
    ComputerController.SPEED = 500;

    Dyna.app.ComputerController = ComputerController;

})(window.Dyna);