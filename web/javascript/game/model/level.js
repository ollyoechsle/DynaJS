(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the level
     * @param {Dyna.model.Map} map The map being played on
     */
    function Level(name, map) {

        Level.superclass.constructor.call(this);

        log("Creating level " + name);
        this.map = map;
        this.players = [];

    }

    Object.extend(Level, Dyna.events.CustomEvent);

    /**
     * The map
     * @private
     * @type {Dyna.model.Map}
     */
    Level.prototype.map = null;

    /**
     * A list of all the players on the map
     * @private
     * @type {Dyna.model.Player[]}
     */
    Level.prototype.players = [];

    /**
     * A list of all the monsters on the map
     * @private
     * @type {Dyna.model.Player[]}
     */
    Level.prototype.monsters = [];

    /**
     * Adds a player and listens for events in the player's life
     * @param {Dyna.model.Player} player The player just added
     */
    Level.prototype.addPlayer = function(player) {
        if (this.addLifeForm(player)) {
            this.players.push(player);
            player.on(Dyna.model.Player.LAID_BOMB, this.handleBombAdded.bind(this));
        } else {
            log("No room for this player on the map");
        }
    };

    /**
     * Adds a monster to the level
     * @param {Dyna.model.Lifeform} monster The monster just added
     */
    Level.prototype.addMonster = function(monster) {
        if (this.addLifeForm(monster)) {
            this.monsters.push(monster);
        } else {
            log("No room for this monster on the map");
        }
    };

    /**
     * Adds another life form to the map
     * @private
     * @param {Dyna.model.Lifeform} lifeform The life form to be added
     * @return True, if the player could be added to the map; false if not
     */
    Level.prototype.addLifeForm = function(lifeform) {
        if (this.map.findPositionFor(lifeform)) {
            lifeform.on(Dyna.model.Lifeform.WANTS_TO_MOVE, this.handlePlayerMove.bind(this));
            lifeform.on(Dyna.model.Lifeform.DIED, this.handlePlayerDied.bind(this));
            this.fire(Level.LIFEFORM_ADDED, lifeform);
            return true;
        } else {
            return false;
        }
    };

    /**
     * Handles a bomb added, and starts to listen for explosion
     * @param {Dyna.model.Bomb} bomb The bomb
     */
    Level.prototype.handleBombAdded = function(bomb) {
        this.fire(Level.BOMB_ADDED, bomb);
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExploded.bind(this));
    };

    /**
     * Destroys tiles affected by an exposion
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     * @param {Number} power The power of the bomb
     */
    Level.prototype.handleBombExploded = function(x, y, power) {

        var explosion = Dyna.model.Explosion.create(this.map, x, y, power);

        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            this.map.destroy(tile.x, tile.y);
        }

        Dyna.app.GlobalEvents.fire(Level.EXPLOSION, explosion);

    };

    /**
     * Manages power ups and allows players to move
     * @param {Dyna.model.Player} lifeform
     * @param {Number} x The X position where the player wants to move to
     * @param {Number} y The Y position where the player wants to move to
     */
    Level.prototype.handlePlayerMove = function(lifeform, x, y) {
        if (this.map.isFree(x, y)) {
            lifeform.moveTo(x, y);
            this.killAnyPlayersOverlappingMonstersAt(x, y);
            if (this.map.steppedOnLevelUp(x, y) && lifeform.powerUp) {
                this.fire(Level.LEVEL_UP, lifeform);
                lifeform.powerUp();
            }
        }
    };

    Level.prototype.killAnyPlayersOverlappingMonstersAt = function(x, y) {
        if (this.monstersAt(x, y).length) {
            this.playersAt(x, y).forEach(function(player) {
                player.die();
            })
        }
    };

    Level.prototype.playersAt = function(x, y) {
        return this.players.filter(function atPosition(player) {
            return player.x == x && player.y == y;
        });
    };

    Level.prototype.monstersAt = function(x, y) {
        return this.monsters.filter(function atPosition(monster) {
            return monster.x == x && monster.y == y;
        });
    };

    /**
     * Handles the event where a player dies
     */
    Level.prototype.handlePlayerDied = function() {
        if (this.getRemainingPlayers().length <= 1) {
            window.setTimeout(this.endLevel.bind(this), 3000);
        }
    };

    /**
     * Gets the remaining living players
     * @return {Dyna.model.Player[]}
     */
    Level.prototype.getRemainingPlayers = function() {
        return this.players.filter(function notDead(player) {
            return !player.dead;
        });
    };

    /**
     * Fires the end level event with the remaining living players
     */
    Level.prototype.endLevel = function() {
        this.fire(Level.ENDED, this.getRemainingPlayers());
    };

    /** @event */
    Level.LIFEFORM_ADDED = "lifeformAdded";

    /** @event */
    Level.BOMB_ADDED = "bombAdded";

    /** @event */
    Level.EXPLOSION = "bombExploded";

    /** @event */
    Level.LEVEL_UP = "levelUp";

    /** @event */
    Level.ENDED = "ended";

    Dyna.model.Level = Level;

})(window.Dyna);