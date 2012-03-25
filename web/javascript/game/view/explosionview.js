(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function ExplosionView(jContainer, explosion) {
        this.jContainer = jQuery(jContainer);
        this.explosion = explosion;
        this.initialise();
    }

    ExplosionView.prototype.explosion = null;
    ExplosionView.prototype.jContainer = null;
    ExplosionView.prototype.jExplosion = null;

    ExplosionView.prototype.initialise = function() {

    };

    ExplosionView.prototype.showExplosion = function() {

    };

    Dyna.ui.ExplosionView = ExplosionView;

})(window.Dyna, jQuery);