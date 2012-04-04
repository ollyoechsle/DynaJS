(function(Dyna) {

    function Walker(fbi) {
        this.fbi = fbi
    }

    /**
     * Reference to the FBI
     * @type {Dyna.service.FBI}
     */
    Walker.prototype.fbi = null;

    /**
     *
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Player} me The player who is me
     */
    Walker.prototype.shouldWalkTo = function(x, y, me) {
       return !this.fbi.estimateDangerAt(x, y) || this.fbi.estimateDangerAt(me.x, me.y);
    };

    Dyna.ai.Walker = Walker;

})(window.Dyna);