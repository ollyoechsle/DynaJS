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
     */
    function ComputerController(player, level, map) {
        this.player = player;
        this.level = level;
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
            chosenDestination = this.chooseDestinationFrom(pathFinder.getAvailableDestinations());

        if (chosenDestination) {
            this.currentPath = pathFinder.getPathTo(chosenDestination.x, chosenDestination.y);
        }

    };

    ComputerController.prototype.getScoreForDestination = function(x, y) {

        var score = 0;

        // get points for blowing up walls
        var possibleExplosion = Dyna.model.Explosion.create(this.map, x, y, this.player.power);
        score += possibleExplosion.blocksAffected;

        // points for power ups
        if (this.map.isPowerUp(x, y)) {
            score += 10;
        }

        // points for being closer to other players
        var minDistance = this.map.maxDistance;
        for (var i = 0; i < this.level.players.length; i++) {
            var player = this.level.players[i];
            if (player !== this.player) {
                var distance = player.distanceTo(x, y);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        var percentDistance = minDistance / this.map.maxDistance;
        score += (1 - percentDistance);

        // fewer points for being the current position
        if (x == this.player.x && y == this.player.y) {
            score -= 2;
        }

        // fewer points for the square being in imminent danger
        if (Dyna.service.FBI.instance.estimateDangerAt(x, y)) {
            score -= 20;
        }

        return score;

    };

    /**
     * Chooses a destination to travel to from a list of potential destinations
     * @param {Object[]} potentialDestinations The list of destinations
     */
    ComputerController.prototype.chooseDestinationFrom = function(potentialDestinations) {

        var maxScore = 0, destination, chosenDestination, score;

        for (var i = 0; i < potentialDestinations.length; i++) {

            destination = potentialDestinations[i];
            score = this.getScoreForDestination(destination.x, destination.y);

            if (score > maxScore) {
                maxScore = score;
                chosenDestination = destination;
            }

        }

        return chosenDestination;
    };

    /**
     * Stops the computer controller from affecting the player
     */
    ComputerController.prototype.stopControlling = function() {
        window.clearInterval(this.interval);
    };

    ComputerController.SPEED = 500;

    Dyna.app.ComputerController = ComputerController;

})(window.Dyna);