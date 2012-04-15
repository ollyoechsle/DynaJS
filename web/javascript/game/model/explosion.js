(function(Dyna) {

    function Explosion(x, y) {
        this.tilesAffected = [];
        this.blocksAffected = 0;
        this.x = x;
        this.y = y;
    }

    Explosion.prototype.tilesAffected = null;
    Explosion.prototype.blocksAffected = 0;

    /**
     * @type {Number} The X position of the center of the explosion
     */
    Explosion.prototype.x = 0;

    /**
     * @type {Number} The Y position of the center of the explosion
     */
    Explosion.prototype.y = 0;

    /**
     * @type {Number} The distance to the east that the explosion covers
     */
    Explosion.prototype.eastExtent = 0;

    /**
     * @type {Number} The distance to the west that the explosion covers
     */
    Explosion.prototype.westExtent = 0;

    /**
     * @type {Number} The distance to the north that the explosion covers
     */
    Explosion.prototype.northExtent = 0;

    /**
     * @type {Number} The distance to the south that the explosion covers
     */
    Explosion.prototype.southExtent = 0;

    Explosion.prototype.addAffectedTile = function(x, y) {
        this.tilesAffected.push({
            x: x,
            y: y
        });
    };

    Explosion.prototype.affects = function(x, y) {
        for (var i = 0; i < this.tilesAffected.length; i++) {
            var tile = this.tilesAffected[i];
            if (tile.x == x && tile.y == y) {
                return true;
            }
        }
        return false;
    };

    Explosion.create = function(map, x, y, power) {
        var explosion = new Explosion(x, y), direction, key, extent, mx, my, tile;

        explosion.addAffectedTile(x, y);

        for (key in directions) {
            direction = directions[key];

            for (extent = 1; extent <= power; extent++) {

                mx = x + (direction.x * extent);
                my = y + (direction.y * extent);
                tile = map.tileAt(mx, my);

                if (tile && tile != Dyna.model.Map.WALL) {
                    explosion.addAffectedTile(mx, my);
                    if (tile == Dyna.model.Map.BLOCK) {
                        explosion.blocksAffected++;
                    }
                    if (tile.solid) {
                        break;
                    }
                } else {
                    extent--;
                    break;
                }
            }

            explosion[key + "Extent"] = Math.min(extent, power);

        }

        return explosion;

    };

    var directions = {
        "east": {x: +1, y: 0},
        "west": {x: -1, y: 0},
        "north": {x: 0, y: -1},
        "south": {x: 0, y: +1}
    };

    Dyna.model.Explosion = Explosion;

})(window.Dyna);