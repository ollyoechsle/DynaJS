(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container (".menuContainer")
     * @param {Dyna.app.Game} game The game model object
     * @param {Function} menuControlFactory A factory function to return a menu control set up with key mappings
     */
    function GameOverView(jContainer, game, menuControlFactory) {
        this.jContainer = jQuery(jContainer);
        this.game = game;
        this.menuControlFactory = menuControlFactory;
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

        this.jContainer.removeClass("hidden");
        this.jContainer.find("h2").text("Game Over");

        this.menuControlFactory()
            .withItem("Play Again?", this.onPlayAgainPressed.bind(this))
            .withItem("High Scores", this.onPlayAgainPressed.bind(this))
            .showOn(this.jContainer.find("ul"));

    };

    /**
     * Handles the user wanting to play again
     */
    GameOverView.prototype.onPlayAgainPressed = function() {
        // for now, just refresh the window
        window.location.reload();
    };

    Dyna.ui.GameOverView = GameOverView;

})(window.Dyna, jQuery);