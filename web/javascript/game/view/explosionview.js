(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function ExplosionView(jContainer, explosion, map) {
        this.jContainer = jQuery(jContainer);
        this.explosion = explosion;
        this.map = map;
        this.initialise();
    }

    ExplosionView.prototype.map = null;
    ExplosionView.prototype.explosion = null;
    ExplosionView.prototype.jContainer = null;
    ExplosionView.prototype.jExplosion = null;

    ExplosionView.prototype.initialise = function() {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < this.explosion.tilesAffected.length; i++) {
            var tile = this.explosion.tilesAffected[i];
            if (this.map.inBounds(tile.x, tile.y)) {
                fragment.appendChild(jQuery("<div class='fireBall'></div>")
                        .css("left", tile.x * Dyna.ui.LevelView.tileSize)
                        .css("top", tile.y * Dyna.ui.LevelView.tileSize)
                        [0]);
            }
        }
        this.jContainer.append(fragment);
        this.boom();
    };

    ExplosionView.prototype.boom = function() {
        var snd = new Audio("snd/explosion.wav");
        snd.play();
    };

    Dyna.ui.ExplosionView = ExplosionView;

})(window.Dyna, jQuery);