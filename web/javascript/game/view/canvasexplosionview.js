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
        for (i = 0; i < explosion.tilesAffected.length; i++) {
            tile = explosion.tilesAffected[i];
            delay = 500 * Math.sqrt(Math.pow(tile.x - explosion.x, 2) + Math.pow(tile.y - explosion.y, 2));
            cx = (tile.x + 0.5) * tileSize;
            cy = (tile.y + 0.5) * tileSize;
        }

        cx = (explosion.x + 0.5) * tileSize;
        cy = (explosion.y + 0.5) * tileSize;
        fireballs.push(new Flash(cx, cy, explosion, 10, 5, tileSize, "#E83C0A", start));
        fireballs.push(new Flash(cx, cy, explosion, 5, 2, tileSize * 0.8, "#F7EC64", start));
        fireballs.push(new Flash(cx, cy, explosion, 2, 2, tileSize * 0.25, "#FFFFFF", start));

        fireballs.push(new FireBall(cx, cy, tileSize / 4, Math.getGaussianFunction(0.1), "#FFFFFF", start)); // white hot
        //fireballs.push(new FireBall(cx, cy, tileSize / 2, Math.getGaussianFunction(0.3), "#F7EC64", start)); // yellow
        //fireballs.push(new FireBall(cx, cy, tileSize, Math.getGaussianFunction(0.5), "#E83C0A", start)); // red*/

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
    CanvasExplosionView.DURATION = 800;

    function FireBall(x, y, size, fn, color, start) {
        this.x = x;
        this.y = y;
        this.fn = fn;
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
        var size = this.size * this.fn(this.getTimeElapsed(now)), radius = size / 2;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    };

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
    }

    /**
     * @type {Number} The start time
     */
    Flash.prototype.start = null;
    Flash.prototype.points = [];

    Flash.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / CanvasExplosionView.DURATION;
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

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);