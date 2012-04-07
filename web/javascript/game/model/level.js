(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the level
     * @param {Dyna.model.Map} map The map being played on
     */
    function Level(name, map) {

        this.superclass.constructor.call(this);

        log("Creating level " + name);
        this.map = map;
        this.players = [];

    }

    Object.extend(Level, Dyna.events.CustomEvent);

    /**
     * The map
     * @private
     * @type {Dyna.model.Map}
     */
    Level.prototype.map = null;

    /**
     * A list of all the players on the map
     * @private
     * @type {Dyna.model.Player[]}
     */
    Level.prototype.players = [];

    /**
     * Adds a player and listens for events in the player's life
     * @param {Dyna.model.Player} player The player just added
     */
    Level.prototype.addPlayer = function(player) {
        if (this.map.findPositionFor(player)) {
            this.players.push(player);
            player.on(Dyna.model.Player.WANTS_TO_MOVE, this.handlePlayerMove.bind(this));
            player.on(Dyna.model.Player.LAID_BOMB, this.handleBombAdded.bind(this));
            player.on(Dyna.model.Player.DIED, this.handlePlayerDied.bind(this));
            this.fire(Level.PLAYER_ADDED, player);
        } else {
            log("No room for this player on the map");
        }
    };

    /**
     * Handles a bomb added, and starts to listen for explosion
     * @param {Dyna.model.Bomb} bomb The bomb
     */
    Level.prototype.handleBombAdded = function(bomb) {
        this.fire(Level.BOMB_ADDED, bomb);
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExploded.bind(this));
    };

    /**
     * Destroys tiles affected by an exposion
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     * @param {Number} power The power of the bomb
     */
    Level.prototype.handleBombExploded = function(x, y, power) {

        var explosion = Dyna.model.Explosion.create(this.map, x, y, power);

        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            this.map.destroy(tile.x, tile.y);
        }

        Dyna.app.GlobalEvents.fire(Level.EXPLOSION, explosion);

    };

    /**
     * Manages power ups and allows players to move
     * @param {Dyna.model.Player} player
     * @param {Number} x The X position where the player wants to move to
     * @param {Number} y The Y position where the player wants to move to
     */
    Level.prototype.handlePlayerMove = function(player, x, y) {
        if (this.map.isFree(x, y)) {
            player.moveTo(x, y);
            if (this.map.steppedOnLevelUp(x, y)) {
                this.fire(Level.LEVEL_UP, player);
                player.powerUp();
            }
        }
    };

    /**
     * Handles the event where a player dies
     */
    Level.prototype.handlePlayerDied = function() {
        if (this.getRemainingPlayers().length <= 1) {
            window.setTimeout(this.endLevel.bind(this), 3000);
        }
    };

    /**
     * Gets the remaining living players
     * @return {Dyna.model.Player[]}
     */
    Level.prototype.getRemainingPlayers = function() {
        var playersStillAlive = [];
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (!player.dead) {
                playersStillAlive.push(player);
            }
        }
        return playersStillAlive;
    };

    /**
     * Fires the end level event with the remaining living players
     */
    Level.prototype.endLevel = function() {
        this.fire(Level.ENDED, this.getRemainingPlayers());
    };

    /** @event */
    Level.PLAYER_ADDED = "playerAdded";

    /** @event */
    Level.BOMB_ADDED = "bombAdded";

    /** @event */
    Level.EXPLOSION = "bombExploded";

    /** @event */
    Level.LEVEL_UP = "levelUp";

    /** @event */
    Level.ENDED = "ended";

    Dyna.model.Level = Level;

})(window.Dyna);