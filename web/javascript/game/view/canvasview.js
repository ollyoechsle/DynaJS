(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     */
    function CanvasView(jContainer) {
        this.ctx = this.createContext(jQuery(jContainer));
    }

    /**
     * The container of the explosion element
     * @private
     * @type {jQuery}
     */
    CanvasView.prototype.jContainer = null;

    /**
     * The canvas context
     * @private
     * @type {CanvasRenderingContext2D}
     */
    CanvasView.prototype.ctx = null;

    /**
     * A list of the animations
     * @type {Object[]}
     */
    CanvasView.prototype.animations = null;

    /**
     * The current id for the next animation frame
     * @param {Number}
            */
    CanvasView.prototype.animationId = null;

    CanvasView.prototype.createContext = function(jLevel) {
        this.jContainer = jQuery("<canvas class='explosion'></canvas>")
                .attr("width", jLevel.width())
                .attr("height", jLevel.width())
                .appendTo(jLevel);
        return this.jContainer[0].getContext("2d");
    };

    /**
     * Adds fireballs to create an explosion
     */
    CanvasView.prototype.render = function() {
        this.animationId = requestAnimationFrame(this.render.bind(this));
        this.clear();
        var ctx = this.ctx, i,
                animations = this.animations,
                numAnimations = animations.length,
                now = +new Date();
        for (i = 0; i < numAnimations; i++) {
            animations[i].render(ctx, now);
        }
    };

    /**
     * Wipes the entire context
     */
    CanvasView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
    };

    /**
     * Removes the explosion element from the page
     */
    CanvasView.prototype.destroy = function() {
        cancelAnimationFrame(this.animationId);
        this.jContainer.remove();
    };

    Dyna.ui.CanvasView = CanvasView;

})(window.Dyna, jQuery);