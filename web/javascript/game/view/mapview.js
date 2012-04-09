(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {
        this.jContainer = jQuery(jContainer);
        this.map = map;
        this.initialise();
    }

    MapView.prototype.map = null;
    MapView.prototype.jContainer = null;
    MapView.prototype.tileTemplate = null;

    MapView.prototype.initialise = function() {

        log("Initialising map view");
        this.initialiseMap();

        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.updateAll.bind(this));

    };

    MapView.prototype.initialiseMap = function() {
        this.jContainer.parent()
                .css("width", Dyna.ui.LevelView.tileSize * this.map.width)
                .css("height", Dyna.ui.LevelView.tileSize * this.map.height);
        this.tileTemplate = jQuery("<div class='tile'></div>");
    };

    MapView.prototype.getTile = function(className, x, y) {
        return this.tileTemplate.clone()
                .addClass(className)
                .css("left", x * Dyna.ui.LevelView.tileSize)
                .css("top", y * Dyna.ui.LevelView.tileSize)
    };

    MapView.prototype.updateAll = function() {

        var newContents = document.createDocumentFragment();

        newContents.appendChild(
                this.getTile("wall-corner", -0.33, -0.33)[0]
                );

        for (x = 0; x < this.map.width; x++) {

            newContents.appendChild(
                    this.getTile("wall-horizontal", x, -0.33)[0]
                    );
        }

        newContents.appendChild(
                this.getTile("wall-corner", this.map.width, -0.33)[0]
                );

        for (var y = 0; y < this.map.height; y++) {
            for (var x = 0; x < this.map.width; x++) {
                newContents.appendChild(
                        this.getTile(this.map.tileAt(x, y).type, x, y)[0]
                        );
            }

            newContents.appendChild(
                    this.getTile("wall-vertical", -0.333, y)[0]
                    );

            newContents.appendChild(
                    this.getTile("wall-vertical", this.map.width, y)[0]
                    );

        }

        newContents.appendChild(
                this.getTile("wall-corner", -0.33, this.map.height)[0]
                );

        for (x = 0; x < this.map.width; x++) {

            newContents.appendChild(
                    this.getTile("wall-horizontal", x, this.map.height)[0]
                    );

        }

        newContents.appendChild(
                this.getTile("wall-corner", this.map.width, this.map.height)[0]
                );

        this.jContainer.empty().append(newContents);

    };

    Dyna.ui.MapView = MapView;

})(window.Dyna, jQuery);