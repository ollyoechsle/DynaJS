window.Dyna = {
    app: {},
    util: {},
    ui: {},
    model: {},
    events: {}
};if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var fSlice = Array.prototype.slice,
                aArgs = fSlice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP
                            ? this
                            : oThis || window,
                            aArgs.concat(fSlice.call(arguments)));
                };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}Object.extend = function (SubClass, SuperClass) {

    var superPrototype = SuperClass.prototype;

    // apply the properties in the superclass prototype to the subclass
    for (var propertyName in superPrototype) {
        if (superPrototype.hasOwnProperty(propertyName)) {
            SubClass.prototype[propertyName] = superPrototype[propertyName];
        }
    }

    // make the original prototype available through a superclass variable
    SubClass.prototype.superclass = superPrototype;

};function log() {
    console && console.log.apply(window, arguments);
}/**
 * @see customeventTest.html For JS Unit tests
 */
(function(Dyna) {

    /**
     * Initialises the custom event
     * @constructor
     */
    function CustomEvent() {
        this._subscribers = [];
    }

    /**
     * An array of subscribers attached to this event
     * @type {Object[]}
     */
    CustomEvent.prototype._subscribers = null;

    /**
     * Adds a subscription function to the event
     * @param {String} event name of the event that the subscriber is listening to
     * @param {Function} subscriber
     * @throws Error if the subscriber is undefined or not a function
     */
    CustomEvent.prototype.on = function(event, subscriber) {

        var subscriberType = typeof subscriber;

        if (subscriberType === 'undefined') {
            throw new Error("CustomEvent: Subscriber cannot be undefined");
        }

        if (subscriberType !== 'function') {
            throw new Error("CustomEvent: Subscriber must be a function");
        }

        this._subscribers.push({
            fn: subscriber,
            event: event
        });

    };

    /**
     * Fires the event with a payload of data
     */
    CustomEvent.prototype.fire = function(event) {

        for (var i = 0, l = this._subscribers.length; i < l; i++) {
            var subscriberWrapper = this._subscribers[i];
            if (subscriberWrapper.event === event) {
                var args = [];
                for (var j = 1; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }
                subscriberWrapper.fn.apply(null, args);
            }
        }

    };

    /**
     * Unsubscribes a particular function *OR* all functions with the context
     * @param fn The callback function to remove
     * @param context The context to remove against (all functions with this context are removed)
     */
    CustomEvent.prototype.un = function(fn, context) {
        var i, l = this._subscribers.length, subscriber, newSubscribers = [];
        for (i = 0; i < l; i++) {
            subscriber = this._subscribers[i];
            if (subscriber.fn === fn || subscriber.context === context) {
                // exclude it from the new list
            } else {
                newSubscribers.push(subscriber);
            }
        }
        this._subscribers = newSubscribers;
    };

    /**
     * Removes all subscriber functions from the event
     */
    CustomEvent.prototype.unsubscribeAll = function() {
        this._subscribers = [];
    };

    Dyna.events.CustomEvent = CustomEvent;

})(window.Dyna);(function(Dyna) {

    /**
     * Constructor
     */
    function Map(name, width, height) {

        log("Creating map " + name);
        this.name = name;
        this.width = width;
        this.height = height;
        this._buildLevel();

    }

    Map.prototype.name = null;
    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.data = null;

    Map.prototype._buildLevel = function() {
        var data = [], row;

        for (var y = 0; y < this.height; y++) {

            row = [];

            for (var x = 0; x < this.width; x++) {

                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    row.push(Map.EARTH);
                }

            }

            data.push(row);

        }
        this.data = data;
    };

    Map.prototype.tileAt = function(x, y) {
        return this.data[x][y];
    };

    Map.EARTH = "earth";
    Map.WALL = "wall";

    Dyna.model.Map = Map;

})(window.Dyna);(function(Dyna) {

    /**
     * Constructor
     */
    function Player(name) {

        this.superclass.constructor.call(this);
        log("Creating player " + name);
        this.name = name;

    }

    Object.extend(Player, Dyna.events.CustomEvent);

    Player.prototype.name = null;

    Player.prototype.withControls = function(keyboardInput) {
        keyboardInput.on(Player.UP, this.move.bind(this));
        keyboardInput.on(Player.DOWN, this.move.bind(this));
        keyboardInput.on(Player.LEFT, this.move.bind(this));
        keyboardInput.on(Player.RIGHT, this.move.bind(this));
        return this;
    };

    Player.prototype.move = function() {
        log("Player is moving");
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";

    Dyna.model.Player = Player;

})(window.Dyna);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function Keyboard() {
        this.superclass.constructor.call(this);
        this._init();
    }

    Object.extend(Keyboard, Dyna.events.CustomEvent);

    var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

    var specialChars = {
        '38' :'up',
        '40' :'down',
        '37' :'left',
        '39' :'right',
        '13' :'enter',
        '9'  :'tab',
        '27' :'esc',
        '190' :'.',
        '191' :'/'
    };

    Keyboard.prototype._init = function() {
        log("Initialising keyboard events", this._subscribers);
        jQuery(document).keydown(this._handleKeyDown.bind(this));
    };

    Keyboard.prototype._handleKeyDown = function(event) {

        var keyCode = event.keyCode, action, actionTookPlace;

        log(keyCode);

        if (keyCode >= 65 && keyCode <= 90) {
            action = chars[keyCode - 65];
        } else if (keyCode >= 48 && keyCode <= 57) {
            action = keyCode - 48;
        } else {
            action = specialChars[keyCode];
        }

        if (action !== undefined) {
            actionTookPlace = this.fire("keydown", action, event);
        }

    };

    Dyna.util.Keyboard = Keyboard;

})(window.Dyna, jQuery);(function(Dyna) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {
        log("Creating mapview for  " + map.name);
        this.jContainer = jContainer;
        this.map = map;
        this.initialise();
    }

    MapView.prototype.map = null;
    MapView.prototype.jContainer = null;
    MapView.prototype.tileSize = 30;
    MapView.prototype.tileTemplate = null;

    MapView.prototype.initialise = function() {

        log("Initialising map view");

        this.tileSize = 30;
        this.initialiseMap();

    };

    MapView.prototype.initialiseMap = function() {
        this.jContainer
                .css("width", this.tileSize * this.map.width)
                .css("height", this.tileSize * this.map.height);
        this.tileTemplate = jQuery("<div class='tile'></div>");
    };

    MapView.prototype.getTile = function(tileClass, x, y) {
        return this.tileTemplate.clone()
                .addClass(tileClass)
                .css("left", x * this.tileSize)
                .css("top", y * this.tileSize)
    };

    MapView.prototype.updateAll = function() {

        var newContents = document.createDocumentFragment();

        for (var y = 0; y < this.map.height; y++) {
            for (var x = 0; x < this.map.width; x++) {
                newContents.appendChild(
                        this.getTile(this.map.tileAt(x, y), x, y)[0]
                        );
            }
        }

        this.jContainer.empty().append(newContents);

    };

    Dyna.ui.MapView = MapView;

})(window.Dyna);(function(Dyna) {

    /**
     * Constructor
     */
    function Game(map, mapView) {

        log("Starting Dyna Game on map " + map.name);
        this.players = [];
        this.map = map;
        this.mapView = mapView;
        this._initialiseEvents();

    }

    Game.prototype.players = null;
    Game.prototype.map = null;
    Game.prototype.mapView = null;

    Game.prototype._initialiseEvents = function() {
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
        this.mapView.updateAll();
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.addPlayer = function(player) {
        this.players.push(player);
        log("Game has " + this.players.length + " player(s)")
    };

    Game.prototype.start = function() {
    };

    Dyna.app.Game = Game;

})(window.Dyna);(function(Dyna) {

    /**
     * Manages mappings between key presses and actions
     */
    function KeyboardInput(keyboard, actions) {

        this.superclass.constructor.call(this);

        if (!actions) {
            throw new Error("Cannot create keyboard input without actions");
        }

        log("Starting Keyboard Input with actions " + actions);
        keyboard.on("keydown", this.handleKeyPress.bind(this));
        this.actions = actions;

    }

    Object.extend(KeyboardInput, Dyna.events.CustomEvent);

    KeyboardInput.prototype.actions = null;

    KeyboardInput.prototype.handleKeyPress = function(key) {
        log("Keyboard input handling key press for " + key);
        var event = this.actions[key];
        event && this.fire(event);
    };

    Dyna.app.KeyboardInput = KeyboardInput;

})(window.Dyna);(function(Dyna) {

    function init() {

        log("Initialising DynaJS");

        Dyna.app.GlobalEvents = new Dyna.events.CustomEvent();

        var
                map = new Dyna.model.Map("Level 1", 11, 11),
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