(function(Dyna) {

    function Fireball(x, y, explosion, innerWidth, outerWidth, tileSize, color, start) {
        this.x = x;
        this.y = y;
        this.innerWidth = innerWidth;
        this.outerWidth = outerWidth;
        this.expansionFn = Fireball.STATIC;
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
        this.opacityFn = Fireball.STATIC;
        this.shadowColor = color;
    }

    /**
     * @type {Number} The start time
     */
    Fireball.prototype.start = null;
    Fireball.prototype.x = null;
    Fireball.prototype.y = null;
    Fireball.prototype.northPoint = null;
    Fireball.prototype.southPoint = null;
    Fireball.prototype.eastPoint = null;
    Fireball.prototype.westPoint = null;
    Fireball.prototype.expansionFn = null;
    Fireball.prototype.color = null;
    Fireball.prototype.innerWidth = null;
    Fireball.prototype.outerWidth = null;
    Fireball.prototype.opacityFn = null;
    Fireball.prototype.blur = 5;
    Fireball.prototype.shadowColor = null;
    Fireball.prototype.duration = Dyna.ui.CanvasExplosionView.DURATION;

    Fireball.prototype.withOpacityFn = function(opacityFn) {
        this.opacityFn = opacityFn;
        return this;
    };

    Fireball.prototype.withExpansionFn = function(fn) {
        this.expansionFn = fn;
        return this;
    };

    Fireball.prototype.withShadow = function(blur, shadowColor) {
        this.blur = blur;
        this.shadowColor = shadowColor;
        return this;
    };

    Fireball.prototype.withDuration = function(duration) {
        this.duration = duration;
        return this;
    };

    Fireball.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / this.duration;
    };

    Fireball.prototype.render = function(ctx, now) {

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

    Fireball.STATIC = function() {
        return 1;
    };

    Dyna.ui.Fireball = Fireball;

})(Dyna);