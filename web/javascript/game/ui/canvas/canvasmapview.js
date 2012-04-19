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
        var i, tile, tiles = [], tileSize = Dyna.ui.LevelView.tileSize, tx, ty;

        this.horizontalWall(tiles, tileSize, map, 0);

        for (var y = 0; y < map.height; y++) {
            ty = y * tileSize + 25;
            tiles.push(new Tile(0, ty, 25, 50, this.images.wall_vertical));
            for (var x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);
                tx = x * tileSize + 25;
                tiles.push(new Tile(tx, ty + (tile.solid ? 0 : 10), 50, 50, this.images[tile.type]));
            }
            tiles.push(new Tile(map.width * tileSize + 25, ty, 25, 50, this.images.wall_vertical));
        }

        this.horizontalWall(tiles, tileSize, map, map.height * tileSize + 25);

        return tiles;
    };

    CanvasMapView.prototype.horizontalWall = function(tiles, tileSize, map, y) {
        tiles.push(new Tile(0, y, 25, 25, this.images.corner));
        for (var x = 0; x < map.width; x++) {
            tiles.push(new Tile(x * tileSize + 25, y, 50, 25, this.images.wall_horizontal));
        }
        tiles.push(new Tile(map.width * tileSize + 25, y, 25, 25, this.images.corner));
    };

    CanvasMapView.prototype.updateAll = function() {
        log("Canvas Map View: UpdateAll ---------");
        this.animations = this.createMapTiles(this.map);
        this.render();
    };

    function Tile(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    Tile.prototype.render = function(ctx, now) {
        ctx.globalAlpha = 0.25;
        ctx.fillRect(this.x + 10, this.y + 10, this.width, this.height);
        ctx.globalAlpha = 1.0;
        ctx.drawImage(this.image, this.x, this.y);
    };

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);