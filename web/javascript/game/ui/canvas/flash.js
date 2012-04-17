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
    Flash.prototype.tileSize = null;
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
        ctx.globalAlpha = 0.75;

        var
                size = this.fn(this.getTimeElapsed(now)),
                innerWidth = this.innerWidth * size,
                outerWidth = this.outerWidth * size,
                dist;

        ctx.beginPath();

        ctx.moveTo(this.x - innerWidth, this.y - innerWidth);

        // north point
        if (this.northPoint) {
            dist = this.y - (this.northPoint * size);
            ctx.lineTo(this.x - outerWidth, dist);
            ctx.lineTo(this.x + outerWidth, dist);
            ctx.arcTo(this.x - outerWidth, dist, this.x + outerWidth, dist, 50);
        }
        ctx.lineTo(this.x + innerWidth, this.y - innerWidth);

        // east point
        if (this.eastPoint) {
            dist = this.x + (this.eastPoint * size);
            ctx.lineTo(dist, this.y - outerWidth);
            ctx.lineTo(dist, this.y + outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y + innerWidth);

        // south point
        if (this.southPoint) {
            dist = this.y + (this.southPoint * size);
            ctx.lineTo(this.x + outerWidth, dist);
            ctx.lineTo(this.x - outerWidth, dist);
        }
        ctx.lineTo(this.x - innerWidth, this.y + innerWidth);

        // west point
        if (this.westPoint) {
            dist = this.x - (this.westPoint * size);
            ctx.lineTo(dist, this.y + outerWidth);
            ctx.lineTo(dist, this.y - outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y - innerWidth);

        ctx.fill();
    };

    Dyna.ui.Flash = Flash;

})(Dyna);