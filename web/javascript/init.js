(function(Dyna) {

    function init() {

        log("Initialising DynaJS");

        Dyna.app.GlobalEvents = new Dyna.events.CustomEvent();

        var
                map = new Dyna.model.Map("Level 1", 10, 10),
                mapView = new Dyna.ui.MapView(jQuery("#map"), map),
                game = new Dyna.app.Game(map, mapView),
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