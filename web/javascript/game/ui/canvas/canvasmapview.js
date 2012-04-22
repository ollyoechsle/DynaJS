(function(Dyna, jQuery) {

    var tileSize = Dyna.ui.LevelView.tileSize, blockHeight = 10, wallWidth = 25;

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

        this.horizontalWall(wallLayer, map, 0);
        this.horizontalShadow(shadowLayer, map, 0);

        for (y = 0; y < map.height; y++) {
            ty = y * tileSize + wallWidth;
            wallLayer.push(new Dyna.ui.Tile(0, ty, wallWidth, tileSize, this.images.wall_vertical));
            if (!map.isSolid(0, y)) {
                shadowLayer.push(new Dyna.ui.VerticalShadow(wallWidth, ty + blockHeight, tileSize));
            }

            for (x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);
                tx = x * tileSize + wallWidth;
                if (tile.solid) {
                    wallLayer.push(new Dyna.ui.Tile(tx, ty, tileSize, tileSize, this.images[tile.type]));
                    if (!map.isSolid(x, y + 1)) {
                        shadowLayer.push(new Dyna.ui.HorizontalShadow(tx, ty + tileSize + blockHeight, tileSize));
                    }
                    if (!map.isSolid(x + 1, y)) {
                        shadowLayer.push(new Dyna.ui.VerticalShadow(tx + tileSize, ty + blockHeight, tileSize));
                    }
                } else {
                    groundLayer.push(new Dyna.ui.Tile(tx, ty + blockHeight, tileSize, tileSize, this.images[tile.type]));
                }
            }
            wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + wallWidth, ty, wallWidth, tileSize, this.images.wall_vertical));
         }

        shadowLayer.push(new Dyna.ui.VerticalShadow(map.width * tileSize + wallWidth + wallWidth, blockHeight, (map.height * tileSize) + wallWidth + wallWidth));

        this.horizontalWall(wallLayer, map, (map.height * tileSize) + wallWidth);
        shadowLayer.push(new Dyna.ui.HorizontalShadow(0, (map.height * tileSize) + tileSize + blockHeight, (map.width * tileSize) + wallWidth + wallWidth));

        return [groundLayer, shadowLayer, wallLayer];
    };

    CanvasMapView.prototype.horizontalWall = function(wallLayer, map, ty) {
        wallLayer.push(new Dyna.ui.Tile(0, ty, 25, 25, this.images.corner));
        for (var x = 0; x < map.width; x++) {
            wallLayer.push(new Dyna.ui.Tile(x * tileSize + 25, ty, 50, 25, this.images.wall_horizontal));
        }
        wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + 25, ty, 25, 25, this.images.corner));
    };

    CanvasMapView.prototype.horizontalShadow = function(shadowLayer, map, y) {
        var x, ty = (y * tileSize) + wallWidth + blockHeight;
        for (x = 0; x < map.width; x++) {
            if (!map.isSolid(x, y)) {
                shadowLayer.push(new Dyna.ui.HorizontalShadow(x * tileSize + wallWidth, ty, tileSize));
            }
        }
    };

    CanvasMapView.prototype.updateAll = function() {
        this.animations = this.createMapTiles(this.map);
        this.render();
    };

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);