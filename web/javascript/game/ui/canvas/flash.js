(function(Dyna) {

    function Flash(x, y, explosion, innerWidth, outerWidth, tileSize, color, start) {
        this.x = x;
        this.y = y;
        this.innerWidth = innerWidth;
        this.outerWidth = outerWidth;
        this.fn = Math.getGaussianFunction(0.5);
        this.color = color;
        if (explosion.northExtent) {
            this.northPoint = tileSize * (explosion.northExtent + 0.5);
        }

        if (explosion.eastExtent) {
            this.eastPoint = tileSize * (explosion.eastExtent + 0.5);

        }
        if (explosion.southExtent) {
            this.southPoint = tileSize * (explosion.southExtent + 0.5);

        }
        if (explosion.westExtent) {
            this.westPoint = tileSize * (explosion.westExtent + 0.5);
        }

        this.start = start;
        this.opacity = 1.0;
    }

    /**
     * @type {Number} The start time
     */
    Flash.prototype.start = null;
    Flash.prototype.x = null;
    Flash.prototype.y = null;
    Flash.prototype.northPoint = null;
    Flash.prototype.southPoint = null;
    Flash.prototype.eastPoint = null;
    Flash.prototype.westPoint = null;
    Flash.prototype.fn = null;
    Flash.prototype.color = null;
    Flash.prototype.innerWidth = null;
    Flash.prototype.outerWidth = null;

    Flash.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / Dyna.ui.CanvasExplosionView.DURATION;
    };

    Flash.prototype.render = function(ctx, now) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        var
                progress = this.fn(this.getTimeElapsed(now)),
                innerWidth = this.innerWidth * progress,
                outerWidth = this.outerWidth * progress,
                furthest;

        ctx.beginPath();

        ctx.moveTo(this.x - innerWidth, this.y - innerWidth);

        // north point
        if (this.northPoint) {
            furthest = this.y - (this.northPoint * progress);
            ctx.lineTo(this.x - outerWidth, furthest);
            ctx.arcTo(this.x - outerWidth, furthest - outerWidth, this.x, furthest - outerWidth, outerWidth);
            ctx.arcTo(this.x + outerWidth, furthest - outerWidth, this.x + outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y - innerWidth);

        // east point
        if (this.eastPoint) {
            furthest = this.x + (this.eastPoint * progress);
            ctx.lineTo(furthest, this.y - outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y - outerWidth, furthest + outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y + outerWidth, furthest, this.y + outerWidth, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y + innerWidth);

        // south point
        if (this.southPoint) {
            furthest = this.y + (this.southPoint * progress);
            ctx.lineTo(this.x + outerWidth, furthest);
            ctx.arcTo(this.x + outerWidth, furthest + outerWidth, this.x, furthest + outerWidth, outerWidth);
            ctx.arcTo(this.x - outerWidth, furthest + outerWidth, this.x - outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y + innerWidth);

        // west point
        if (this.westPoint) {
            furthest = this.x - (this.westPoint * progress);
            ctx.lineTo(furthest, this.y + outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y + outerWidth, furthest - outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y - outerWidth, furthest, this.y - outerWidth, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y - innerWidth);

        ctx.fill();
    };

    Dyna.ui.Flash = Flash;

})(Dyna);