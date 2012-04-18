(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function LevelView(jContainer, level, mapViewFactory, lifeformViewFactory, bombViewFactory, explosionViewFactory) {
        log("Creating LevelView for  " + level.name);

        this.jContainer = jQuery(jContainer);
        this.level = level;

        this.lifeformViewFactory = lifeformViewFactory;
        this.lifeformViews = [];

        this.mapViewFactory = mapViewFactory;
        this.mapView = null;

        this.bombViewFactory = bombViewFactory;
        this.explosionViewFactory = explosionViewFactory;

        this.initialise();
    }

    LevelView.prototype.jContainer = null;
    LevelView.prototype.level = null;

    LevelView.prototype.lifeformViewFactory = null;
    LevelView.prototype.lifeformViews = null;

    LevelView.prototype.mapViewFactory = null;
    LevelView.prototype.mapView = null;

    LevelView.prototype.bombViewFactory = null;
    LevelView.prototype.explosionViewFactory = null;

    LevelView.prototype.initialise = function() {
        log("Initialising level view");

        this.level.on(Dyna.model.Level.LIFEFORM_ADDED, this._createViewForLifeForm.bind(this));
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

    LevelView.prototype._createViewForLifeForm = function(lifeform) {
        this.lifeformViews.push(this.lifeformViewFactory(lifeform))
    };

    LevelView.prototype.updateAll = function() {

        this.mapView.updateAll(this.level);
        for (var i = 0; i < this.lifeformViews.length; i++) {
            this.lifeformViews[i].updateAll();
        }

    };
    
    LevelView.tileSize = 50;

    Dyna.ui.LevelView = LevelView;

})(window.Dyna, jQuery);