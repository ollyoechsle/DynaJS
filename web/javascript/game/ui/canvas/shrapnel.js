(function(Dyna) {

    function Shrapnel(cx, cy, radius, collisionDetection) {

        var
                angle = Math.random() * (Math.PI * 2),
                r = radius + Math.random();

        this.dx = r * Math.cos(angle);
        this.dy = r * Math.sin(angle);
        this.initX = cx + this.dx;
        this.initY = cy + this.dy;
        this.collisionDetection = collisionDetection;
        this.start = +new Date();
    }

    Shrapnel.prototype.start = null;
    Shrapnel.prototype.initX = null;
    Shrapnel.prototype.initY = null;
    Shrapnel.prototype.dx = null;
    Shrapnel.prototype.dy = null;
    Shrapnel.prototype.speed = 3;
    Shrapnel.prototype.collisionDetection = 3;

    Shrapnel.prototype.render = function(ctx, now) {

        var
                elapsed = ((now - this.start) / 1000) * this.speed,
                currentX = this.initX + (elapsed * this.dx),
                currentY = this.initY + (elapsed * this.dy);

        if (this.collisionDetection.inSolid(currentX, currentY)) {
            // cancel the animation
            this.render = jQuery.noop;
        } else {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = '#000';
            ctx.fillRect(currentX, currentY, 3, 3);
        }

    };

    Dyna.ui.Shrapnel = Shrapnel;

})(Dyna);