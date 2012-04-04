(function(Dyna) {

    function DestinationChooser() {
    }

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

        var score = 0, possibleExplosion;

        // get points for blowing up walls
        possibleExplosion = Dyna.model.Explosion.create(map, x, y, me.power);
        score += possibleExplosion.blocksAffected;

        // points for power ups
        if (map.isPowerUp(x, y)) {
            score += 10;
        }

        // points for being closer to other players
        score += 2 * (1 - this.getDistanceToClosestPlayer(x, y, map, level.players, me));

        // fewer points for being the current position
        if (x == me.x && y == me.y) {
            score -= 2;
        }

        // fewer points for the square being in imminent danger
        if (Dyna.service.FBI.instance.estimateDangerAt(x, y)) {
            score -= 20;
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

    Dyna.ai.DestinationChooser = DestinationChooser;

})(window.Dyna);