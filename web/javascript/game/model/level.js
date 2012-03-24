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
            log("Game has " + this.players.length + " player(s)");
            this.fire(Level.PLAYER_ADDED, player);
        } else {
            log("No room for this player on the map");
        }
    };

    Level.PLAYER_ADDED = "playerAdded";

    Dyna.model.Level = Level;

})(window.Dyna);