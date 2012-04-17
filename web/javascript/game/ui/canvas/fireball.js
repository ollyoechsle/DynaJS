(function() {

    function FireBall(x, y, size, fn, color, start) {
        this.x = x;
        this.y = y;
        this.expansionFn = fn;
        this.size = size;
        this.color = color;
        this.start = start;
    }

    /**
     * @type {Number} The start time
     */
    FireBall.prototype.start = null;

    FireBall.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / CanvasExplosionView.DURATION;
    };

    FireBall.prototype.render = function(ctx, now) {
        var size = this.size * this.expansionFn(this.getTimeElapsed(now)), radius = size / 2;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    };

    Dyna.ui.FireBall = FireBall;

})();