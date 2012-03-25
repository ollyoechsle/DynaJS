(function(Dyna) {

    /**
     * Constructor
     */
    function Map(width, height) {

        this.width = width;
        this.height = height;
        this.playerPositions = [];
        this.build();

    }

    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.data = null;
    Map.prototype.playerPositions = null;

    Map.prototype.build = function() {
        var data = [], row;

        for (var y = 0; y < this.height; y++) {

            row = [];

            for (var x = 0; x < this.width; x++) {

                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    row.push(Math.random() < 0.75 ? Map.BLOCK : Map.EARTH);
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
        if (tile && tile == Map.BLOCK) {
            this.data[x][y] = Map.EARTH;
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
        return tile && tile == Map.EARTH;
    };

    Map.EARTH = "earth";
    Map.WALL = "wall";
    Map.BLOCK = "block";

    Dyna.model.Map = Map;

})(window.Dyna);