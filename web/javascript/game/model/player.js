(function(Dyna) {

    /**
     * Constructor
     */
    function Player(name) {

        this.superclass.constructor.call(this);
        log("Creating player " + name);
        this.name = name;

    }

    Object.extend(Player, Dyna.events.CustomEvent);

    Player.prototype.name = null;
    Player.prototype.x = null;
    Player.prototype.y = null;

    Player.prototype.withControls = function(keyboardInput) {
        keyboardInput.on(Player.UP, this.move.bind(this, 0, -1, 'north'));
        keyboardInput.on(Player.DOWN, this.move.bind(this, 0, +1, 'south'));
        keyboardInput.on(Player.LEFT, this.move.bind(this, -1, 0, 'west'));
        keyboardInput.on(Player.RIGHT, this.move.bind(this, +1, 0, 'east'));
        return this;
    };

    Player.prototype.move = function(x, y, direction) {
        this.x += x;
        this.y += y;
        this.fire(Player.DIRECTION_CHANGED, direction);
        this.fire(Player.MOVED);
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";

    /** @event */
    Player.MOVED = "moved";

    /** @event */
    Player.DIRECTION_CHANGED = "directionChanged";

    Dyna.model.Player = Player;

})(window.Dyna);