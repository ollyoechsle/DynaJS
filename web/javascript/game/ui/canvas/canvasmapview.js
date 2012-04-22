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
            wallLayer.push(new Tile(0, ty, 25, 50, this.images.wall_vertical));
            if (!map.isSolid(0, y)) {
                shadowLayer.push(new VerticalShadow(25, ty + 10, 50));
            }

            for (x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);
                tx = x * tileSize + 25;
                if (tile.solid) {
                    wallLayer.push(new Tile(tx, ty, 50, 50, this.images[tile.type]));
                    if (!map.isSolid(x, y + 1)) {
                        shadowLayer.push(new HorizontalShadow(tx, ty + 50 + 10, 50));
                    }
                    if (!map.isSolid(x + 1, y)) {
                        shadowLayer.push(new VerticalShadow(tx + 50, ty + 10, 50));
                    }
                } else {
                    groundLayer.push(new Tile(tx, ty + 10, 50, 50, this.images[tile.type]));
                }
            }
            wallLayer.push(new Tile(map.width * tileSize + 25, ty, 25, 50, this.images.wall_vertical));

        }

        shadowLayer.push(new VerticalShadow(map.width * tileSize + 25 + 25, 10, (map.height * tileSize) + 25 + 25));
        shadowLayer.push(new HorizontalShadow(0, (map.height * tileSize) + 25 + 25 + 10, (map.width * tileSize) + 25 + 25));

        this.horizontalWall(wallLayer, shadowLayer, tileSize, map, map.height * tileSize + 25, undefined);

        return [groundLayer, shadowLayer, wallLayer];
    };

    CanvasMapView.prototype.horizontalWall = function(wallLayer, shadowLayer, tileSize, map, y, my) {
        wallLayer.push(new Tile(0, y, 25, 25, this.images.corner));
        for (var x = 0; x < map.width; x++) {
            wallLayer.push(new Tile(x * tileSize + 25, y, 50, 25, this.images.wall_horizontal));
            if (my !== undefined && !map.isSolid(x, my)) {
                shadowLayer.push(new HorizontalShadow(x * tileSize + 25, y + 10 + 25, 50));
            }
        }
        wallLayer.push(new Tile(map.width * tileSize + 25, y, 25, 25, this.images.corner));
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

    function HorizontalShadow(x, y, width) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y;
    }

    function VerticalShadow(x, y, height) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y + height;
    }

    VerticalShadow.prototype.render = HorizontalShadow.prototype.render = function(ctx, now) {
        var
                x1 = this.x1,
                y1 = this.y1,
                x2 = this.x2,
                y2 = this.y2;

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.shadowColor = '#000';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 + HorizontalShadow.dx, y2 + HorizontalShadow.dy);
        ctx.lineTo(x1 + HorizontalShadow.dx, y1 + HorizontalShadow.dy);
        ctx.lineTo(x1, y1);
        ctx.fill();

        ctx.shadowBlur = 0;
    };

    HorizontalShadow.dx = 10;
    HorizontalShadow.dy = 10;

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);