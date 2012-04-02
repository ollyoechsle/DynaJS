(function(Dyna) {

   /**
    * @constructor
    * @param {Dyna.model.Player} player The player to control
    */
   function ComputerController(player, map) {
      this.player = player;
      this.map = map;
      this.initialise();
   }

   /**
    * The player to control
    * @private
    * @type {Dyna.model.Player}
    */
   ComputerController.prototype.player = null;

   /**
    * Reference to the map, so the controller can explore
    * @private
    * @type {Dyna.model.Map}
    */
   ComputerController.prototype.map = null;

   /**
    * The current path that the computer is walking along
    * @private
    * @type {Object[]}
    */
   ComputerController.prototype.currentPath = null;

   /**
    * Ensures that the controller will stop working if the player dies
    * @private
    */
   ComputerController.prototype.initialise = function() {
      this.player.on(Dyna.model.Player.DIED, this.stopControlling.bind(this));
      this.interval = window.setInterval(this.think.bind(this), ComputerController.SPEED);
   };

   /**
    * Consider what to do with the player next
    */
   ComputerController.prototype.think = function() {

      if (!this.currentPath) {
         this.chooseSomewhereToGo();
      }

      this.takeNextStep();

   };

   /**
    * Moves the player one step towards the destination
    */
   ComputerController.prototype.takeNextStep = function() {
      if (this.currentPath) {
         if (this.currentPath.length) {
            var nextStep = this.currentPath.shift();
            this.player.fire(Dyna.model.Player.WANTS_TO_MOVE, this.player, nextStep.x, nextStep.y);
         } else {
            this.player.layBomb();
            this.currentPath = null;
         }
      }
   };

   /**
    * Finds some place for the player to go to
    */
   ComputerController.prototype.chooseSomewhereToGo = function() {

      var pathFinder = new Dyna.util.PathFinder(this.map, this.player.x, this.player.y),
         potentialDestinations = pathFinder.getAvailableDestinations(),
         chosenDestination = this.chooseDestinationFrom(pathFinder.getAvailableDestinations());

      if (chosenDestination) {
         this.currentPath = pathFinder.getPathTo(chosenDestination.x, chosenDestination.y);
      }

   };

   ComputerController.prototype.getScoreForDestination = function(x, y) {

      var score = 0;

      // get points for blowing up walls
      var possibleExplosion = Dyna.model.Explosion.create(this.map, x, y, this.player.power);
      score += possibleExplosion.blocksAffected;

      // points for power ups
      if (this.map.isPowerUp(x, y)) {
         score += 10;
      }

      // less points for being the current position
      if (x == this.player.x && y == this.player.y) {
         score -= 2;
      }

      if (Dyna.service.FBI.instance.estimateDangerAt(x, y)) {
         score -= 20;
      }

      return score;

   };

   /**
    * Chooses a destination to travel to from a list of potential destinations
    * @param {Object[]} potentialDestinations The list of destinations
    */
   ComputerController.prototype.chooseDestinationFrom = function(potentialDestinations) {

      var maxScore = 0, destination, chosenDestination, score;

      for (var i = 0; i < potentialDestinations.length; i++) {

         destination = potentialDestinations[i];
         score = this.getScoreForDestination(destination.x, destination.y);

         if (score > maxScore) {
            maxScore = score;
            chosenDestination = destination;
         }

      }

      return chosenDestination;
   };

   /**
    * Stops the computer controller from affecting the player
    */
   ComputerController.prototype.stopControlling = function() {
      window.clearInterval(this.interval);
   };

   ComputerController.SPEED = 500;

   Dyna.app.ComputerController = ComputerController;

})(window.Dyna);