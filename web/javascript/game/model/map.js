(function(Dyna) {

    /**
     * Constructor
     */
    function Map(name, width, height) {

        log("Creating map " + name);
        this.name = name;
        this.width = width;
        this.height = height;

    }

    Map.prototype.name = null;
    Map.prototype.width = null;
    Map.prototype.height = null;

    Map.prototype.tileAt = function(x, y) {
        return Math.random() > 0.5 ? Map.EARTH : Map.WALL;
    };

    Map.EARTH = "earth";
    Map.WALL = "wall";

    Dyna.model.Map = Map;

})(window.Dyna);