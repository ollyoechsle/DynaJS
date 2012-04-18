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
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION * 5);
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
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
        var i, tile, fireballs = [], tileSize = Dyna.ui.LevelView.tileSize, cx, cy, start = +new Date(), delay;

        cx = (explosion.x + 0.5) * tileSize;
        cy = (explosion.y + 0.5) * tileSize;
        var expansionFn = Math.getGaussianFunction(0.33);

        fireballs.push(
                new Dyna.ui.Flash(cx, cy, explosion, 20, 20, tileSize, "#E83C0A", start)
                        .withExpansionFn(expansionFn)
                        .withOpacityFn(function() {
                    return 0.5
                })
                );

        fireballs.push(
                new Dyna.ui.Flash(cx, cy, explosion, 15, 15, tileSize - 5, "#F7EC64", start)
                        .withExpansionFn(expansionFn)
                );

        fireballs.push(
                new Dyna.ui.Flash(cx, cy, explosion, 5, 5, tileSize - 10, "#FFFFFF", start)
                        .withExpansionFn(expansionFn)
                );

        fireballs.push(
                new Dyna.ui.Flash(cx, cy, explosion, 15, 15, tileSize - 5, "rgba(0, 0, 0, 0)", start + 500)
                        .withOpacityFn(Math.getGaussianFunction(0.33))
                        .withDuration(1500)
                        .withShadow(20, '#000000')
                );

        /*     for (i = 0; i < explosion.tilesAffected.length; i++) {
         tile = explosion.tilesAffected[i];
         delay = 500 * Math.sqrt(Math.pow(tile.x - explosion.x, 2) + Math.pow(tile.y - explosion.y, 2));
         cx = (tile.x + 0.5) * tileSize;
         cy = (tile.y + 0.5) * tileSize;
         fireballs.push(new Dyna.ui.Smoke(cx, cy, tileSize / 4, Math.getGaussianFunction(0.1), start + delay)); // white hot
         }*/

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
                now = +new Date();
        for (i = 0; i < numFireballs; i++) {
            fireballs[i].render(ctx, now);
        }
    };

    CanvasExplosionView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
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
    CanvasExplosionView.DURATION = 500;

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);