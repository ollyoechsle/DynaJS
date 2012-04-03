(function(Dyna) {

    var id = 0;

    /**
     * Constructor
     */
    function Bomb(x, y, power) {

        this.superclass.constructor.call(this);

        this.id = ++id;
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = power;

        log("Creating bomb", this.id);
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

    Bomb.prototype.at = function(x, y) {
        return this.x == x && this.y == y;
    };

    /** @event */
    Bomb.EXPLODE = "explode";

    Dyna.model.Bomb = Bomb;

})(window.Dyna);