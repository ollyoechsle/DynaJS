(function(Dyna) {

    function Layer(name) {
        this.animations = [];
        this.name = name;
    }

    Layer.prototype.animations = null;
    Layer.prototype.name = null;

    Layer.prototype.push = function(animation) {
        if (animation) {
            this.animations.push(animation);
        } else {
            log("Attempt to push invalid animation to layer " + this.name);
        }
    };

    Layer.prototype.render = function(ctx, now) {
        var animations = this.animations, animation;
        for (var i = 0, l = animations.length; i < l; i++) {
            animations[i].render(ctx, now);
        }
    };

    Dyna.ui.Layer = Layer;

})(Dyna);