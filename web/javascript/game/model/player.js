(function(Dyna) {

    /**
     * Constructor
     */
    function Player(name) {

        this.superclass.constructor.call(this);
        log("Creating player " + name);
        this.name = name;
        this.bombsLaid = 0;

    }

    Object.extend(Player, Dyna.events.CustomEvent);

    Player.prototype.name = null;
    Player.prototype.x = null;
    Player.prototype.y = null;
    Player.prototype.bombsLaid = 0;

    Player.prototype.withControls = function(keyboardInput) {
        keyboardInput.on(Player.UP, this.move.bind(this, 0, -1, 'north'));
        keyboardInput.on(Player.DOWN, this.move.bind(this, 0, +1, 'south'));
        keyboardInput.on(Player.LEFT, this.move.bind(this, -1, 0, 'west'));
        keyboardInput.on(Player.RIGHT, this.move.bind(this, +1, 0, 'east'));
        keyboardInput.on(Player.ENTER, this.layBomb.bind(this));
        return this;
    };

    Player.prototype.move = function(dx, dy, direction) {
        this.fire(Player.WANTS_TO_MOVE, this, this.x + dx, this.y + dy);
        this.fire(Player.DIRECTION_CHANGED, direction);
    };

    Player.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.fire(Player.MOVED);
    };

    Player.prototype.layBomb = function() {

        log("Laying bomb");
        if (this.bombsLaid == 0) {
            var bomb = new Dyna.model.Bomb(this.x, this.y);
            this.bombsLaid++;
            bomb.on(Dyna.model.Bomb.EXPLODE, this._handleMyBombExploded.bind(this));
            this.fire(Player.LAID_BOMB, bomb);
        }

    };

    Player.prototype.die = function() {
        this.fire(Player.DIED);
    };

    Player.prototype._handleMyBombExploded = function() {
        this.bombsLaid--;
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