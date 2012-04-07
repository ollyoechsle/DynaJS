/**
 * Takes care of the main game logic. Winning, losing etc.
 */
(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Level} level The level
     * @param {Dyna.ui.LevelView} levelView The view for the level
     */
    function Game(level, levelView) {


        this.level = level;
        this.levelView = levelView;
        this.players = [];

        this._initialiseEvents();

    }

    /**
     * @private
     * @type {Dyna.model.Level}
     */
    Game.prototype.level = null;

    /**
     * @private
     * @type {Dyna.ui.LevelView}
     */
    Game.prototype.levelView = null;

    Game.prototype.players = null;

    Game.prototype._initialiseEvents = function() {
        this.level.on(Dyna.model.Level.ENDED, this.gameOver.bind(this));
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
    };

    Game.prototype.gameOver = function(remainingPlayers) {
        log("Game Over", remainingPlayers)
        Dyna.app.GlobalEvents.fire("gameover");
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.start = function() {
        log("Starting Dyna Game on level " + this.level.name);
        this.levelView.updateAll();
    };

    Dyna.app.Game = Game;

})(window.Dyna);