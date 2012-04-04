/**
 * Things remaining for the computer controller
 * - Acting in a fuzzy, rather than strictly deterministic manner
 * - Being able to change course to avoid danger
 * - Laying bombs on the way to a destination if useful
 * - Favouring paths that turn corners
 */
(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Player} player The player to control
     * @param {Dyna.model.Level} level Provides access to the positions of other players
     * @param {Dyna.model.Map} map Allows the controller to navigate around the map
     * @param {Dyna.ai.DestinationChooser} destinationChooser Makes decisions about where to go
     */
    function ComputerController(player, level, map, destinationChooser) {
        this.player = player;
        this.level = level;
        this.map = map;
        this.destinationChooser = destinationChooser;
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
     * Chooses destinations from possibilities
     * @private
     * @type {Dyna.ai.DestinationChooser}
     */
    ComputerController.prototype.destinationChooser = null;

    /**
     * Ensures that the controller will stop working if the player dies
     * @private
     */
    ComputerController.prototype.initialise = function() {
        this.player.on(Dyna.model.Player.DIED, this.stopControlling.bind(this));
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
                var nextStep = this.currentPath[0], fbi = Dyna.service.FBI.instance;
                // if the next square is safe, or if the current space is in danger, move
                if (!fbi.estimateDangerAt(nextStep.x, nextStep.y) || fbi.estimateDangerAt(this.player.x, this.player.y)) {
                    this.player.move(nextStep.x, nextStep.y);
                    this.currentPath.shift();
                } else {
                    // freeze!
                    log("Freezing!");
                }
            } else {
                if (this.layingBombHereIsAGoodIdea(this.player.x, this.player.y)) {
                    this.player.layBomb();
                }
                this.currentPath = null;
            }
        }
    };

    /**
     * Determines whether laying another bomb will cause more harm than good.
     * For the sake of simplicity, at the moment this returns false if the player
     * has already laid one bomb. Otherwise the player tends to make silly decisions
     * resulting in lethal chain reactions :s
     */
    ComputerController.prototype.layingBombHereIsAGoodIdea = function(x, y) {

        // don't lay more than one bomb at once
        if (this.player.bombsLaid > 0) {
            return false;
        }

        var possibleExplosion = Dyna.model.Explosion.create(this.map, x, y, this.player.power);
        return possibleExplosion.blocksAffected > 0;
        // todo: include check to see if enemies might killed

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