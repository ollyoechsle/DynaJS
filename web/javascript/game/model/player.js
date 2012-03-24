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
        keyboardInput.on(Player.UP, this.move.bind(this, 0, -1));
        keyboardInput.on(Player.DOWN, this.move.bind(this, 0, +1));
        keyboardInput.on(Player.LEFT, this.move.bind(this, -1, 0));
        keyboardInput.on(Player.RIGHT, this.move.bind(this, +1, 0));
        return this;
    };

    Player.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
        this.fire(Player.MOVED);
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";

    /** @event */
    Player.MOVED = "moved";

    Dyna.model.Player = Player;

})(window.Dyna);