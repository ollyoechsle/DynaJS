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

    Explosion.prototype.isAffected = function(x, y) {
        for (var i = 0; i < this.tilesAffected.length; i++) {
            var tile = this.tilesAffected[i];
            if (tile.x == x && tile.y == y) {
                return true;
            }
        }
        return false;
    };

    Dyna.model.Explosion = Explosion;

})(window.Dyna);