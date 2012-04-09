(function(Dyna) {

    function DestinationChooser(weights) {
        this.weights = weights;
    }

    /**
     * A map which determines which functions (see end of class) should have what weights.
     * This is used in destination choosing to create a score for each of the possible destinations.
     */
    DestinationChooser.prototype.weights = null;

    /**
     * Chooses a destination to travel to from a list of potential destinations
     * @param {Object[]} potentialDestinations The list of destinations
     * @param {Dyna.model.Level} level
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.chooseDestinationFrom = function(potentialDestinations, level, map, me) {

        var maxScore = 0, destination, chosenDestination;

        for (var i = 0; i < potentialDestinations.length; i++) {

            destination = potentialDestinations[i];
            destination.score = this.getScoreForDestination(destination.x, destination.y, level, map, me);

            if (destination.score > maxScore) {
                maxScore = destination.score;
                chosenDestination = destination;
            }

        }

        return chosenDestination;
    };

    /**
     * Calculates a score for a destination based on a number of metrics including whether
     * laying a bomb in that location would break walls, whether it is close to another player
     * whether it is a powerup. Negative points are awarded for being especially dangerous etc.
     * The higher the score returned, the better prospect the destination is.
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Level} level
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.getScoreForDestination = function(x, y, level, map, me) {

        // todo: allow the decisions made here to be more fuzzy
        // todo: favour destinations which turn the user away from the explosion as soon as possible
        // todo: fewer points for being close to monsters
        var score = 0, key, weight;

        for (key in this.weights) {
            weight = this.weights[key];
            score += this[key](x, y, level, map, me) * weight;
        }

        return score;

    };

    /**
     * Returns the distance to the closest player who isn't me. This distance
     * is expressed as a percentage, so if the closest player is as far as possible away
     * the function would return 1. If the closest player is right next to the position
     * the function will return 0.
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player[]} players All the players on the level
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.getDistanceToClosestPlayer = function(x, y, map, players, me) {
        var minDistance = map.maxDistance, player, i;
        for (i = 0; i < players.length; i++) {
            player = players[i];
            if (player !== me) {
                var distance = player.distanceTo(x, y);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        return minDistance / map.maxDistance;
    };

    DestinationChooser.prototype.BREAK_WALLS = function(x, y, level, map, me) {
        var possibleExplosion = Dyna.model.Explosion.create(map, x, y, me.power);
        return possibleExplosion.blocksAffected;
    };

    DestinationChooser.prototype.IS_POWER_UP = function(x, y, level, map, me) {
        return map.isPowerUp(x, y) ? 1 : 0;
    };

    DestinationChooser.prototype.CLOSE_TO_OTHER_PLAYERS = function(x, y, level, map, me) {
        return 1 - this.getDistanceToClosestPlayer(x, y, map, level.players, me);
    };

    DestinationChooser.prototype.SAME_AS_CURRENT_POSITION = function(x, y, level, map, me) {
        return (x == me.x && y == me.y) ? 1 : 0;
    };

    DestinationChooser.prototype.IN_DANGER_OF_EXPLOSION = function(x, y, level, map, me) {
        return Dyna.service.FBI.instance.estimateDangerAt(x, y) ? 1 : 0;
    };

    Dyna.ai.DestinationChooser = DestinationChooser;

})(window.Dyna);