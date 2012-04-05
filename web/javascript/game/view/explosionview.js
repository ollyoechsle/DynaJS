(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    function ExplosionView(jContainer, explosion, map) {
        this.jContainer = jQuery(jContainer);
        this.createExplosion(explosion, map);
        window.setTimeout(this.destroy.bind(this), ExplosionView.DURATION);
    }

    /**
     * The container of the explosion element
     * @private
     * @type {jQuery}
     */
    ExplosionView.prototype.jContainer = null;

    /**
     * The explosion element containing a number of fireballs
     * @private
     * @type {jQuery}
     */
    ExplosionView.prototype.jExplosion = null;

    /**
     * Adds fireballs to create an explosion
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    ExplosionView.prototype.createExplosion = function(explosion, map) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            if (map.inBounds(tile.x, tile.y)) {
                fragment.appendChild(ExplosionView.createFireBall(tile.x, tile.y));
            }
        }
        this.jExplosion = jQuery("<div></div>").append(fragment);
        this.jContainer.append(this.jExplosion);
        this.boom();
    };

    /**
     * Static method to create a fireball
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    ExplosionView.createFireBall = function(x, y) {
        return jQuery("<div class='fireBall'></div>")
            .css("left", x * Dyna.ui.LevelView.tileSize)
            .css("top", y * Dyna.ui.LevelView.tileSize)
            [0];
    };

    /**
     * Plays a boom sound
     */
    ExplosionView.prototype.boom = function() {
        var snd = new window.Audio("snd/explosion.wav");
        snd.play();
    };

    /**
     * Removes the explosion element from the page
     */
    ExplosionView.prototype.destroy = function() {
        this.jExplosion.remove();
    };

    /**
     * The amount of time (in ms) that the view will live for.
     * @type {Number}
     */
    ExplosionView.DURATION = 800;

    Dyna.ui.ExplosionView = ExplosionView;

})(window.Dyna, jQuery);