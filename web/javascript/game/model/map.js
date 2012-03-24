(function(Dyna) {

    /**
     * Constructor
     */
    function Map(name, width, height) {

        log("Creating map " + name);
        this.name = name;
        this.width = width;
        this.height = height;
        this._buildLevel();

    }

    Map.prototype.name = null;
    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.data = null;

    Map.prototype._buildLevel = function() {
        var data = [], row;

        for (var y = 0; y < this.height; y++) {

            row = [];

            for (var x = 0; x < this.width; x++) {

                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    row.push(Map.EARTH);
                }

            }

            data.push(row);

        }
        this.data = data;
    };

    Map.prototype.tileAt = function(x, y) {
        return this.data[x][y];
    };

    Map.EARTH = "earth";
    Map.WALL = "wall";

    Dyna.model.Map = Map;

})(window.Dyna);