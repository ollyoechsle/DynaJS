(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the player
     * @param {Number} skin The skin of the player, eg "player1"
     */
    function Player(name, skin) {
        log("Creating player " + name);
        Player.superclass.constructor.call(this, name, skin);
        this.bombsLaid = 0;
        this.bombsAvailable = 2;
    }

    Object.extend(Player, Dyna.model.Lifeform);

    Player.prototype.bombsLaid = 0;
    Player.prototype.power = 1;
    Player.prototype.bombsAvailable = 0;

    Player.prototype.powerUp = function() {
        this.power++;
    };

    Player.prototype.layBomb = function() {

        if (this.bombsLaid < this.bombsAvailable) {
            var bomb = new Dyna.model.Bomb(this.x, this.y, this.power);
            this.bombsLaid++;
            bomb.on(Dyna.model.Bomb.EXPLODE, this._handleMyBombExploded.bind(this));
            this.fire(Player.LAID_BOMB, bomb);
        }

    };

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
        Player.superclass.move.apply(this, arguments);
        this.fire(Dyna.model.Lifeform.DIRECTION_CHANGED, direction);
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
    Player.LAID_BOMB = "laidBomb";

    Dyna.model.Player = Player;

})(window.Dyna);