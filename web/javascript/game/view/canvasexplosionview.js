(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    function CanvasExplosionView(jContainer, explosion, map) {
        this.initialise(jQuery(jContainer));
        this.explosion = explosion;
        this.map = map;
        this.start = +new Date();
        this.interval = window.setInterval(this.render.bind(this), 1000 / 24);
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION);
    }

    /**
     * The container of the explosion element
     * @private
     * @type {jQuery}
     */
    CanvasExplosionView.prototype.jContainer = null;

    /**
     * @type {Number} The start time
     */
    CanvasExplosionView.prototype.start = null;

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
     */
    CanvasExplosionView.prototype.render = function() {
        this.clear();
        var ctx = this.ctx, i, tile, explosion = this.explosion, map = this.map, elapsed = this.getTimeElapsed() / CanvasExplosionView.DURATION;
        for (i = 0; i < explosion.tilesAffected.length; i++) {
            tile = explosion.tilesAffected[i];
            if (map.inBounds(tile.x, tile.y)) {
                this.drawFireBall(ctx, tile.x, tile.y, Dyna.ui.LevelView.tileSize * elapsed);
            }
        }
        this.boom();
    };

    /**
     * Static method to create a fireball
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     * @param {Number} size The size of the fireball
     */
    CanvasExplosionView.prototype.drawFireBall = function(ctx, x, y, size) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x * Dyna.ui.LevelView.tileSize, y * Dyna.ui.LevelView.tileSize, size, size);
    };

    CanvasExplosionView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
    };

    CanvasExplosionView.prototype.getTimeElapsed = function() {
        return +new Date() - this.start;
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
        window.clearInterval(this.interval);
        this.jContainer.remove();
    };

    /**
     * The amount of time (in ms) that the view will live for.
     * @type {Number}
     */
    CanvasExplosionView.DURATION = 800;

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);