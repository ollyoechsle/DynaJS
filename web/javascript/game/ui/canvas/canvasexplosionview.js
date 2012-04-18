(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     * @param {Dyna.model.Map} map The map
     */
    function CanvasExplosionView(jContainer, explosion) {
        CanvasExplosionView.superclass.constructor.call(this, jContainer);
        this.animations = this.createExplosion(explosion);
        this.render();
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION * 5);
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
    }

    Object.extend(CanvasExplosionView, Dyna.ui.CanvasView);

    CanvasExplosionView.prototype.createExplosion = function(explosion) {
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

        return fireballs;
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