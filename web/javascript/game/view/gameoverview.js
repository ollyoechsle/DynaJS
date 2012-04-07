(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {Dyna.app.Game} game The game
     */
    function GameOverView(jContainer, game) {
        this.jContainer = jQuery(jContainer);
        this.game = game;
        this.initialise();
    }

    /**
     * Reference to the game object
     * @private
     * @type {Dyna.app.Game}
     */
    GameOverView.prototype.game = null;

    /**
     * Starts listening for the game over message
     * @private
     */
    GameOverView.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on("gameover", this.showGameOverMessage.bind(this));
    };

    /**
     * Shows a game over message
     * @private
     */
    GameOverView.prototype.showGameOverMessage = function() {
        if (confirm("Game Over! Play again?")) {
            // for now, just refresh the window
            window.location.reload();
        }
    };

    Dyna.ui.GameOverView = GameOverView;

})(window.Dyna, jQuery);