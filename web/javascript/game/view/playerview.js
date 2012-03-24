(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function PlayerView(jContainer, player) {
        log("Creating player view for  " + player.name);
        this.jContainer = jQuery(jContainer);
        this.initialise();
    }

    PlayerView.prototype.initialise = function() {

    };

    PlayerView.prototype.updateAll = function() {

    };

    Dyna.ui.PlayerView = PlayerView;

})(window.Dyna, jQuery);