(function(Dyna) {

    function Explosion() {
        log("Creating explosion");
        this.tilesAffected = [];
    }

    Explosion.prototype.tilesAffected = null;

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
        log("Creating explosion", x, y, power);
        var explosion = new Explosion();

        for (var key in directions) {
            var direction = directions[key];

            for (var i = 0; i <= power; i++) {
                var mx = x + (direction.x * i);
                var my = y + (direction.y * i);
                var tile = map.tileAt(mx, my);
                if (tile && tile != Dyna.model.Map.WALL) {
                    explosion.addAffectedTile(mx, my);
                    if (tile.solid) {
                        break;
                    }
                } else {
                    break;
                }
            }

        }

        return explosion;

    };

    var directions = {
        "east": {x: -1, y: 0},
        "west": {x: +1, y: 0},
        "north": {x: 0, y: -1},
        "south": {x: 0, y: +1}
    };

    Dyna.model.Explosion = Explosion;

})(window.Dyna);