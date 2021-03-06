(function(Dyna) {

    function Bomber() {
    }

    /**
     * Determines whether laying another bomb will cause more harm than good.
     * For the sake of simplicity, at the moment this returns false if the player
     * has already laid one bomb. Otherwise the player tends to make silly decisions
     * resulting in lethal chain reactions :s
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    Bomber.prototype.layingBombHereIsAGoodIdea = function(x, y, map, me) {

        // don't lay more than one bomb at once
        if (me.bombsLaid > 0) {
            return false;
            // todo: return true if laying the second bomb won't hurt me
        }

        // todo: false if it would destroy a powerup

        var possibleExplosion = Dyna.model.Explosion.create(map, x, y, me.power);
        return possibleExplosion.blocksAffected > 0;
        // todo: include check to see if enemies might killed

    };

    /**
     * Decides whether a bomb can be laid on route
     * @param {Object[]} route The remaining route
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Player} me The player who is me
     */
    Bomber.prototype.canLayBombOnRoute = function(route, x, y, me) {
        // todo: clever logic needed
        return false
    };

    Dyna.ai.Bomber = Bomber;

})(window.Dyna);