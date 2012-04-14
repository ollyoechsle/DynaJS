(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    function CanvasExplosionView(jContainer, explosion, map) {
        this.initialise(jQuery(jContainer));
        this.createExplosion(explosion, map);
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION);
    }

    /**
     * The container of the explosion element
     * @private
     * @type {jQuery}
     */
    CanvasExplosionView.prototype.jContainer = null;

    /**
     * The canvas context
     * @private
     * @type {CanvasRenderingContext2D}
     */
    CanvasExplosionView.prototype.ctx = null;

    CanvasExplosionView.prototype.initialise = function(jLevel) {
        this.jContainer = jQuery("<canvas class='explosion'></canvas>")
                .attr("width", jLevel.width())
                .attr("height", jLevel.width())
                .appendTo(jLevel);
        this.ctx = this.jContainer[0].getContext("2d");
    };

    /**
     * Adds fireballs to create an explosion
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    CanvasExplosionView.prototype.createExplosion = function(explosion, map) {
        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            if (map.inBounds(tile.x, tile.y)) {
                this.drawFireBall(tile.x, tile.y);
            }
        }
        this.boom();
    };

    /**
     * Static method to create a fireball
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    CanvasExplosionView.prototype.drawFireBall = function(x, y) {
        var ctx = this.ctx;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x * Dyna.ui.LevelView.tileSize, y * Dyna.ui.LevelView.tileSize, Dyna.ui.LevelView.tileSize, Dyna.ui.LevelView.tileSize);
    };

    CanvasExplosionView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
    };

    /**
     * Plays a boom sound
     */
    CanvasExplosionView.prototype.boom = function() {
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
    };

    /**
     * Removes the explosion element from the page
     */
    CanvasExplosionView.prototype.destroy = function() {
        this.jContainer.remove();
    };

    /**
     * The amount of time (in ms) that the view will live for.
     * @type {Number}
     */
    CanvasExplosionView.DURATION = 800;

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);