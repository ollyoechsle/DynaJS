(function(Dyna) {

    var id = 0;

    /**
     * @constructor
     * @param {Number} x the X coordinate of the bomb
     * @param {Number} y the Y coordinate of the bomb
     * @param {Number} power The number of squares in each direction that the bomb explosion can affect
     */
    function Bomb(x, y, power) {

        Bomb.superclass.constructor.call(this);

        this.id = ++id;
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = power;

        log("Creating bomb", this.id);
        this.startTicking();

    }

    Object.extend(Bomb, Dyna.events.CustomEvent);

    /**
     * A unique identifier for each bomb
     * @type {Number}
     */
    Bomb.prototype.id = null;

    /**
     * The X coordinate of the bomb on the map
     * @type {Number}
     */
    Bomb.prototype.x = null;

    /**
     * The Y coordinate of the bomb on the map
     * @type {Number}
     */
    Bomb.prototype.y = null;

    /**
     * Whether the bomb has exploded yet
     * @type {Boolean}
     */
    Bomb.prototype.exploded = false;

    /**
     * The number of squares that the bomb explosion can affect
     * @type {Number}
     */
    Bomb.prototype.power = 0;

    Bomb.prototype.timer = null;

    Bomb.prototype.startTicking = function() {
        this.timer = Dyna.util.Timer.setTimeout(this.explode.bind(this), 3 * 1000);
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.triggerChainReaction.bind(this))
    };

    Bomb.prototype.triggerChainReaction = function(explosion) {
        if (explosion.affects(this.x, this.y) && this.timer) {
            window.clearTimeout(this.timer);
            Dyna.util.Timer.setTimeout(this.explode.bind(this), 300);
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