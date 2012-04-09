(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the lifeform
     * @param {Number} skin The skin of the player
     */
    function Lifeform(name, skin) {
        log("Creating Lifeform " + name);
        Lifeform.superclass.constructor.call(this);
        this.name = name;
        this.skin = skin;
        this.initialise();
    }

    Object.extend(Lifeform, Dyna.events.CustomEvent);

    /**
     * The name of the life form
     * @type {String}
     */
    Lifeform.prototype.name = null;

    /**
     * The skin of the player, eg "player1", or "mushtopus"
     * @type {String}
     */
    Lifeform.prototype.skin = null;

    /**
     * Whether this life form is dead or not
     * @type {Boolean}
     */
    Lifeform.prototype.dead = false;

    /**
     * The current X position of the life form on the map
     * @type {Number}
     */
    Lifeform.prototype.x = null;

    /**
     * The current Y position of the life form on the map
     * @type {Number}
     */
    Lifeform.prototype.y = null;

    /**
     * Listens for explosions that could kill it
     */
    Lifeform.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.possiblyGetBlownUp.bind(this));
    };

    /**
     * Makes the life form die if something explodes near to it.
     * @param {Dyna.model.Explosion} explosion The explosion from the detonated bomb
     */
    Lifeform.prototype.possiblyGetBlownUp = function(explosion) {
        if (explosion.affects(this.x, this.y)) {
            this.die();
        }
    };

    /**
     * Makes the Lifeform request a move to a new position.
     * @param {Number} nx The new position in X
     * @param {Number} ny The new position in Y
     */
    Lifeform.prototype.move = function(nx, ny) {
        this.fire(Lifeform.WANTS_TO_MOVE, this, nx, ny);        
    };

    Lifeform.prototype.moveTo = function(x, y) {
        log(this.name + " moved to " + x + ", " + y);
        this.x = x;
        this.y = y;
        this.fire(Lifeform.MOVED);
    };

    Lifeform.prototype.die = function() {
        this.dead = true;
        this.fire(Lifeform.DIED);
    };

    /**
     * Returns the rough distance to a point
     * @param {Number} x
     * @param {Number} y
     */
    Lifeform.prototype.distanceTo = function(x, y) {
        return Math.abs(this.x - x) + Math.abs(this.y - y);
    };

    /** @event */
    Lifeform.MOVED = "moved";

    /** @event */
    Lifeform.DIRECTION_CHANGED = "directionChanged";

    /** @event */
    Lifeform.WANTS_TO_MOVE = "wantsToMove";

    /** @event */
    Lifeform.DIED = "died";

    Dyna.model.Lifeform = Lifeform;

})(window.Dyna);