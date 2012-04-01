(function(window) {

    var log = Function.prototype.bind.call(console.log, console);

    window.log = function() {
        log.apply(console, arguments);
    }

})(window);