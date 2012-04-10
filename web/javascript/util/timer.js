(function(Dyna) {

    function Timer() {
        Dyna.app.GlobalEvents.on("gameover", this.clearAll.bind(this));
        this.timeouts = [];
        this.intervals = [];
    }

    Timer.prototype.timeouts = null;
    Timer.prototype.intervals = null;

    Timer.prototype.setTimeout = function(fn, delay) {
        var timeoutId = window.setTimeout(fn, delay);
        this.timeouts.push(timeoutId);
        return timeoutId;
    };

    Timer.prototype.setInterval = function(fn, delay) {
        var intervalId = window.setInterval(fn, delay);
        this.intervals.push(intervalId);
        return id;
    };

    Timer.prototype.clearAll = function() {
        this.timeouts.forEach(function(timeout) {
            window.clearTimeout(timeout);
        });
        this.intervals.forEach(function(interval) {
            window.clearInterval(interval);
        });
        this.timeouts = [];
        this.intervals = [];
    };

    Timer.initialise = function() {
        Dyna.util.Timer = new Timer();
    };

    Dyna.util.Timer = Timer;

})(Dyna);