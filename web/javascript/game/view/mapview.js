(function(Dyna) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {

        log("Creating mapview for  " + map.name);
        this.jContainer = jContainer;
        this.map = map;

    }

    MapView.prototype.map = null;
    MapView.prototype.jContainer = null;

    MapView.prototype.updateAll = function() {
        log("MapView is updating");

        this.jContainer.empty();

        for (var x = 0; x < this.map.width; x++) {
            for (var y = 0; y < this.map.height; y++) {
                var tile =
                        jQuery("<div></div>")
                                .addClass("tile")
                                .addClass(this.map.tileAt(x, y))
                                .css({
                            left: x * 30,
                            top: y * 30
                        });

                this.jContainer.append(tile);
            }
        }

    };

    Dyna.ui.MapView = MapView;

})(window.Dyna);