(function(Dyna) {

    function init() {

        log("Initialising DynaJS");

        Dyna.app.GlobalEvents = new Dyna.events.CustomEvent();

        var Player = Dyna.model.Player;

        // eventing
        var
                keyboard = new Dyna.util.Keyboard();

        // model
        var
                map = new Dyna.model.Map(11, 11),
                level = new Dyna.model.Level("Level 1", map);

        // view
        var
                mapViewFactory = function(map) { return new Dyna.ui.MapView("#level .map", map) },
                playerViewFactory = function(player) { return new Dyna.ui.PlayerView("#level .players", player) },
                levelView = new Dyna.ui.LevelView("#level", level, mapViewFactory, playerViewFactory);

        // controller
        var
                game = new Dyna.app.Game(level, levelView);

        // run time
        level.addPlayer(new Player("Player 1").withControls(
                new Dyna.app.KeyboardInput(keyboard, {
                    "up" : Player.UP,
                    "down" : Player.DOWN,
                    "left" : Player.LEFT,
                    "right" : Player.RIGHT
                })));

        game.start();

    }

    jQuery(document).ready(init);

})(window.Dyna);