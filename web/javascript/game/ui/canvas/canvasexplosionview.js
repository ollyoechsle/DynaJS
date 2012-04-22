(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     */
    function CanvasExplosionView(jContainer, explosion, collisionDetection) {
        CanvasExplosionView.superclass.constructor.call(this, jContainer);
        this.animations = this.createExplosion(explosion, collisionDetection);
        this.animate();
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION * 5);
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
    }

    Object.extend(CanvasExplosionView, Dyna.ui.CanvasView);

    CanvasExplosionView.prototype.className = "explosion";

    CanvasExplosionView.prototype.createExplosion = function(explosion, collisionDetection) {
        var i, tile, animations = [], tileSize = Dyna.ui.LevelView.tileSize, cx, cy, start = +new Date(), delay;

        cx = (explosion.x + 0.5) * tileSize;
        cy = (explosion.y + 0.5) * tileSize;
        var expansionFn = Math.getGaussianFunction(0.33);

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 20, 20, tileSize, "#E83C0A", start)
                        .withExpansionFn(expansionFn)
                        .withOpacityFn(function() {
                    return 0.5
                })
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 15, 15, tileSize - 5, "#F7EC64", start)
                        .withExpansionFn(expansionFn)
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 5, 5, tileSize - 10, "#FFFFFF", start)
                        .withExpansionFn(expansionFn)
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 15, 15, tileSize - 5, "rgba(0, 0, 0, 0)", start + 500)
                        .withOpacityFn(Math.getGaussianFunction(0.33))
                        .withDuration(1500)
                        .withShadow(20, '#000000')
                );

        for (i = 0; i < 25; i++) {
            animations.push(new Dyna.ui.Shrapnel(cx, cy, tileSize / 2, collisionDetection));
        }

        return animations;
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