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
                bombViewFactory = function(bomb) { return new Dyna.ui.BombView("#level .players", bomb) },
                explosionViewFactory = function(explosion) { return new Dyna.ui.ExplosionView("#level .explosions", explosion) },
                levelView = new Dyna.ui.LevelView("#level", level, mapViewFactory, playerViewFactory, bombViewFactory, explosionViewFactory);

        // controller
        var
                game = new Dyna.app.Game(level, levelView);

        // run time
        level.addPlayer(new Player("Player 1").withControls(
                new Dyna.app.KeyboardInput(keyboard, {
                    "up" : Player.UP,
                    "down" : Player.DOWN,
                    "left" : Player.LEFT,
                    "right" : Player.RIGHT,
                    "enter" : Player.ENTER
                })));

        level.addPlayer(new Player("Player 2").withControls(
                new Dyna.app.KeyboardInput(keyboard, {
                    "w" : Player.UP,
                    "s" : Player.DOWN,
                    "a" : Player.LEFT,
                    "d" : Player.RIGHT,
                    "tab" : Player.ENTER
                })));

        game.start();

    }

    jQuery(document).ready(init);

})(window.Dyna);