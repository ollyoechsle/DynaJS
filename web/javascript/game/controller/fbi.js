(function(Dyna) {

    function FBI(level) {
        FBI.instance = this;
        this.intelligence = {};
        this.level = level;
        this.level.on(Dyna.model.Level.BOMB_ADDED, this.handleBombThreat.bind(this));
    }

    FBI.prototype.level = null;

    /**
     * A list of all the bombs currently on the map with their projected explosions
     * @type {Object}
     */
    FBI.prototype.intelligence = null;

    FBI.prototype.handleBombThreat = function(bomb) {
        log("FBI has had a report of a bomb threat at " + bomb.id);
        this.intelligence[bomb.id] = {
            bomb: bomb,
            explosion: Dyna.model.Explosion.create(this.level.map, bomb.x, bomb.y, bomb.power)
        };
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExplosion.bind(this));
    };

    FBI.prototype.handleBombExplosion = function(x, y, power, bomb) {
        log("FBI standing down at", bomb.id);
        delete this.intelligence[bomb.id];
    };

    /**
     * Returns whether the given position is in imminent danger of being blown up by a bomb.
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    FBI.prototype.estimateDangerAt = function(x, y) {
        var bombId, intelligence;
        for (bombId in this.intelligence) {
            intelligence = this.intelligence[bombId];
            if (intelligence.bomb.at(x, y) || intelligence.explosion.affects(x, y)) {
                return 1;
            }
        }
        return 0;
    };

    /**
     * Returns whether there is a bomb at the given location
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    FBI.prototype.bombAt = function(x, y) {
        var bombId, intelligence;
        for (bombId in this.intelligence) {
            intelligence = this.intelligence[bombId];
            if (intelligence.bomb.at(x, y)) {
                return true;
            }
        }
        return false;
    };

    /**
     * Static instance that can be got at any time
     * @type {Dyna.service.FBI}
     */
    FBI.instance = null;

    Dyna.service.FBI = FBI;

})(window.Dyna);