(function(Dyna) {

    /**
     * @constructor
     */
    function Sound() {}

    /**
     * Plays the given sound
     * @param {String} file The sound file to play
     */
    Sound.play = function(file) {
        var snd = new window.Audio("snd/" + file);
        snd.play();
    };

    /**
     * Played when the user selects a menu option
     */
    Sound.SELECT = "select.wav";

    /**
     * Played when a bomb detonates
     */
    Sound.EXPLOSION = "explosion.wav";

    /**
     * Played when a player receives a powerup
     */
    Sound.POWERUP = "powerup.wav";

    /**
     * Played when a player dies
     */
    Sound.DIE = "die.wav";

    Dyna.util.Sound = Sound;

})(window.Dyna);