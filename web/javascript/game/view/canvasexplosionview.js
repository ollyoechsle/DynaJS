(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    function CanvasExplosionView(jContainer, explosion, map) {
        this.ctx = this.createContext(jQuery(jContainer));
        this.fireballs = this.createExplosion(explosion, map);
        this.start = +new Date();
        this.interval = window.setInterval(this.render.bind(this), 1000 / 24);
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION);
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
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

    CanvasExplosionView.prototype.fireballs = null;

    CanvasExplosionView.prototype.createContext = function(jLevel) {
        this.jContainer = jQuery("<canvas class='explosion'></canvas>")
                .attr("width", jLevel.width())
                .attr("height", jLevel.width())
                .appendTo(jLevel);
        return this.jContainer[0].getContext("2d");
    };

    CanvasExplosionView.prototype.createExplosion = function(explosion, map) {
        var i, tile, fireballs = [];
        for (i = 0; i < explosion.tilesAffected.length; i++) {
            tile = explosion.tilesAffected[i];
            if (map.inBounds(tile.x, tile.y)) {
                fireballs.push(new FireBall(tile.x * Dyna.ui.LevelView.tileSize, tile.y * Dyna.ui.LevelView.tileSize));
            }
        }
        return fireballs;
    };

    /**
     * Adds fireballs to create an explosion
     */
    CanvasExplosionView.prototype.render = function() {
        this.clear();
        var ctx = this.ctx, i,
                fireballs = this.fireballs,
                numFireballs = fireballs.length,
                elapsed = this.getTimeElapsed();
        for (i = 0; i < numFireballs; i++) {
            fireballs[i].render(ctx, elapsed);
        }
    };

    CanvasExplosionView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
    };

    CanvasExplosionView.prototype.getTimeElapsed = function() {
        return (+new Date() - this.start) / CanvasExplosionView.DURATION;
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

    function FireBall(x, y) {
        this.x = x;
        this.y = y;
    }

    FireBall.prototype.render = function(ctx, time) {
        var size = Dyna.ui.LevelView.tileSize;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, time * size, time * size);
    };

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);