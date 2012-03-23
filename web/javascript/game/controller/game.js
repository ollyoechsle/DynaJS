(function(Dyna) {

    /**
     * Constructor
     */
    function Game() {

        log("Starting Dyna Game");
        this.players = [];
        this._initialiseEvents();

    }

    Game.prototype.players = null;

    Game.prototype._initialiseEvents = function() {
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.addPlayer = function(player) {
        this.players.push(player);
        log("Game has " + this.players.length + " player(s)")
    };

    Game.prototype.start = function() {
    };

    Dyna.app.Game = Game;

})(window.Dyna);