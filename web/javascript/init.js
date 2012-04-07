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
            map = new Dyna.model.Map(11, 11, {
                blocks: 0.75,
                powerups: 0.10
            }),
            level = new Dyna.model.Level("Level 1", map),
            fbi = new Dyna.service.FBI(level);

        // view
        var
            mapViewFactory = function(map) {
                return new Dyna.ui.MapView("#level .map", map)
            },
            playerViewFactory = function(player) {
                return new Dyna.ui.PlayerView("#level .players", player)
            },
            bombViewFactory = function(bomb) {
                return new Dyna.ui.BombView("#level .players", bomb)
            },
            explosionViewFactory = function(explosion) {
                return new Dyna.ui.ExplosionView("#level .explosions", explosion, map)
            },
            levelView = new Dyna.ui.LevelView("#level", level, mapViewFactory, playerViewFactory, bombViewFactory, explosionViewFactory);

        // controller
        var
            game = new Dyna.app.Game(level, levelView),
            gameOverView = new Dyna.ui.GameOverView(game),
            player1 = new Player("Computer 1"),
            player2 = new Player("Player 2"),
            destinationChooser = new Dyna.ai.DestinationChooser(),
            bomber = new Dyna.ai.Bomber(),
            walker = new Dyna.ai.Walker(fbi),
            controller1 = new Dyna.app.ComputerController(player1, level, map, destinationChooser, bomber, walker),
            controller2 = new Dyna.app.HumanController(player2).withControls(
                new Dyna.util.KeyboardInput(keyboard, {
                    "up" : Player.UP,
                    "down" : Player.DOWN,
                    "left" : Player.LEFT,
                    "right" : Player.RIGHT,
                    "enter" : Player.ENTER
                }));

        level.addPlayer(player1);
        level.addPlayer(player2);

        game.start();

    }

    jQuery(document).ready(init);

})(window.Dyna);