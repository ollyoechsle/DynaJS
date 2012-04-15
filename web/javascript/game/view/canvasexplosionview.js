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
        this.render();
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

    CanvasExplosionView.prototype.animationId = null;

    CanvasExplosionView.prototype.createContext = function(jLevel) {
        this.jContainer = jQuery("<canvas class='explosion'></canvas>")
                .attr("width", jLevel.width())
                .attr("height", jLevel.width())
                .appendTo(jLevel);
        return this.jContainer[0].getContext("2d");
    };

    CanvasExplosionView.prototype.createExplosion = function(explosion, map) {
        var i, tile, fireballs = [], tileSize = Dyna.ui.LevelView.tileSize, cx, cy;
        for (i = 0; i < explosion.tilesAffected.length; i++) {
            tile = explosion.tilesAffected[i];
            if (map.inBounds(tile.x, tile.y)) {
                cx = (tile.x + 0.5) * tileSize;
                cy = (tile.y + 0.5) * tileSize;
                fireballs.push(new FireBall(cx, cy, tileSize / 4, Math.getGaussianFunction(), "#FDF895")); // white yellow
                fireballs.push(new FireBall(cx, cy, tileSize, Math.getGaussianFunction(), "#E83C0A")); // red
                fireballs.push(new FireBall(cx, cy, tileSize / 2, Math.getGaussianFunction(), "#F7EC64")); // yellow
            }
        }
        return fireballs;
    };

    /**
     * Adds fireballs to create an explosion
     */
    CanvasExplosionView.prototype.render = function() {
        this.animationId = requestAnimationFrame(this.render.bind(this));
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
        cancelAnimationFrame(this.animationId);
        this.jContainer.remove();
    };

    /**
     * The amount of time (in ms) that the view will live for.
     * @type {Number}
     */
    CanvasExplosionView.DURATION = 800;

    function FireBall(x, y, size, fn, color) {
        this.x = x;
        this.y = y;
        this.fn = fn;
        this.size = size;
        this.color = color;
    }

    FireBall.prototype.render = function(ctx, time) {
        var size = this.size * this.fn(time), radius = size / 2;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = time;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    };

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);