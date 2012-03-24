(function(Dyna) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {
        log("Creating mapview for  " + map.name);
        this.jContainer = jContainer;
        this.map = map;
        this.initialise();
    }

    MapView.prototype.map = null;
    MapView.prototype.jContainer = null;
    MapView.prototype.tileSize = 30;
    MapView.prototype.tileTemplate = null;

    MapView.prototype.initialise = function() {

        log("Initialising map view");

        this.tileSize = 30;
        this.initialiseMap();

    };

    MapView.prototype.initialiseMap = function() {
        this.jContainer
                .css("width", this.tileSize * this.map.width)
                .css("height", this.tileSize * this.map.height);
        this.tileTemplate = jQuery("<div class='tile'></div>");
    };

    MapView.prototype.getTile = function(tileClass, x, y) {
        return this.tileTemplate.clone()
                .addClass(tileClass)
                .css("left", x * this.tileSize)
                .css("top", y * this.tileSize)
    };

    MapView.prototype.updateAll = function() {

        var newContents = document.createDocumentFragment();

        for (var y = 0; y < this.map.height; y++) {
            for (var x = 0; x < this.map.width; x++) {
                newContents.appendChild(
                        this.getTile(this.map.tileAt(x, y), x, y)[0]
                        );
            }
        }

        this.jContainer.empty().append(newContents);

    };

    Dyna.ui.MapView = MapView;

})(window.Dyna);