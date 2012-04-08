(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function LevelView(jContainer, level, mapViewFactory, playerViewFactory, bombViewFactory, explosionViewFactory) {
        log("Creating LevelView for  " + level.name);

        this.jContainer = jQuery(jContainer);
        this.level = level;

        this.playerViewFactory = playerViewFactory;
        this.playerViews = [];

        this.mapViewFactory = mapViewFactory;
        this.mapView = null;

        this.bombViewFactory = bombViewFactory;
        this.explosionViewFactory = explosionViewFactory;

        this.initialise();
    }

    LevelView.prototype.jContainer = null;
    LevelView.prototype.level = null;

    LevelView.prototype.playerViewFactory = null;
    LevelView.prototype.playerViews = null;

    LevelView.prototype.mapViewFactory = null;
    LevelView.prototype.mapView = null;

    LevelView.prototype.bombViewFactory = null;
    LevelView.prototype.explosionViewFactory = null;

    LevelView.prototype.initialise = function() {
        log("Initialising level view");
        LevelView.tileSize = 30;
        this.level.on(Dyna.model.Level.PLAYER_ADDED, this._createPlayerView.bind(this));
        this.level.on(Dyna.model.Level.BOMB_ADDED, this._handleBombLaid.bind(this));
        this.level.on(Dyna.model.Level.LEVEL_UP, this._handlePlayerLevelUp.bind(this));

        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this._handleExplosion.bind(this));

        this.mapView = this.mapViewFactory(this.level.map)
    };

    LevelView.prototype._handleBombLaid = function(bomb) {
        this.bombViewFactory(bomb);
    };

    LevelView.prototype._handleExplosion = function(explosion) {
        this.explosionViewFactory(explosion);
    };

    LevelView.prototype._handlePlayerLevelUp = function(player) {
        Dyna.util.Sound.play(Dyna.util.Sound.POWERUP);
        this.mapView.updateAll(this.level);
    };

    LevelView.prototype._createPlayerView = function(player) {
        this.playerViews.push(this.playerViewFactory(player))
    };

    LevelView.prototype.updateAll = function() {

        this.mapView.updateAll(this.level);
        for (var i = 0; i < this.playerViews.length; i++) {
            this.playerViews[i].updateAll();
        }

    };

    Dyna.ui.LevelView = LevelView;

})(window.Dyna, jQuery);