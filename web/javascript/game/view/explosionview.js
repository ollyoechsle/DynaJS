(function(Dyna, jQuery) {

   function ExplosionView(jContainer, explosion, map) {
      this.jContainer = jQuery(jContainer);
      this.explosion = explosion;
      this.map = map;
      this.initialise();
   }

   ExplosionView.prototype.map = null;
   ExplosionView.prototype.explosion = null;
   ExplosionView.prototype.jContainer = null;
   ExplosionView.prototype.jExplosion = null;

   ExplosionView.prototype.initialise = function() {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < this.explosion.tilesAffected.length; i++) {
         var tile = this.explosion.tilesAffected[i];
         if (this.map.inBounds(tile.x, tile.y)) {
            fragment.appendChild(ExplosionView.createFireBall(tile.x, tile.y));
         }
      }
      this.jContainer.append(fragment);
      this.boom();
   };

   ExplosionView.createFireBall = function(x, y) {
      return jQuery("<div class='fireBall'></div>")
         .css("left", x * Dyna.ui.LevelView.tileSize)
         .css("top", y * Dyna.ui.LevelView.tileSize)
         [0];
   };

   ExplosionView.prototype.boom = function() {
      var snd = new Audio("snd/explosion.wav");
      snd.play();
   };

   Dyna.ui.ExplosionView = ExplosionView;

})(window.Dyna, jQuery);