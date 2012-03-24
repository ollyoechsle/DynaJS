(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function LevelView(jContainer, level, mapViewClass, playerViewClass) {
        log("Creating LevelView for  " + level.name);

        this.jContainer = jQuery(jContainer);
        this.level = level;

        this.playerViewClass = playerViewClass;
        this.playerViews = [];

        this.mapViewClass = mapViewClass;
        this.mapView = null;

        this.initialise();
    }

    LevelView.prototype.jContainer = null;
    LevelView.prototype.level = null;

    LevelView.prototype.playerViewClass = null;
    LevelView.prototype.playerViews = null;

    LevelView.prototype.mapViewClass = null;
    LevelView.prototype.mapView = null;

    LevelView.prototype.initialise = function() {
        log("Initialising level view");
        LevelView.tileSize = 30;
        this.level.on(Dyna.model.Level.PLAYER_ADDED, this._createPlayerView.bind(this));
        this.mapView = new this.mapViewClass(this.jContainer, this.level.map)
    };

    LevelView.prototype._createPlayerView = function(player) {
        log("LevelView: Creating view for new player");
        this.playerViews.push(new this.playerViewClass(this.jContainer, player))
    };

    LevelView.prototype.updateAll = function() {

        this.mapView.updateAll(this.level);
        for (var i = 0; i < this.playerViews.length; i++) {
            this.playerViews[i].updateAll();
        }

    };

    Dyna.ui.LevelView = LevelView;

})(window.Dyna, jQuery);