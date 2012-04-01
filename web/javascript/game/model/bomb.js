(function(Dyna) {

    /**
     * Constructor
     */
    function Bomb(x, y, power) {

        this.superclass.constructor.call(this);
        log("Creating bomb");
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = power;
        this.id = x + "." + y;

        this.startTicking();

    }

    Object.extend(Bomb, Dyna.events.CustomEvent);

    Bomb.prototype.id = null;
    Bomb.prototype.x = null;
    Bomb.prototype.y = null;
    Bomb.prototype.exploded = false;
    Bomb.prototype.power = 0;
    Bomb.prototype.timer = null;

    Bomb.prototype.startTicking = function() {
        this.timer = window.setTimeout(this.explode.bind(this), 3 * 1000);
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.triggerChainReaction.bind(this))
    };

    Bomb.prototype.triggerChainReaction = function(explosion) {
        if (explosion.affects(this.x, this.y) && this.timer) {
            window.clearTimeout(this.timer);
            window.setTimeout(this.explode.bind(this), 300);
            this.explode();
        }
    };

    Bomb.prototype.explode = function() {
        this.timer = null;
        this.exploded = true;
        this.fire(Bomb.EXPLODE, this.x, this.y, this.power, this);
    };

    /** @event */
    Bomb.EXPLODE = "explode";

    Dyna.model.Bomb = Bomb;

})(window.Dyna);