(function(Dyna) {

    /**
     * Constructor
     */
    function Player(name) {

        this.superclass.constructor.call(this);
        log("Creating player " + name);
        this.name = name;
        this.bombsLaid = 0;
        this.bombsAvailable = 2;
        this.initialise();
    }

    Object.extend(Player, Dyna.events.CustomEvent);

    Player.prototype.name = null;
    Player.prototype.dead = false;
    Player.prototype.x = null;
    Player.prototype.y = null;
    Player.prototype.bombsLaid = 0;
    Player.prototype.power = 1;
    Player.prototype.bombsAvailable = 0;

    Player.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.possiblyGetBlownUp.bind(this));
    };

    Player.prototype.possiblyGetBlownUp = function(explosion) {
        if (explosion.affects(this.x, this.y)) {
            this.die();
        }
    };

    Player.prototype.powerUp = function() {
        this.power++;
    };

    /**
     * Makes the player request a move to a new position.
     * @param {Number} nx The new position in X
     * @param {Number} ny The new position in Y
     */
    Player.prototype.move = function(nx, ny) {

        var direction;

        if (this.x > nx) {
            direction = 'west';
        } else if (this.x < nx) {
            direction = 'east';
        } else if (this.y < ny) {
            direction = 'south';
        } else {
            direction = 'north';
        }

        this.fire(Player.WANTS_TO_MOVE, this, nx, ny);
        this.fire(Player.DIRECTION_CHANGED, direction);
    };

    Player.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.fire(Player.MOVED);
    };

    Player.prototype.layBomb = function() {

        if (this.bombsLaid < this.bombsAvailable) {
            var bomb = new Dyna.model.Bomb(this.x, this.y, this.power);
            this.bombsLaid++;
            bomb.on(Dyna.model.Bomb.EXPLODE, this._handleMyBombExploded.bind(this));
            this.fire(Player.LAID_BOMB, bomb);
        }

    };

    Player.prototype.die = function() {
        this.dead = true;
        this.fire(Player.DIED);
    };

    Player.prototype._handleMyBombExploded = function() {
        this.bombsLaid--;
    };

    /**
     * Returns the rough distance to a point
     * @param {Number} x
     * @param {Number} y
     */
    Player.prototype.distanceTo = function(x, y) {
        return Math.abs(this.x - x) + Math.abs(this.y - y);
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";
    Player.ENTER = "enter";

    /** @event */
    Player.MOVED = "moved";

    /** @event */
    Player.DIRECTION_CHANGED = "directionChanged";

    /** @event */
    Player.WANTS_TO_MOVE = "wantsToMove";

    /** @event */
    Player.LAID_BOMB = "laidBomb";

    /** @event */
    Player.DIED = "died";

    Dyna.model.Player = Player;

})(window.Dyna);