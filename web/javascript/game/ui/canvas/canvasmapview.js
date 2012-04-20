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

        this.horizontalWall(wallLayer, shadowLayer, tileSize, map, 0);

        for (y = 0; y < map.height; y++) {
            ty = y * tileSize + 25;
            wallLayer.push(new Tile(0, ty, 25, 50, this.images.wall_vertical));
            shadowLayer.push(new Shadow(0, ty, 25, 50));

            for (x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);
                tx = x * tileSize + 25;
                if (tile.solid) {
                    wallLayer.push(new Tile(tx, ty, 50, 50, this.images[tile.type]));
                    shadowLayer.push(new Shadow(tx, ty, 50, 50));
                } else {
                    groundLayer.push(new Tile(tx, ty + 10, 50, 50, this.images[tile.type]));
                }
            }
            wallLayer.push(new Tile(map.width * tileSize + 25, ty, 25, 50, this.images.wall_vertical));
            shadowLayer.push(new Shadow(map.width * tileSize + 25, ty, 25, 50));

        }

        this.horizontalWall(wallLayer, shadowLayer, tileSize, map, map.height * tileSize + 25);

        return [groundLayer, shadowLayer, wallLayer];
    };

    CanvasMapView.prototype.horizontalWall = function(wallLayer, shadowLayer, tileSize, map, y) {
        wallLayer.push(new Tile(0, y, 25, 25, this.images.corner));
        shadowLayer.push(new Shadow(0, y, 25, 25));
        for (var x = 0; x < map.width; x++) {
            wallLayer.push(new Tile(x * tileSize + 25, y, 50, 25, this.images.wall_horizontal));
            shadowLayer.push(new Shadow(x * tileSize + 25, y, 50, 25));
        }
        wallLayer.push(new Tile(map.width * tileSize + 25, y, 25, 25, this.images.corner));
        shadowLayer.push(new Shadow(map.width * tileSize + 25, y, 25, 25));
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
        ctx.globalAlpha = 1.0;
        ctx.drawImage(this.image, this.x, this.y);
    };

    function Shadow(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Shadow.prototype.render = function(ctx, now) {
        var sw = 0, sh = 0, tileWidth = this.width, tileHeight = this.height, x = this.x, y = this.y + 10;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#000';

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tileWidth, y);
        ctx.lineTo(x + tileWidth + sw, y + sh);
        ctx.lineTo(x + tileWidth + sw, y + sh + tileHeight);
        ctx.lineTo(x + sw, y + sh + tileHeight);
        ctx.lineTo(x, y + tileHeight);
        ctx.lineTo(x, y);
        ctx.fill();

        ctx.shadowBlur = 0;
    };

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);