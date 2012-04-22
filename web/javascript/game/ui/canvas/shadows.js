(function(Dyna) {

    var dx = 10, dy = 10, color = '#000', fillStyle = 'rgba(0,0,0,0.1)';

    function HorizontalShadow(x, y, width) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y;
    }

    function VerticalShadow(x, y, height) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y + height;
    }

    VerticalShadow.prototype.render = HorizontalShadow.prototype.render = function(ctx, now) {
        var
                x1 = this.x1,
                y1 = this.y1,
                x2 = this.x2,
                y2 = this.y2;

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 10;
        ctx.fillStyle = fillStyle;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 + dx, y2 + dy);
        ctx.lineTo(x1 + dx, y1 + dy);
        ctx.lineTo(x1, y1);
        ctx.fill();

        ctx.shadowBlur = 0;
    };

    Dyna.ui.HorizontalShadow = HorizontalShadow;
    Dyna.ui.VerticalShadow = VerticalShadow;

})(Dyna);