(function(Dyna) {

    function init() {

        log("Initialising DynaJS");

        Dyna.app.GlobalEvents = new Dyna.events.CustomEvent();

        var
                game = new Dyna.app.Game(),
                keyboard = new Dyna.util.Keyboard(),
                Player = Dyna.model.Player;

        game.addPlayer(
                new Player("Player1").withControls(
                        new Dyna.app.KeyboardInput(keyboard, {
                            "up" : Player.UP,
                            "down" : Player.DOWN,
                            "left" : Player.LEFT,
                            "right" : Player.RIGHT
                        })))

    }

    jQuery(document).ready(init);

})(window.Dyna);