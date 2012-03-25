(function(Dyna) {

    /**
     * Constructor
     */
    function Bomb(x, y) {

        this.superclass.constructor.call(this);
        log("Creating bomb");
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = 2;

        this.startTicking();

    }

    Object.extend(Bomb, Dyna.events.CustomEvent);

    Bomb.prototype.x = null;
    Bomb.prototype.y = null;
    Bomb.prototype.exploded = false;
    Bomb.prototype.power = 0;

    Bomb.prototype.startTicking = function() {
        window.setTimeout(this.explode.bind(this), 3 * 1000);
    };

    Bomb.prototype.explode = function() {
        this.exploded = true;
        this.fire(Bomb.EXPLODE, this.x, this.y, this.power);
    };

    /** @event */
    Bomb.EXPLODE = "explode";

    Dyna.model.Bomb = Bomb;

})(window.Dyna);