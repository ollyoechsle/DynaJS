(function(Dyna) {

    function Flash(x, y, explosion, innerWidth, outerWidth, tileSize, color, start) {
        this.x = x;
        this.y = y;
        this.innerWidth = innerWidth;
        this.outerWidth = outerWidth;
        this.expansionFn = Flash.STATIC;
        this.color = color;
        var min = (tileSize * 0.5) - outerWidth;
        if (explosion.northExtent) {
            this.northPoint = (tileSize * explosion.northExtent) + min;
        }

        if (explosion.eastExtent) {
            this.eastPoint = (tileSize * explosion.eastExtent) + min;

        }
        if (explosion.southExtent) {
            this.southPoint = (tileSize * explosion.southExtent) + min;

        }
        if (explosion.westExtent) {
            this.westPoint = (tileSize * explosion.westExtent) + min;
        }

        this.start = start;
        this.opacityFn = Flash.STATIC;
        this.shadowColor = color;
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
    Flash.prototype.expansionFn = null;
    Flash.prototype.color = null;
    Flash.prototype.innerWidth = null;
    Flash.prototype.outerWidth = null;
    Flash.prototype.opacityFn = null;
    Flash.prototype.blur = 5;
    Flash.prototype.shadowColor = null;
    Flash.prototype.duration = Dyna.ui.CanvasExplosionView.DURATION;

    Flash.prototype.withOpacityFn = function(opacityFn) {
        this.opacityFn = opacityFn;
        return this;
    };

    Flash.prototype.withExpansionFn = function(fn) {
        this.expansionFn = fn;
        return this;
    };

    Flash.prototype.withShadow = function(blur, shadowColor) {
        this.blur = blur;
        this.shadowColor = shadowColor;
        return this;
    };

    Flash.prototype.withDuration = function(duration) {
        this.duration = duration;
        return this;
    };

    Flash.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / this.duration;
    };

    Flash.prototype.render = function(ctx, now) {

        if (now < this.start) {
            return;
        }

        var
                elapsed = this.getTimeElapsed(now),
                expansion = this.expansionFn(elapsed),
                innerWidth = this.innerWidth * expansion,
                outerWidth = this.outerWidth * expansion,
                furthest;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacityFn(elapsed);
        ctx.shadowBlur = this.blur;
        ctx.shadowColor = this.shadowColor;

        ctx.beginPath();

        ctx.moveTo(this.x - innerWidth, this.y - innerWidth);

        // north point
        if (this.northPoint) {
            furthest = this.y - (this.northPoint * expansion);
            ctx.lineTo(this.x - outerWidth, furthest);
            ctx.arcTo(this.x - outerWidth, furthest - outerWidth, this.x, furthest - outerWidth, outerWidth);
            ctx.arcTo(this.x + outerWidth, furthest - outerWidth, this.x + outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y - innerWidth);

        // east point
        if (this.eastPoint) {
            furthest = this.x + (this.eastPoint * expansion);
            ctx.lineTo(furthest, this.y - outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y - outerWidth, furthest + outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y + outerWidth, furthest, this.y + outerWidth, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y + innerWidth);

        // south point
        if (this.southPoint) {
            furthest = this.y + (this.southPoint * expansion);
            ctx.lineTo(this.x + outerWidth, furthest);
            ctx.arcTo(this.x + outerWidth, furthest + outerWidth, this.x, furthest + outerWidth, outerWidth);
            ctx.arcTo(this.x - outerWidth, furthest + outerWidth, this.x - outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y + innerWidth);

        // west point
        if (this.westPoint) {
            furthest = this.x - (this.westPoint * expansion);
            ctx.lineTo(furthest, this.y + outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y + outerWidth, furthest - outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y - outerWidth, furthest, this.y - outerWidth, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y - innerWidth);

        ctx.fill();
    };

    Flash.STATIC = function() {
        return 1;
    };

    Dyna.ui.Flash = Flash;

})(Dyna);