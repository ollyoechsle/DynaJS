(function(Dyna) {

    /**
     * Constructor
     */
    function Level(name, map) {

        this.superclass.constructor.call(this);

        log("Creating level " + name);
        this.map = map;
        this.players = [];

    }

    Object.extend(Level, Dyna.events.CustomEvent);

    Level.prototype.map = null;
    Level.prototype.players = [];

    Level.prototype.addPlayer = function(player) {
        if (this.map.findPositionFor(player)) {
            this.players.push(player);
            player.on(Dyna.model.Player.WANTS_TO_MOVE, this.handlePlayerMove.bind(this));
            player.on(Dyna.model.Player.LAID_BOMB, this.handleBombAdded.bind(this));
            this.fire(Level.PLAYER_ADDED, player);
        } else {
            log("No room for this player on the map");
        }
    };

    Level.prototype.handleBombAdded = function(bomb) {
        this.fire(Level.BOMB_ADDED, bomb);
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExploded.bind(this));
    };

    Level.prototype.handleBombExploded = function(explosion) {
        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            this.map.destroy(tile.x, tile.y);
        }
        this.fire(Level.MAP_UPDATED);
    };

    Level.prototype.handlePlayerMove = function(player, x, y) {
        if (this.map.isFree(x, y)) {
            player.moveTo(x, y);
        }
    };

    /** @event */
    Level.PLAYER_ADDED = "playerAdded";

    /** @event */
    Level.BOMB_ADDED = "bombAdded";

    /** @event */
    Level.MAP_UPDATED = "mapUpdated";

    Dyna.model.Level = Level;

})(window.Dyna);