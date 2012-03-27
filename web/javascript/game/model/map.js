(function(Dyna) {

    function Map(width, height) {
        this.width = width;
        this.height = height;
        this.playerPositions = [];
        this._createMap();
    }

    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.data = null;
    Map.prototype.playerPositions = null;

    Map.prototype._createMap = function() {
        var data = [], row, x, y;

        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    if (Math.random() < 0.75) {
                        if (Math.random() < 0.1) {
                            row.push(Map.HIDDEN_POWERUP);
                        } else {
                            row.push(Map.BLOCK)
                        }
                    } else {
                        row.push(Map.EARTH);
                    }
                }
            }
            data.push(row);
        }

        this.playerPositions.push({x : 0, y : 0});
        this.playerPositions.push({x : this.width - 1, y : this.height - 1});

        this.data = data;
    };

    Map.prototype.clearSpaceAround = function(x, y) {
        this.data[x][y] = Map.EARTH;
        if (y < this.height - 1) this.data[x][y + 1] = Map.EARTH;
        if (y > 0) this.data[x][y - 1] = Map.EARTH;
        if (x > 0) this.data[x - 1][y] = Map.EARTH;
        if (x < this.width - 1) this.data[x + 1][y] = Map.EARTH;
    };

    Map.prototype.findPositionFor = function(player) {
        var position = this.playerPositions.shift();
        if (position) {
            player.x = position.x;
            player.y = position.y;
            this.clearSpaceAround(position.x, position.y);
            return true;
        } else {
            return false;
        }
    };

    Map.prototype.destroy = function(x, y) {
        var tile = this.tileAt(x, y);
        if (tile && tile.destroy) {
            this.data[x][y] = tile.destroy();
        }
    };

    Map.prototype.inBounds = function(x, y) {
        return !(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1);
    };

    Map.prototype.tileAt = function(x, y) {
        if (this.inBounds(x, y)) {
            return this.data[x][y];
        } else {
            return null;
        }
    };

    Map.prototype.isFree = function(x, y) {
        var tile = this.tileAt(x, y);
        return tile && !tile.solid;
    };

    Map.prototype.steppedOnLevelUp = function(x, y) {
        var tile = this.tileAt(x, y);
        if (tile && tile == Map.POWERUP) {
            log("Level up");
            this.data[x][y] = tile.destroy();
            return true;
        } else {
            return false;
        }
    };


    Map.EARTH = {
        solid: false,
        type: "earth"
    };

    Map.WALL = {
        solid: true,
        type: "wall"
    };

    Map.BLOCK = {
        type: "block",
        solid: true,
        destroy: function() {
            return Map.EARTH;
        }
    };

    Map.POWERUP = {
        type: "powerup",
        solid: false,
        destroy: function() {
            return Map.EARTH;
        }
    };

    Map.HIDDEN_POWERUP = {
        type: "block",
        solid: true,
        destroy: function() {
            return Map.POWERUP;
        }
    };

    Dyna.model.Map = Map;

})(window.Dyna);