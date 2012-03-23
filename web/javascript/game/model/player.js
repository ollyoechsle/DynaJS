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

    Player.prototype.withControls = function(keyboardInput) {
        keyboardInput.on(Player.UP, this.move.bind(this));
        keyboardInput.on(Player.DOWN, this.move.bind(this));
        keyboardInput.on(Player.LEFT, this.move.bind(this));
        keyboardInput.on(Player.RIGHT, this.move.bind(this));
        return this;
    };

    Player.prototype.move = function() {
        log("Player is moving");
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";

    Dyna.model.Player = Player;

})(window.Dyna);