(function(Dyna) {

    function CollisionDetection(map) {
        this.map = map;
    }

    /**
     * Reference to the map
     * @param {Dyna.model.Map}
     */
    CollisionDetection.prototype.map = null;

    CollisionDetection.prototype.inSolid = function(screenX, screenY) {

        var tileSize = Dyna.ui.LevelView.tileSize,
                mapX = parseInt(screenX / tileSize),
                mapY = parseInt(screenY / tileSize);

        return this.map.isSolid(mapX, mapY);

    };

    Dyna.util.CollisionDetection = CollisionDetection;

})(Dyna);