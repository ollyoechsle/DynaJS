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

    CanvasView.prototype.createContext = function(jContainer) {
        this.jContainer = jQuery("<canvas></canvas>").addClass(this.className)
                .attr("width", jContainer.width())
                .attr("height", jContainer.width())
                .appendTo(jContainer);
        return this.jContainer[0].getContext("2d");
    };

    /**
     * Performs the animation loop
     */
    CanvasView.prototype.animate = function() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.render();
    };

    CanvasView.prototype.render = function() {
        var ctx = this.ctx, i,
                animations = this.animations,
                numAnimations = animations.length,
                now = +new Date();
        this.clear();
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