(function(Dyna) {

   function Explosion() {
      this.tilesAffected = [];
      this.blocksAffected = 0;
   }

   Explosion.prototype.tilesAffected = null;
   Explosion.prototype.blocksAffected = 0;

   Explosion.prototype.addAffectedTile = function(x, y) {
      this.tilesAffected.push({
         x: x,
         y: y
      });
   };

   Explosion.prototype.affects = function(x, y) {
      for (var i = 0; i < this.tilesAffected.length; i++) {
         var tile = this.tilesAffected[i];
         if (tile.x == x && tile.y == y) {
            return true;
         }
      }
      return false;
   };

   Explosion.create = function(map, x, y, power) {
      var explosion = new Explosion(), direction;

      for (var key in directions) {
         direction = directions[key];

         for (var i = 0; i <= power; i++) {
            var mx = x + (direction.x * i),
               my = y + (direction.y * i),
               tile = map.tileAt(mx, my);

            if (tile && tile != Dyna.model.Map.WALL) {
               explosion.addAffectedTile(mx, my);
               if (tile == Dyna.model.Map.BLOCK) {
                  explosion.blocksAffected++;
               }
               if (tile.solid) {
                  break;
               }
            } else {
               break;
            }
         }

      }

      return explosion;

   };

   var directions = {
      "east": {x: -1, y: 0},
      "west": {x: +1, y: 0},
      "north": {x: 0, y: -1},
      "south": {x: 0, y: +1}
   };

   Dyna.model.Explosion = Explosion;

})(window.Dyna);