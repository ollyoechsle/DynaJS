(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Map} map The map object
     */
    function CanvasMapView(jContainer, map) {
        CanvasMapView.superclass.constructor.call(this, jContainer);
        this.map = map;
        this.images = this.loadImages();
    }

    Object.extend(CanvasMapView, Dyna.ui.CanvasView);

    CanvasMapView.prototype.className = "mapCanvas";

    CanvasMapView.prototype.images = null;

    CanvasMapView.prototype.loadImages = function() {
        return {
            "earth": this.loadImage("gfx/tiles/sand.png"),
            "wall":this.loadImage("gfx/tiles/wall.png"),
            "block": this.loadImage("gfx/tiles/crate.png"),
            "powerup": this.loadImage("gfx/powerups/power.png"),
            "corner": this.loadImage("gfx/tiles/wall-corner.png"),
            "wall_horizontal": this.loadImage("gfx/tiles/wall-horizontal.png"),
            "wall_vertical": this.loadImage("gfx/tiles/wall-vertical.png")
        }
    };

    CanvasMapView.prototype.loadImage = function(src) {
        var img = new Image();
        img.src = src;
        return img;
    };

    CanvasMapView.prototype.createMapTiles = function(map) {
        var i, tile, tileSize = Dyna.ui.LevelView.tileSize, x, y, tx, ty,
                groundLayer = new Dyna.ui.Layer("ground"),
                shadowLayer = new Dyna.ui.Layer("shadow"),
                wallLayer = new Dyna.ui.Layer("wall");

        this.horizontalWall(wallLayer, shadowLayer, tileSize, map, 0, 0);

        for (y = 0; y < map.height; y++) {
            ty = y * tileSize + 25;
            wallLayer.push(new Dyna.ui.Tile(0, ty, 25, 50, this.images.wall_vertical));
            if (!map.isSolid(0, y)) {
                shadowLayer.push(new Dyna.ui.VerticalShadow(25, ty + 10, 50));
            }

            for (x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);
                tx = x * tileSize + 25;
                if (tile.solid) {
                    wallLayer.push(new Dyna.ui.Tile(tx, ty, 50, 50, this.images[tile.type]));
                    if (!map.isSolid(x, y + 1)) {
                        shadowLayer.push(new Dyna.ui.HorizontalShadow(tx, ty + 50 + 10, 50));
                    }
                    if (!map.isSolid(x + 1, y)) {
                        shadowLayer.push(new Dyna.ui.VerticalShadow(tx + 50, ty + 10, 50));
                    }
                } else {
                    groundLayer.push(new Dyna.ui.Tile(tx, ty + 10, 50, 50, this.images[tile.type]));
                }
            }
            wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + 25, ty, 25, 50, this.images.wall_vertical));

        }

        shadowLayer.push(new Dyna.ui.VerticalShadow(map.width * tileSize + 25 + 25, 10, (map.height * tileSize) + 25 + 25));
        shadowLayer.push(new Dyna.ui.HorizontalShadow(0, (map.height * tileSize) + 25 + 25 + 10, (map.width * tileSize) + 25 + 25));

        this.horizontalWall(wallLayer, shadowLayer, tileSize, map, map.height * tileSize + 25, undefined);

        return [groundLayer, shadowLayer, wallLayer];
    };

    CanvasMapView.prototype.horizontalWall = function(wallLayer, shadowLayer, tileSize, map, y, my) {
        wallLayer.push(new Dyna.ui.Tile(0, y, 25, 25, this.images.corner));
        for (var x = 0; x < map.width; x++) {
            wallLayer.push(new Dyna.ui.Tile(x * tileSize + 25, y, 50, 25, this.images.wall_horizontal));
            if (my !== undefined && !map.isSolid(x, my)) {
                shadowLayer.push(new Dyna.ui.HorizontalShadow(x * tileSize + 25, y + 10 + 25, 50));
            }
        }
        wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + 25, y, 25, 25, this.images.corner));
    };

    CanvasMapView.prototype.updateAll = function() {
        log("Canvas Map View: UpdateAll ---------");
        this.animations = this.createMapTiles(this.map);
        this.render();
    };

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);