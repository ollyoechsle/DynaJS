(function(Dyna) {

    /**
     * Constructor
     */
    function Game(map, mapView) {

        log("Starting Dyna Game on map " + map.name);
        this.players = [];
        this.map = map;
        this.mapView = mapView;
        this._initialiseEvents();

    }

    Game.prototype.players = null;
    Game.prototype.map = null;
    Game.prototype.mapView = null;

    Game.prototype._initialiseEvents = function() {
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.addPlayer = function(player) {        
        this.players.push(player);
        log("Game has " + this.map.players.length + " player(s)")
    };

    Game.prototype.start = function() {
        this.mapView.updateAll();
    };

    Dyna.app.Game = Game;

})(window.Dyna);