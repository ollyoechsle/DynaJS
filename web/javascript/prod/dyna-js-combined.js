window.Dyna = {
    app: {},
    ai: {},
    events: {},
    model: {},
    service: {},
    util: {},
    ui: {}
};if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */) {
        "use strict";

        if (this == null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}  // Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}//Because Safari 5.1 doesn't have Function.bind
if (typeof(Function.prototype.bind) == 'undefined') {
	Function.prototype.bind = function(context) {
		var oldRef = this;
		return function() {
			return oldRef.apply(context || null, Array.prototype.slice.call(arguments));
		};
	}
}
(function() {

    /**
     * Returns a Gaussian Random Number around a normal distribution defined by the mean
     * and standard deviation parameters.
     *
     * Uses the algorithm used in Java's random class, which in turn comes from
     * Donald Knuth's implementation of the BoxÐMuller transform.
     *
     * @param {Number} [mean = 0.0] The mean value, default 0.0
     * @param {Number} [standardDeviation = 1.0] The standard deviation, default 1.0
     * @return {Number} A random number
     */
    Math.randomGaussian = function(mean, standardDeviation) {

        mean = defaultTo(mean, 0.0);
        standardDeviation = defaultTo(standardDeviation, 1.0);

        if (Math.randomGaussian.nextGaussian !== undefined) {
            var nextGaussian = Math.randomGaussian.nextGaussian;
            delete Math.randomGaussian.nextGaussian;
            return (nextGaussian * standardDeviation) + mean;
        } else {
            var v1, v2, s, multiplier;
            do {
                v1 = 2 * Math.random() - 1; // between -1 and 1
                v2 = 2 * Math.random() - 1; // between -1 and 1
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s == 0);
            multiplier = Math.sqrt(-2 * Math.log(s) / s);
            Math.randomGaussian.nextGaussian = v2 * multiplier;
            return (v1 * multiplier * standardDeviation) + mean;
        }

    };

    /**
     * Returns a normal probability density function for the given parameters.
     * The function will return the probability for given values of X
     *
     * @param {Number} [mean = 0] The center of the peak, usually at X = 0
     * @param {Number} [standardDeviation = 1.0] The width / standard deviation of the peak
     * @param {Number} [maxHeight = 1.0] The maximum height of the peak, usually 1
     * @returns {Function} A function that will return the value of the distribution at given values of X
     */
    Math.getGaussianFunction = function(mean, standardDeviation, maxHeight) {

        mean = defaultTo(mean, 0.0);
        standardDeviation = defaultTo(standardDeviation, 1.0);
        maxHeight = defaultTo(maxHeight, 1.0);

        return function getNormal(x) {
            return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
        }
    };

    function defaultTo(value, defaultValue) {
        return isNaN(value) ? defaultValue : value;
    }

})();Object.extend = function (SubClass, SuperClass) {
    function F() {}

    F.prototype = SuperClass.prototype;
    SubClass.prototype = new F();
    SubClass.prototype.constructor = SubClass;
    
    SubClass.superclass = SuperClass.prototype;

};
(function() {
    var lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());(function(window) {

    var log = Function.prototype.bind.call(console.log, console);

    window.log = function() {
        log.apply(console, arguments);
    }

})(window);/**
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
     * @param map The map
     * @param startX The starting X coordinate
     * @param startY The starting Y coordinate
     */
    function PathFinder(map, startX, startY) {
        this.map = map;
        this.startX = startX;
        this.startY = startY;
    }

    /**
     * The starting X coordinate
     * @type {Number}
     */
    PathFinder.prototype.startX = null;

    /**
     * The starting Y coordinate
     * @type {Number}
     */
    PathFinder.prototype.startY = null;

    /**
     * Reference to the map
     * @type {Number}
     */
    PathFinder.prototype.map = null;

    /**
     * A stack for performing "recursion" in an interative way. See getPathTo for how it is used.
     * @private
     * @type {Object[]}
     */
    PathFinder.prototype.stack = null;

    /**
     * A list of all the complete paths to the destination found so far.
     * @private
     * @type {String[]}
     */
    PathFinder.prototype.completePathsFound = null;

    /**
     * Finds all the available tiles that a player could visit from the current location
     */
    PathFinder.prototype.getAvailableDestinations = function() {

        var availablePositions = "", map = this.map;

        function explore(cx, cy) {

            var key, direction, nx, ny;

            availablePositions = availablePositions + encodePath(cx, cy) + ",";

            for (key in directions) {
                direction = directions[key],nx = cx + direction.x,ny = cy + direction.y;
                if (map.isFree(nx, ny)) {
                    if (availablePositions.lastIndexOf(encodePath(nx, ny)) == -1) {
                        explore(nx, ny);
                    }
                }
            }

        }

        explore(this.startX, this.startY);

        return convert(availablePositions)

    };

    /**
     * Finds the quickest path to the given coordinates. If there is no path, then the function returns null.
     * @param {Number} x The X coordinate of the destination, zero based
     * @param {Number} y The Y coordinate of the destination, zero based
     */
    PathFinder.prototype.getPathTo = function(x, y) {

        // create a stack and push the initial position onto it. The arrays passed to the stack
        // are arguments which will be applied to the _findPath call
        this.stack = [];
        this.completePathsFound = [];
        this.stack.push([this.startX, this.startY, encodePath(x, y), ""]);

        // loop so long as there are additional paths to explore and we have not found any paths to the destination
        while (this.stack.length && this.completePathsFound.length == 0) {

            // remove everything from the stack into a new array
            // this will find everything at the next distance from the start
            // but ensures that the stack only contains items of one distance at once
            // this allows us to find the closest path without performing an exhaustive search
            // of the map
            var batch = [];
            while (this.stack.length) {
                batch.push(this.stack.pop());
            }

            // look at everything found at this level. Calls to find path will
            // add new entries to the stack
            for (var i = 0; i < batch.length; i++) {
                this._findPath.apply(this, batch[i]);
            }

        }

        if (!this.completePathsFound.length) {
            return null;
        } else {
            return convert(this.completePathsFound[0]);
        }

    };

    /**
     * Recursive function to search the map seeking directions
     * @param {Number} cx The current X position
     * @param {Number} cy The current Y position
     * @param {String} encodedDestination An encoded version of the destination
     * @param {String} currentPath The current path from the initial starting point
     */
    PathFinder.prototype._findPath = function(cx, cy, encodedDestination, currentPath) {

        var encodedCurrent = encodePath(cx, cy);
        currentPath = currentPath + encodedCurrent + ",";

        // check if we've reached destination
        if (encodedCurrent === encodedDestination) {
            this.completePathsFound.push(currentPath);
            return;
        }

        // look around the square
        for (var key in directions) {
            var direction = directions[key], nx = cx + direction.x, ny = cy + direction.y;
            if (this.map.isFree(nx, ny)) {
                if (currentPath.lastIndexOf(encodePath(nx, ny)) == -1) {
                    this.stack.push([nx, ny, encodedDestination, currentPath]);
                }
            }
        }

    };

    var letters = ['a','b','c','d','e','f','g','h','i','j','k', 'l', 'm', 'n'];

    var encodePath = function(x, y) {
        return letters[x] + y;
    };

    var decodePath = function(str) {
        return {
            x: letters.indexOf(str[0]),
            y: +str.substring(1)
        }
    };

    var directions = {
        "east": {x: -1, y: 0},
        "west": {x: +1, y: 0},
        "north": {x: 0, y: -1},
        "south": {x: 0, y: +1}
    };

    var convert = function(path) {
        var positions = [], encodedPaths = path.split(","), i, l;
        for (i = 0,l = encodedPaths.length - 1; i < l; i++) {
            positions.push(decodePath(encodedPaths[i]))
        }
        return positions;
    };

    Dyna.util.PathFinder = PathFinder;

})(window.Dyna);(function(Dyna) {

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

})(window.Dyna);(function(Dyna) {

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

})(Dyna);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function Keyboard() {
        Keyboard.superclass.constructor.call(this);
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

        if (keyCode >= 65 && keyCode <= 90) {
            action = chars[keyCode - 65];
        } else if (keyCode >= 48 && keyCode <= 57) {
            action = keyCode - 48;
        } else {
            action = specialChars[keyCode];
        }

        if (action !== undefined) {
            actionTookPlace = this.fire("keydown", action, event);
            return false;
        } else {
            return true;
        }

    };

    Dyna.util.Keyboard = Keyboard;

})(window.Dyna, jQuery);(function(Dyna) {

    /**
     * Manages mappings between key presses and actions
     */
    function KeyboardInput(keyboard, actions) {

        KeyboardInput.superclass.constructor.call(this);

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
        var event = this.actions[key];
        event && this.fire(event);
    };

    Dyna.util.KeyboardInput = KeyboardInput;

})(window.Dyna);(function(Dyna) {

    var id = 0;

    /**
     * @constructor
     * @param {Number} x the X coordinate of the bomb
     * @param {Number} y the Y coordinate of the bomb
     * @param {Number} power The number of squares in each direction that the bomb explosion can affect
     */
    function Bomb(x, y, power) {

        Bomb.superclass.constructor.call(this);

        this.id = ++id;
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = power;

        log("Creating bomb", this.id);
        this.startTicking();

    }

    Object.extend(Bomb, Dyna.events.CustomEvent);

    /**
     * A unique identifier for each bomb
     * @type {Number}
     */
    Bomb.prototype.id = null;

    /**
     * The X coordinate of the bomb on the map
     * @type {Number}
     */
    Bomb.prototype.x = null;

    /**
     * The Y coordinate of the bomb on the map
     * @type {Number}
     */
    Bomb.prototype.y = null;

    /**
     * Whether the bomb has exploded yet
     * @type {Boolean}
     */
    Bomb.prototype.exploded = false;

    /**
     * The number of squares that the bomb explosion can affect
     * @type {Number}
     */
    Bomb.prototype.power = 0;

    Bomb.prototype.timer = null;

    Bomb.prototype.startTicking = function() {
        this.timer = Dyna.util.Timer.setTimeout(this.explode.bind(this), 3 * 1000);
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.triggerChainReaction.bind(this))
    };

    Bomb.prototype.triggerChainReaction = function(explosion) {
        if (explosion.affects(this.x, this.y) && this.timer) {
            window.clearTimeout(this.timer);
            Dyna.util.Timer.setTimeout(this.explode.bind(this), 300);
            this.explode();
        }
    };

    Bomb.prototype.explode = function() {
        this.timer = null;
        this.exploded = true;
        this.fire(Bomb.EXPLODE, this.x, this.y, this.power, this);
    };

    Bomb.prototype.at = function(x, y) {
        return this.x == x && this.y == y;
    };

    /** @event */
    Bomb.EXPLODE = "explode";

    Dyna.model.Bomb = Bomb;

})(window.Dyna);(function(Dyna) {

    function Explosion(x, y) {
        this.tilesAffected = [];
        this.blocksAffected = 0;
        this.x = x;
        this.y = y;
    }

    Explosion.prototype.tilesAffected = null;
    Explosion.prototype.blocksAffected = 0;

    /**
     * @type {Number} The X position of the center of the explosion
     */
    Explosion.prototype.x = 0;

    /**
     * @type {Number} The Y position of the center of the explosion
     */
    Explosion.prototype.y = 0;

    /**
     * @type {Number} The distance to the east that the explosion covers
     */
    Explosion.prototype.eastExtent = 0;

    /**
     * @type {Number} The distance to the west that the explosion covers
     */
    Explosion.prototype.westExtent = 0;

    /**
     * @type {Number} The distance to the north that the explosion covers
     */
    Explosion.prototype.northExtent = 0;

    /**
     * @type {Number} The distance to the south that the explosion covers
     */
    Explosion.prototype.southExtent = 0;

    Explosion.prototype.addAffectedTile = function(x, y) {
        this.tilesAffected.push({
            x: x,
            y: y
        });
    };

    Explosion.prototype.affects = function(x, y) {
        for (var i = 0; i < this.tilesAffected.length; i++) {
            var tile = this.tilesAffected[i];
            if (tile.x == x && tile.y == y) {
                return true;
            }
        }
        return false;
    };

    Explosion.create = function(map, x, y, power) {
        var explosion = new Explosion(x, y), direction, key, extent, mx, my, tile;

        explosion.addAffectedTile(x, y);

        for (key in directions) {
            direction = directions[key];

            for (extent = 1; extent <= power; extent++) {

                mx = x + (direction.x * extent);
                my = y + (direction.y * extent);
                tile = map.tileAt(mx, my);

                if (tile && tile != Dyna.model.Map.WALL) {
                    explosion.addAffectedTile(mx, my);
                    if (tile == Dyna.model.Map.BLOCK) {
                        explosion.blocksAffected++;
                    }
                    if (tile.solid) {
                        break;
                    }
                } else {
                    extent--;
                    break;
                }
            }

            explosion[key + "Extent"] = Math.min(extent, power);

        }

        return explosion;

    };

    var directions = {
        "east": {x: +1, y: 0},
        "west": {x: -1, y: 0},
        "north": {x: 0, y: -1},
        "south": {x: 0, y: +1}
    };

    Dyna.model.Explosion = Explosion;

})(window.Dyna);(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the level
     * @param {Dyna.model.Map} map The map being played on
     */
    function Level(name, map) {

        Level.superclass.constructor.call(this);

        log("Creating level " + name);
        this.map = map;
        this.players = [];

    }

    Object.extend(Level, Dyna.events.CustomEvent);

    /**
     * The map
     * @private
     * @type {Dyna.model.Map}
     */
    Level.prototype.map = null;

    /**
     * A list of all the players on the map
     * @private
     * @type {Dyna.model.Player[]}
     */
    Level.prototype.players = [];

    /**
     * A list of all the monsters on the map
     * @private
     * @type {Dyna.model.Player[]}
     */
    Level.prototype.monsters = [];

    /**
     * Adds a player and listens for events in the player's life
     * @param {Dyna.model.Player} player The player just added
     */
    Level.prototype.addPlayer = function(player) {
        if (this.addLifeForm(player)) {
            this.players.push(player);
            player.on(Dyna.model.Player.LAID_BOMB, this.handleBombAdded.bind(this));
        } else {
            log("No room for this player on the map");
        }
    };

    /**
     * Adds a monster to the level
     * @param {Dyna.model.Lifeform} monster The monster just added
     */
    Level.prototype.addMonster = function(monster) {
        if (this.addLifeForm(monster)) {
            this.monsters.push(monster);
        } else {
            log("No room for this monster on the map");
        }
    };

    /**
     * Adds another life form to the map
     * @private
     * @param {Dyna.model.Lifeform} lifeform The life form to be added
     * @return True, if the player could be added to the map; false if not
     */
    Level.prototype.addLifeForm = function(lifeform) {
        if (this.map.findPositionFor(lifeform)) {
            lifeform.on(Dyna.model.Lifeform.WANTS_TO_MOVE, this.handlePlayerMove.bind(this));
            lifeform.on(Dyna.model.Lifeform.DIED, this.handlePlayerDied.bind(this));
            this.fire(Level.LIFEFORM_ADDED, lifeform);
            return true;
        } else {
            return false;
        }
    };

    /**
     * Handles a bomb added, and starts to listen for explosion
     * @param {Dyna.model.Bomb} bomb The bomb
     */
    Level.prototype.handleBombAdded = function(bomb) {
        this.fire(Level.BOMB_ADDED, bomb);
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExploded.bind(this));
    };

    /**
     * Destroys tiles affected by an exposion
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     * @param {Number} power The power of the bomb
     */
    Level.prototype.handleBombExploded = function(x, y, power) {

        var explosion = Dyna.model.Explosion.create(this.map, x, y, power);

        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            this.map.destroy(tile.x, tile.y);
        }

        Dyna.app.GlobalEvents.fire(Level.EXPLOSION, explosion);

    };

    /**
     * Manages power ups and allows players to move
     * @param {Dyna.model.Player} lifeform
     * @param {Number} x The X position where the player wants to move to
     * @param {Number} y The Y position where the player wants to move to
     */
    Level.prototype.handlePlayerMove = function(lifeform, x, y) {
        if (this.map.isFree(x, y)) {
            lifeform.moveTo(x, y);
            this.killAnyPlayersOverlappingMonstersAt(x, y);
            if (this.map.steppedOnLevelUp(x, y) && lifeform.powerUp) {
                this.fire(Level.LEVEL_UP, lifeform);
                lifeform.powerUp();
            }
        }
    };

    Level.prototype.killAnyPlayersOverlappingMonstersAt = function(x, y) {
        if (this.monstersAt(x, y).length) {
            this.playersAt(x, y).forEach(function(player) {
                player.die();
            })
        }
    };

    Level.prototype.playersAt = function(x, y) {
        return this.players.filter(function atPosition(player) {
            return player.x == x && player.y == y;
        });
    };

    Level.prototype.monstersAt = function(x, y) {
        return this.monsters.filter(function atPosition(monster) {
            return monster.x == x && monster.y == y;
        });
    };

    /**
     * Handles the event where a player dies
     */
    Level.prototype.handlePlayerDied = function() {
        if (this.getRemainingPlayers().length <= 1) {
            window.setTimeout(this.endLevel.bind(this), 3000);
        }
    };

    /**
     * Gets the remaining living players
     * @return {Dyna.model.Player[]}
     */
    Level.prototype.getRemainingPlayers = function() {
        return this.players.filter(function notDead(player) {
            return !player.dead;
        });
    };

    /**
     * Fires the end level event with the remaining living players
     */
    Level.prototype.endLevel = function() {
        this.fire(Level.ENDED, this.getRemainingPlayers());
    };

    /** @event */
    Level.LIFEFORM_ADDED = "lifeformAdded";

    /** @event */
    Level.BOMB_ADDED = "bombAdded";

    /** @event */
    Level.EXPLOSION = "bombExploded";

    /** @event */
    Level.LEVEL_UP = "levelUp";

    /** @event */
    Level.ENDED = "ended";

    Dyna.model.Level = Level;

})(window.Dyna);(function(Dyna) {

    function Map(width, height, settings) {
        this.width = width;
        this.height = height;
        this.maxDistance = width + height;
        this.playerPositions = [];
        this._createMap(settings);
    }

    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.maxDistance = null;
    Map.prototype.data = null;

    /**
     * An array of locations on the map where players can be placed
     * @type {Object[]}
     */
    Map.prototype.playerPositions = null;

    Map.prototype._createMap = function(settings) {
        var data = [], row, x, y;

        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    if (Math.random() < settings.blocks) {
                        if (Math.random() < settings.powerups) {
                            row.push(Map.HIDDEN_POWERUP);
                        } else {
                            row.push(Map.BLOCK)
                        }
                    } else {
                        row.push(Map.EARTH);
                    }
                }
            }
            data.push(row);
        }

        this.playerPositions.push({x : 0, y : 0});
        this.playerPositions.push({x : this.width - 1, y : this.height - 1});
        this.playerPositions.push({x : this.width - 1, y : 0});
        this.playerPositions.push({x : 0, y : this.height - 1});

        this.data = data;
    };

    Map.prototype.clearSpaceAround = function(x, y) {
        this.data[x][y] = Map.EARTH;
        if (y < this.height - 1) this.data[x][y + 1] = Map.EARTH;
        if (y > 0) this.data[x][y - 1] = Map.EARTH;
        if (x > 0) this.data[x - 1][y] = Map.EARTH;
        if (x < this.width - 1) this.data[x + 1][y] = Map.EARTH;
    };

    Map.prototype.findPositionFor = function(lifeform) {
        var position = this.playerPositions.shift();
        if (position) {
            lifeform.moveTo(position.x, position.y);
            this.clearSpaceAround(position.x, position.y);
            return true;
        } else {
            return false;
        }
    };

    Map.prototype.destroy = function(x, y) {
        var tile = this.tileAt(x, y);
        if (tile && tile.destroy) {
            this.data[x][y] = tile.destroy();
        }
    };

    Map.prototype.inBounds = function(x, y) {
        return !(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1);
    };

    Map.prototype.tileAt = function(x, y) {
        if (this.inBounds(x, y)) {
            return this.data[x][y];
        } else {
            return null;
        }
    };

    Map.prototype.isSolid = function(x, y) {
        if (this.inBounds(x, y)) {
            return this.data[x][y].solid;
        } else {
            return false;
        }
    };

    Map.prototype.isFree = function(x, y) {
        var tile = this.tileAt(x, y);
        return tile && !tile.solid && !Dyna.service.FBI.instance.bombAt(x, y);
    };

    Map.prototype.isPowerUp = function(x, y) {
        var tile = this.tileAt(x, y);
        return tile == Map.POWERUP;
    };

    Map.prototype.steppedOnLevelUp = function(x, y) {
        var tile = this.tileAt(x, y);
        if (tile && tile == Map.POWERUP) {
            this.data[x][y] = tile.destroy();
            return true;
        } else {
            return false;
        }
    };

    Map.EARTH = {
        solid: false,
        type: "earth"
    };

    Map.WALL = {
        solid: true,
        type: "wall"
    };

    Map.BLOCK = {
        type: "block",
        solid: true,
        destroy: function() {
            return Map.EARTH;
        }
    };

    Map.POWERUP = {
        type: "powerup",
        solid: false,
        destroy: function() {
            return Map.EARTH;
        }
    };

    Map.HIDDEN_POWERUP = {
        type: "block",
        solid: true,
        destroy: function() {
            return Map.POWERUP;
        }
    };

    Dyna.model.Map = Map;

})(window.Dyna);(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the lifeform
     * @param {Number} skin The skin of the player
     */
    function Lifeform(name, skin) {
        log("Creating Lifeform " + name);
        Lifeform.superclass.constructor.call(this);
        this.name = name;
        this.skin = skin;
        this.initialise();
    }

    Object.extend(Lifeform, Dyna.events.CustomEvent);

    /**
     * The name of the life form
     * @type {String}
     */
    Lifeform.prototype.name = null;

    /**
     * The skin of the player, eg "player1", or "mushtopus"
     * @type {String}
     */
    Lifeform.prototype.skin = null;

    /**
     * Whether this life form is dead or not
     * @type {Boolean}
     */
    Lifeform.prototype.dead = false;

    /**
     * The current X position of the life form on the map
     * @type {Number}
     */
    Lifeform.prototype.x = null;

    /**
     * The current Y position of the life form on the map
     * @type {Number}
     */
    Lifeform.prototype.y = null;

    /**
     * Listens for explosions that could kill it
     */
    Lifeform.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.possiblyGetBlownUp.bind(this));
    };

    /**
     * Makes the life form die if something explodes near to it.
     * @param {Dyna.model.Explosion} explosion The explosion from the detonated bomb
     */
    Lifeform.prototype.possiblyGetBlownUp = function(explosion) {
        if (explosion.affects(this.x, this.y)) {
            this.die();
        }
    };

    /**
     * Makes the Lifeform request a move to a new position.
     * @param {Number} nx The new position in X
     * @param {Number} ny The new position in Y
     */
    Lifeform.prototype.move = function(nx, ny) {
        this.fire(Lifeform.WANTS_TO_MOVE, this, nx, ny);        
    };

    Lifeform.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.fire(Lifeform.MOVED);
    };

    Lifeform.prototype.die = function() {
        this.dead = true;
        this.fire(Lifeform.DIED);
    };

    /**
     * Returns the rough distance to a point
     * @param {Number} x
     * @param {Number} y
     */
    Lifeform.prototype.distanceTo = function(x, y) {
        return Math.abs(this.x - x) + Math.abs(this.y - y);
    };

    /** @event */
    Lifeform.MOVED = "moved";

    /** @event */
    Lifeform.DIRECTION_CHANGED = "directionChanged";

    /** @event */
    Lifeform.WANTS_TO_MOVE = "wantsToMove";

    /** @event */
    Lifeform.DIED = "died";

    Dyna.model.Lifeform = Lifeform;

})(window.Dyna);(function(Dyna) {

    /**
     * @constructor
     * @param {String} name The name of the player
     * @param {Number} skin The skin of the player, eg "player1"
     */
    function Player(name, skin) {
        log("Creating player " + name);
        Player.superclass.constructor.call(this, name, skin);
        this.bombsLaid = 0;
        this.bombsAvailable = 2;
    }

    Object.extend(Player, Dyna.model.Lifeform);

    Player.prototype.bombsLaid = 0;
    Player.prototype.power = 1;
    Player.prototype.bombsAvailable = 0;

    Player.prototype.powerUp = function() {
        this.power++;
    };

    Player.prototype.layBomb = function() {

        if (this.bombsLaid < this.bombsAvailable) {
            var bomb = new Dyna.model.Bomb(this.x, this.y, this.power);
            this.bombsLaid++;
            bomb.on(Dyna.model.Bomb.EXPLODE, this._handleMyBombExploded.bind(this));
            this.fire(Player.LAID_BOMB, bomb);
        }

    };

    Player.prototype.move = function(nx, ny) {
        var direction;
        if (this.x > nx) {
            direction = 'west';
        } else if (this.x < nx) {
            direction = 'east';
        } else if (this.y < ny) {
            direction = 'south';
        } else {
            direction = 'north';
        }
        Player.superclass.move.apply(this, arguments);
        this.fire(Dyna.model.Lifeform.DIRECTION_CHANGED, direction);
    };

    Player.prototype._handleMyBombExploded = function() {
        this.bombsLaid--;
    };

    Player.UP = "up";
    Player.DOWN = "down";
    Player.LEFT = "left";
    Player.RIGHT = "right";
    Player.ENTER = "enter";

    /** @event */
    Player.LAID_BOMB = "laidBomb";

    Dyna.model.Player = Player;

})(window.Dyna);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function BombView(jContainer, bomb) {
        this.jContainer = jQuery(jContainer);
        this.bomb = bomb;
        this.initialise();
    }

    BombView.prototype.bomb = null;
    BombView.prototype.jBomb = null;

    BombView.prototype.initialise = function() {
        this.bomb.on(Dyna.model.Bomb.EXPLODE, this.showExplosion.bind(this));
        this.jBomb = jQuery("<div class='ticking bomb'></div>")
                .css("left", Dyna.ui.LevelView.tileSize * this.bomb.x)
                .css("top", Dyna.ui.LevelView.tileSize * this.bomb.y)
                .appendTo(this.jContainer);
    };

    BombView.prototype.showExplosion = function() {
        this.jBomb.removeClass("ticking").addClass("exploded" + (parseInt(Math.random() * 3) + 1));
    };

    Dyna.ui.BombView = BombView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     */
    function CanvasView(jContainer) {
        this.ctx = this.createContext(jQuery(jContainer));
    }

    /**
     * The container of the explosion element
     * @private
     * @type {jQuery}
     */
    CanvasView.prototype.jContainer = null;

    /**
     * The canvas context
     * @private
     * @type {CanvasRenderingContext2D}
     */
    CanvasView.prototype.ctx = null;

    /**
     * A list of the animations
     * @type {Object[]}
     */
    CanvasView.prototype.animations = null;

    /**
     * The current id for the next animation frame
     * @param {Number}
            */
    CanvasView.prototype.animationId = null;

    CanvasView.prototype.createContext = function(jContainer) {
        this.jContainer = jQuery("<canvas></canvas>").addClass(this.className)
                .attr("width", jContainer.width())
                .attr("height", jContainer.width())
                .appendTo(jContainer);
        return this.jContainer[0].getContext("2d");
    };

    /**
     * Performs the animation loop
     */
    CanvasView.prototype.animate = function() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.render();
    };

    CanvasView.prototype.render = function() {
        var ctx = this.ctx, i,
                animations = this.animations,
                numAnimations = animations.length,
                now = +new Date();
        this.clear();
        for (i = 0; i < numAnimations; i++) {
            animations[i].render(ctx, now);
        }
    };

    /**
     * Wipes the entire context
     */
    CanvasView.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.jContainer.width(), this.jContainer.height());
    };

    /**
     * Removes the explosion element from the page
     */
    CanvasView.prototype.destroy = function() {
        cancelAnimationFrame(this.animationId);
        this.jContainer.remove();
    };

    Dyna.ui.CanvasView = CanvasView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container (".menuContainer")
     * @param {Dyna.app.Game} game The game model object
     * @param {Function} menuControlFactory A factory function to return a menu control set up with key mappings
     */
    function GameOverView(jContainer, game, menuControlFactory) {
        this.jContainer = jQuery(jContainer);
        this.game = game;
        this.menuControlFactory = menuControlFactory;
        this.initialise();
    }

    /**
     * Reference to the game object
     * @private
     * @type {Dyna.app.Game}
     */
    GameOverView.prototype.game = null;

    /**
     * Starts listening for the game over message
     * @private
     */
    GameOverView.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on("gameover", this.showGameOverMessage.bind(this));
    };

    /**
     * Shows a game over message
     * @private
     */
    GameOverView.prototype.showGameOverMessage = function() {

        this.jContainer.removeClass("hidden");
        this.jContainer.find("h2").text("Game Over");

        this.menuControlFactory()
            .withItem("Play Again?", this.onPlayAgainPressed.bind(this))
            .showOn(this.jContainer.find("ul"));

    };

    /**
     * Handles the user wanting to play again
     */
    GameOverView.prototype.onPlayAgainPressed = function() {
        // for now, just refresh the window
        window.location.reload();
    };

    Dyna.ui.GameOverView = GameOverView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function LevelView(jContainer, level, mapViewFactory, lifeformViewFactory, bombViewFactory, explosionViewFactory) {
        log("Creating LevelView for  " + level.name);

        this.jContainer = jQuery(jContainer);
        this.level = level;

        this.lifeformViewFactory = lifeformViewFactory;
        this.lifeformViews = [];

        this.mapViewFactory = mapViewFactory;
        this.mapView = null;

        this.bombViewFactory = bombViewFactory;
        this.explosionViewFactory = explosionViewFactory;

        this.initialise();
    }

    LevelView.prototype.jContainer = null;
    LevelView.prototype.level = null;

    LevelView.prototype.lifeformViewFactory = null;
    LevelView.prototype.lifeformViews = null;

    LevelView.prototype.mapViewFactory = null;
    LevelView.prototype.mapView = null;

    LevelView.prototype.bombViewFactory = null;
    LevelView.prototype.explosionViewFactory = null;

    LevelView.prototype.initialise = function() {
        log("Initialising level view");

        this.level.on(Dyna.model.Level.LIFEFORM_ADDED, this._createViewForLifeForm.bind(this));
        this.level.on(Dyna.model.Level.BOMB_ADDED, this._handleBombLaid.bind(this));
        this.level.on(Dyna.model.Level.LEVEL_UP, this._handlePlayerLevelUp.bind(this));

        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this._handleExplosion.bind(this));

        this.mapView = this.mapViewFactory(this.level.map)
    };

    LevelView.prototype._handleBombLaid = function(bomb) {
        this.bombViewFactory(bomb);
    };

    LevelView.prototype._handleExplosion = function(explosion) {
        this.explosionViewFactory(explosion);
        this.mapView.updateAll(this.level);
    };

    LevelView.prototype._handlePlayerLevelUp = function(player) {
        Dyna.util.Sound.play(Dyna.util.Sound.POWERUP);
        this.mapView.updateAll(this.level);
    };

    LevelView.prototype._createViewForLifeForm = function(lifeform) {
        this.lifeformViews.push(this.lifeformViewFactory(lifeform))
    };

    LevelView.prototype.updateAll = function() {
        this.mapView.updateAll(this.level);
        for (var i = 0; i < this.lifeformViews.length; i++) {
            this.lifeformViews[i].updateAll();
        }
    };

    LevelView.tileSize = 50;

    Dyna.ui.LevelView = LevelView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {
        this.jContainer = jQuery(jContainer);
        this.map = map;
        this.initialise();
    }

    MapView.prototype.map = null;
    MapView.prototype.jContainer = null;
    MapView.prototype.tileTemplate = null;

    MapView.prototype.initialise = function() {

        log("Initialising map view");
        this.initialiseMap();

        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.updateAll.bind(this));

    };

    MapView.prototype.initialiseMap = function() {
        this.jContainer.parent()
                .css("width", Dyna.ui.LevelView.tileSize * this.map.width)
                .css("height", Dyna.ui.LevelView.tileSize * this.map.height);
        this.tileTemplate = jQuery("<div class='tile'></div>");
    };

    MapView.prototype.getTile = function(className, x, y) {
        return this.tileTemplate.clone()
                .addClass(className)
                .css("left", x * Dyna.ui.LevelView.tileSize)
                .css("top", y * Dyna.ui.LevelView.tileSize)
    };

    MapView.prototype.updateAll = function() {

        var newContents = document.createDocumentFragment();

        newContents.appendChild(
                this.getTile("wall-corner", -0.5, -0.5)[0]
                );

        for (x = 0; x < this.map.width; x++) {

            newContents.appendChild(
                    this.getTile("wall-horizontal", x, -0.5)[0]
                    );
        }

        newContents.appendChild(
                this.getTile("wall-corner", this.map.width, -0.5)[0]
                );

        for (var y = 0; y < this.map.height; y++) {
            for (var x = 0; x < this.map.width; x++) {
                newContents.appendChild(
                        this.getTile(this.map.tileAt(x, y).type, x, y)[0]
                        );
            }

            newContents.appendChild(
                    this.getTile("wall-vertical", -0.5, y)[0]
                    );

            newContents.appendChild(
                    this.getTile("wall-vertical", this.map.width, y)[0]
                    );

        }

        newContents.appendChild(
                this.getTile("wall-corner", -0.5, this.map.height)[0]
                );

        for (x = 0; x < this.map.width; x++) {

            newContents.appendChild(
                    this.getTile("wall-horizontal", x, this.map.height)[0]
                    );

        }

        newContents.appendChild(
                this.getTile("wall-corner", this.map.width, this.map.height)[0]
                );

        this.jContainer.empty().append(newContents);

    };

    Dyna.ui.MapView = MapView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * @constructor
     */
    function PlayerView(jContainer, player) {
        log("Creating player view for  " + player.name);
        this.jContainer = jQuery(jContainer);
        this.player = player;
        this.initialise();
    }

    PlayerView.prototype.player = null;
    PlayerView.prototype.jPlayer = null;
    PlayerView.prototype.currentDirection = null;

    PlayerView.prototype.initialise = function() {
        this.player.on(Dyna.model.Lifeform.MOVED, this.updateAll.bind(this));
        this.player.on(Dyna.model.Lifeform.DIRECTION_CHANGED, this.changeDirection.bind(this));
        this.player.on(Dyna.model.Lifeform.DIED, this.handlePlayerDied.bind(this));
        this.jPlayer = jQuery("<div class='player'></div>").addClass(this.player.skin).appendTo(this.jContainer);

        jQuery("<div class='nameBadge'></div>")
                .text(this.player.name)
                .appendTo(this.jPlayer);

        jQuery("<div class='avatar'></div>")
                .appendTo(this.jPlayer);

    };

    PlayerView.prototype.handlePlayerDied = function() {
        Dyna.util.Sound.play(Dyna.util.Sound.DIE);
        this.jPlayer.addClass("dead");
    };

    PlayerView.prototype.changeDirection = function(direction) {

        if (this.currentDirection || this.currentDirection != direction) {
            this.jPlayer.removeClass(this.currentDirection);
        }

        this.jPlayer.addClass(direction);
        this.currentDirection = direction;

    };

    PlayerView.prototype.updateAll = function() {
        this.jPlayer
                .css("left", Dyna.ui.LevelView.tileSize * this.player.x)
                .css("top", Dyna.ui.LevelView.tileSize * this.player.y);
    };

    Dyna.ui.PlayerView = PlayerView;

})(window.Dyna, jQuery);(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Lifeform} player The life form to control
     */
    function BasicController(player) {
        this.player = player;
        this.initialiseEvents();
    }

    /**
     * The player to control
     * @protected
     * @type {Dyna.model.Player}
     */
    BasicController.prototype.player = null;

    /**
     * @private
     * Stops control when the player dies or when the game ends
     */
    BasicController.prototype.initialiseEvents = function() {
        this.player.on(Dyna.model.Lifeform.DIED, this.stopControlling.bind(this));
        Dyna.app.GlobalEvents.on("gameover", this.stopControlling.bind(this));
    };

    /**
     * Stops the computer controller from affecting the player
     */
    BasicController.prototype.stopControlling = function() {
        log("Controller should stop controlling here")
    };

    Dyna.app.BasicController = BasicController;

})(window.Dyna);(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Player} player The player to control
     * @param {Dyna.model.Level} level Provides access to the positions of other players
     * @param {Dyna.model.Map} map Allows the controller to navigate around the map
     * @param {Dyna.ai.DestinationChooser} destinationChooser Makes decisions about where to go
     * @param {Dyna.ai.Bomber} bomber Decides when to lay bombs
     * @param {Dyna.ai.Walker} bomber Decides when to take a step
     */
    function ComputerController(player, level, map, destinationChooser, bomber, walker) {
        ComputerController.superclass.constructor.call(this, player);
        this.level = level;
        this.map = map;
        this.destinationChooser = destinationChooser;
        this.bomber = bomber;
        this.walker = walker;
        this.initialiseAnimation();
    }

    Object.extend(ComputerController, Dyna.app.BasicController);

    /**
     * Reference to the map, so the controller can explore
     * @private
     * @type {Dyna.model.Map}
     */
    ComputerController.prototype.map = null;

    /**
     * The current path that the computer is walking along
     * @private
     * @type {Object[]}
     */
    ComputerController.prototype.currentPath = null;

    /**
     * Chooses destinations from possibilities
     * @private
     * @type {Dyna.ai.DestinationChooser}
     */
    ComputerController.prototype.destinationChooser = null;

    /**
     * Decides when to lay bombs
     * @private
     * @type {Dyna.ai.Bomber}
     */
    ComputerController.prototype.bomber = null;

    /**
     * Decides when to walk
     * @private
     * @type {Dyna.ai.Walker}
     */
    ComputerController.prototype.walker = null;

    /**
     * Ensures that the controller stops operating if the player dies
     * @private
     */
    ComputerController.prototype.initialiseAnimation = function() {
        this.interval = window.setInterval(this.think.bind(this), ComputerController.SPEED);
    };

    /**
     * Consider what to do with the player next
     */
    ComputerController.prototype.think = function() {

        if (!this.currentPath) {
            this.chooseSomewhereToGo();
        }

        this.takeNextStep();

    };

    /**
     * Moves the player one step towards the destination
     */
    ComputerController.prototype.takeNextStep = function() {
        if (this.currentPath) {
            if (this.currentPath.length) {
                // todo: computer player should not be able to walk over bombs
                var nextStep = this.currentPath[0], free = this.player.layBomb || this.map.isFree(nextStep.x, nextStep.y);
                if (this.player.layBomb && this.bomber.canLayBombOnRoute(this.currentPath, this.player.x, this.player.y, this.player)) {
                    this.player.layBomb();
                }
                // todo: change course if the current path is now too dangerous or a better one has come up
                if (this.walker.shouldWalkTo(nextStep.x, nextStep.y, this.player)) {
                    if (free) {
                        this.player.move(nextStep.x, nextStep.y);
                        this.currentPath.shift();
                    } else {
                        this.currentPath = null;
                    }
                } else {
                    // freeze!
                    log("Freezing!");
                }
            } else {
                if (this.player.layBomb && this.bomber.layingBombHereIsAGoodIdea(this.player.x, this.player.y, this.map, this.player)) {
                    this.player.layBomb();
                }
                this.currentPath = null;
            }
        }
    };

    /**
     * Finds some place for the player to go to
     */
    ComputerController.prototype.chooseSomewhereToGo = function() {

        var pathFinder = new Dyna.util.PathFinder(this.map, this.player.x, this.player.y),
                potentialDestinations = pathFinder.getAvailableDestinations(),
                chosenDestination = this.destinationChooser.chooseDestinationFrom(
                        pathFinder.getAvailableDestinations(),
                        this.level,
                        this.map,
                        this.player
                        );

        if (chosenDestination) {
            this.currentPath = pathFinder.getPathTo(chosenDestination.x, chosenDestination.y);
            if (!this.currentPath) {
                log(this.player.name + " cannot get to chosen destination", this.player.x, this.player.y, chosenDestination);
            }
        } else {
            log(this.player.name + " has nowhere to go");
        }

    };

    /**
     * Stops the computer controller from affecting the player
     */
    ComputerController.prototype.stopControlling = function() {
        window.clearInterval(this.interval);
    };

    /**
     * The interval during which the computer controller takes its turns.
     * @type {Number}
     */
    ComputerController.SPEED = 500;

    Dyna.app.ComputerController = ComputerController;

})(window.Dyna);(function(Dyna) {

    function FBI(level) {
        FBI.instance = this;
        this.intelligence = {};
        this.level = level;
        this.level.on(Dyna.model.Level.BOMB_ADDED, this.handleBombThreat.bind(this));
    }

    FBI.prototype.level = null;

    /**
     * A list of all the bombs currently on the map with their projected explosions
     * @type {Object}
     */
    FBI.prototype.intelligence = null;

    FBI.prototype.handleBombThreat = function(bomb) {
        log("FBI has had a report of a bomb threat at " + bomb.id);
        this.intelligence[bomb.id] = {
            bomb: bomb,
            explosion: Dyna.model.Explosion.create(this.level.map, bomb.x, bomb.y, bomb.power)
        };
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExplosion.bind(this));
    };

    FBI.prototype.handleBombExplosion = function(x, y, power, bomb) {
        log("FBI standing down at", bomb.id);
        delete this.intelligence[bomb.id];
    };

    /**
     * Returns whether the given position is in imminent danger of being blown up by a bomb.
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    FBI.prototype.estimateDangerAt = function(x, y) {
        var bombId, intelligence;
        for (bombId in this.intelligence) {
            intelligence = this.intelligence[bombId];
            if (intelligence.bomb.at(x, y) || intelligence.explosion.affects(x, y)) {
                return 1;
            }
        }
        return 0;
    };

    /**
     * Returns whether there is a bomb at the given location
     * @param {Number} x The X coordinate
     * @param {Number} y The Y coordinate
     */
    FBI.prototype.bombAt = function(x, y) {
        var bombId, intelligence;
        for (bombId in this.intelligence) {
            intelligence = this.intelligence[bombId];
            if (intelligence.bomb.at(x, y)) {
                return true;
            }
        }
        return false;
    };

    /**
     * Static instance that can be got at any time
     * @type {Dyna.service.FBI}
     */
    FBI.instance = null;

    Dyna.service.FBI = FBI;

})(window.Dyna);/**
 * Takes care of the main game logic. Winning, losing etc.
 */
(function(Dyna) {

    /**
     * @constructor
     * @param {Dyna.model.Level} level The level
     * @param {Dyna.ui.LevelView} levelView The view for the level
     */
    function Game(level, levelView) {


        this.level = level;
        this.levelView = levelView;
        this.players = [];

        this._initialiseEvents();

    }

    /**
     * @private
     * @type {Dyna.model.Level}
     */
    Game.prototype.level = null;

    /**
     * @private
     * @type {Dyna.ui.LevelView}
     */
    Game.prototype.levelView = null;

    Game.prototype.players = null;

    Game.prototype._initialiseEvents = function() {
        this.level.on(Dyna.model.Level.ENDED, this.gameOver.bind(this));
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
    };

    Game.prototype.gameOver = function(remainingPlayers) {
        log("Game Over", remainingPlayers);
        Dyna.app.GlobalEvents.fire("gameover");
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.start = function() {
        log("Starting Dyna Game on level " + this.level.name);
        Dyna.app.GlobalEvents.fire("gamestarted");
        this.levelView.updateAll();
    };

    Dyna.app.Game = Game;

})(window.Dyna);(function(Dyna) {

    /**
     * @constructor
     * @param player The player to control
     */
    function HumanController(player) {
        HumanController.superclass.constructor.call(this, player);
    }

    Object.extend(HumanController, Dyna.app.BasicController);

    /**
     * The input method.
     * @type {Dyna.util.KeyboardInput}
     */
    HumanController.prototype.keyboardInput = null;

    /**
     * Sets up some controls to allow the player to be controlled by a human
     * @param {Dyna.util.KeyboardInput} keyboardInput The input method
     */
    HumanController.prototype.withControls = function(keyboardInput) {
        var movePlayerTo = this.movePlayerTo;
        this.keyboardInput = keyboardInput;
        keyboardInput.on(Dyna.model.Player.UP, movePlayerTo.bind(this, 0, -1));
        keyboardInput.on(Dyna.model.Player.DOWN, movePlayerTo.bind(this, 0, +1));
        keyboardInput.on(Dyna.model.Player.LEFT, movePlayerTo.bind(this, -1, 0));
        keyboardInput.on(Dyna.model.Player.RIGHT, movePlayerTo.bind(this, +1, 0));
        keyboardInput.on(Dyna.model.Player.ENTER, this.player.layBomb.bind(this.player));
        return this;
    };

    /**
     * Alerts the user that it needs to move to a given location
     * @param dx The change in X
     * @param dy The change in Y
     */
    HumanController.prototype.movePlayerTo = function(dx, dy) {
        this.player.move(this.player.x + dx, this.player.y + dy);
    };

    /**
     * Stops the input method from affecting the player
     */
    HumanController.prototype.stopControlling = function() {
        if (this.keyboardInput) {
            this.keyboardInput.unsubscribeAll();
        }
    };

    Dyna.app.HumanController = HumanController;

})(window.Dyna);(function(Dyna) {

    function Bomber() {
    }

    /**
     * Determines whether laying another bomb will cause more harm than good.
     * For the sake of simplicity, at the moment this returns false if the player
     * has already laid one bomb. Otherwise the player tends to make silly decisions
     * resulting in lethal chain reactions :s
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    Bomber.prototype.layingBombHereIsAGoodIdea = function(x, y, map, me) {

        // don't lay more than one bomb at once
        if (me.bombsLaid > 0) {
            return false;
            // todo: return true if laying the second bomb won't hurt me
        }

        // todo: false if it would destroy a powerup

        var possibleExplosion = Dyna.model.Explosion.create(map, x, y, me.power);
        return possibleExplosion.blocksAffected > 0;
        // todo: include check to see if enemies might killed

    };

    /**
     * Decides whether a bomb can be laid on route
     * @param {Object[]} route The remaining route
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Player} me The player who is me
     */
    Bomber.prototype.canLayBombOnRoute = function(route, x, y, me) {
        // todo: clever logic needed
        return false
    };

    Dyna.ai.Bomber = Bomber;

})(window.Dyna);(function(Dyna) {

    function DestinationChooser(weights) {
        this.weights = weights;
    }

    /**
     * A map which determines which functions (see end of class) should have what weights.
     * This is used in destination choosing to create a score for each of the possible destinations.
     */
    DestinationChooser.prototype.weights = null;

    /**
     * Chooses a destination to travel to from a list of potential destinations
     * @param {Object[]} potentialDestinations The list of destinations
     * @param {Dyna.model.Level} level
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.chooseDestinationFrom = function(potentialDestinations, level, map, me) {

        var maxScore = -1000, destination, chosenDestination;

        for (var i = 0; i < potentialDestinations.length; i++) {

            destination = potentialDestinations[i];
            destination.score = this.getScoreForDestination(destination.x, destination.y, level, map, me);

            if (destination.score > maxScore) {
                maxScore = destination.score;
                chosenDestination = destination;
            }

        }

        return chosenDestination;
    };

    /**
     * Calculates a score for a destination based on a number of metrics including whether
     * laying a bomb in that location would break walls, whether it is close to another player
     * whether it is a powerup. Negative points are awarded for being especially dangerous etc.
     * The higher the score returned, the better prospect the destination is.
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Level} level
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.getScoreForDestination = function(x, y, level, map, me) {

        // todo: allow the decisions made here to be more fuzzy
        // todo: favour destinations which turn the user away from the explosion as soon as possible
        // todo: fewer points for being close to monsters
        var score = 0, key, weight;

        for (key in this.weights) {
            weight = this.weights[key];
            score += this[key](x, y, level, map, me) * weight;
        }

        return score;

    };

    /**
     * Returns the distance to the closest player who isn't me. This distance
     * is expressed as a percentage, so if the closest player is as far as possible away
     * the function would return 1. If the closest player is right next to the position
     * the function will return 0.
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Map} map
     * @param {Dyna.model.Player[]} players All the players on the level
     * @param {Dyna.model.Player} me The player who is me
     */
    DestinationChooser.prototype.getDistanceToClosestPlayer = function(x, y, map, players, me) {
        var minDistance = map.maxDistance, player, i;
        for (i = 0; i < players.length; i++) {
            player = players[i];
            if (player !== me) {
                var distance = player.distanceTo(x, y);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        return minDistance / map.maxDistance;
    };

    DestinationChooser.prototype.BREAK_WALLS = function(x, y, level, map, me) {
        var possibleExplosion = Dyna.model.Explosion.create(map, x, y, me.power);
        return possibleExplosion.blocksAffected;
    };

    DestinationChooser.prototype.IS_POWER_UP = function(x, y, level, map, me) {
        return map.isPowerUp(x, y) ? 1 : 0;
    };

    DestinationChooser.prototype.CLOSE_TO_OTHER_PLAYERS = function(x, y, level, map, me) {
        return 1 - this.getDistanceToClosestPlayer(x, y, map, level.players, me);
    };

    DestinationChooser.prototype.SAME_AS_CURRENT_POSITION = function(x, y, level, map, me) {
        return (x == me.x && y == me.y) ? 1 : 0;
    };

    DestinationChooser.prototype.IN_DANGER_OF_EXPLOSION = function(x, y, level, map, me) {
        return Dyna.service.FBI.instance.estimateDangerAt(x, y) ? 1 : 0;
    };

    DestinationChooser.prototype.RANDOM = function(x, y, level, map, me) {
        return Math.random();
    };

    Dyna.ai.DestinationChooser = DestinationChooser;

})(window.Dyna);(function(Dyna) {

    function Walker(fbi) {
        this.fbi = fbi
    }

    /**
     * Reference to the FBI
     * @type {Dyna.service.FBI}
     */
    Walker.prototype.fbi = null;

    /**
     *
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Dyna.model.Player} me The player who is me
     */
    Walker.prototype.shouldWalkTo = function(x, y, me) {
       return !this.fbi.estimateDangerAt(x, y) || this.fbi.estimateDangerAt(me.x, me.y);
    };

    Dyna.ai.Walker = Walker;

})(window.Dyna);(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {Dyna.util.KeyboardInput} keyboardInput Keyboard input mappings
     */
    function MenuControl(keyboardInput) {
        this.items = [];
        keyboardInput.on(MenuControl.UP, this.moveSelection.bind(this, MenuControl.UP));
        keyboardInput.on(MenuControl.DOWN, this.moveSelection.bind(this, MenuControl.DOWN));
        keyboardInput.on(MenuControl.SELECT, this.chooseSelection.bind(this));
    }

    /**
     * The menu container
     * @private
     * @type {jQuery}
     */
    MenuControl.prototype.jMenu = null;

    /**
     * A list of items to display
     * @private
     * @type {Object[]}
     */
    MenuControl.prototype.items = null;

    /**
     * Adds a new item to the menu control
     * @param {String} text The name of the menu item
     * @param {Function} callback A function to call when the item is selected
     * @returns This, for chaining
     */
    MenuControl.prototype.withItem = function(text, callback) {
        this.items.push({
            text: text,
            callback: callback
        });
        return this;
    };

    /**
     * Moves the selection back or forth
     * @param {Dyna.ui.MenuControl.UP|Dyna.ui.MenuControl.DOWN} dir The menu control direction
     */
    MenuControl.prototype.moveSelection = function(dir) {
        var selected = this.jMenu.find(".selected").removeClass("selected"),
            next = dir.getNext(selected);

        if (!next.length) {
            next = dir.getFirst(this.jMenu.find("li"));
        }

        next.addClass("selected");
    };

    /**
     * Triggers a click on the selected item
     */
    MenuControl.prototype.chooseSelection = function() {
        Dyna.util.Sound.play(Dyna.util.Sound.SELECT);
        this.jMenu.find(".selected").click();
    };

    /**
     * Displays all the items on the menu control
     */
    MenuControl.prototype.showOn = function(jMenu) {
        this.jMenu = jMenu;
        var i, numItems, item;
        this.jMenu.empty();
        for (i = 0,numItems = this.items.length; i < numItems; i++) {
            item = this.items[i];
            if (!this.selectedItem) {
                this.selectedItem = item;
            }
            jMenu.append(MenuControl.createMenuItem(item.text, item.callback, item === this.selectedItem));
        }
        return this;
    };

    /**
     * Creates a menu item
     * @param {String} text The item text
     * @param {Function} callback A function to call when the item is selected
     * @param {Boolean} selected Whether the item is selected
     */
    MenuControl.createMenuItem = function(text, callback, selected) {
        return jQuery("<li></li>").text(text).click(callback).toggleClass("selected", selected);
    };

    /**
     * When the user goes up a selection
     * @static
     */
    MenuControl.UP = {
        getNext: function(item) {
            return item.prev();
        },
        getFirst: function(items) {
            return items.last();
        }
    };

    /**
     * When the user moves the selection down
     * @static
     */
    MenuControl.DOWN = {
        getNext: function(item) {
            return item.next();
        },
        getFirst: function(items) {
            return items.first();
        }
    };

    /**
     * When the user chooses the selected item
     * @static
     */
    MenuControl.SELECT = "select";

    Dyna.ui.MenuControl = MenuControl;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Explosion} explosion The explosion model object
     */
    function CanvasExplosionView(jContainer, explosion) {
        CanvasExplosionView.superclass.constructor.call(this, jContainer);
        this.animations = this.createExplosion(explosion);
        this.animate();
        Dyna.util.Timer.setTimeout(this.destroy.bind(this), CanvasExplosionView.DURATION * 5);
        Dyna.util.Sound.play(Dyna.util.Sound.EXPLOSION);
    }

    Object.extend(CanvasExplosionView, Dyna.ui.CanvasView);

    CanvasExplosionView.prototype.className = "explosion";

    CanvasExplosionView.prototype.createExplosion = function(explosion) {
        var i, tile, animations = [], tileSize = Dyna.ui.LevelView.tileSize, cx, cy, start = +new Date(), delay;

        cx = (explosion.x + 0.5) * tileSize;
        cy = (explosion.y + 0.5) * tileSize;
        var expansionFn = Math.getGaussianFunction(0.33);

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 20, 20, tileSize, "#E83C0A", start)
                        .withExpansionFn(expansionFn)
                        .withOpacityFn(function() {
                    return 0.5
                })
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 15, 15, tileSize - 5, "#F7EC64", start)
                        .withExpansionFn(expansionFn)
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 5, 5, tileSize - 10, "#FFFFFF", start)
                        .withExpansionFn(expansionFn)
                );

        animations.push(
                new Dyna.ui.Fireball(cx, cy, explosion, 15, 15, tileSize - 5, "rgba(0, 0, 0, 0)", start + 500)
                        .withOpacityFn(Math.getGaussianFunction(0.33))
                        .withDuration(1500)
                        .withShadow(20, '#000000')
                );

        for (i = 0; i < 25; i++) {
            animations.push(new Dyna.ui.Shrapnel(cx, cy, tileSize / 2));
        }

        return animations;
    };

    /**
     * Removes the explosion element from the page
     */
    CanvasExplosionView.prototype.destroy = function() {
        cancelAnimationFrame(this.animationId);
        this.jContainer.remove();
    };

    /**
     * The amount of time (in ms) that the view will live for.
     * @type {Number}
     */
    CanvasExplosionView.DURATION = 500;

    Dyna.ui.CanvasExplosionView = CanvasExplosionView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    var tileSize = Dyna.ui.LevelView.tileSize, blockHeight = 10, wallWidth = 25;

    /**
     * @constructor
     * @param {jQuery} jContainer The container into which the fireballs should be placed
     * @param {Dyna.model.Map} map The map object
     */
    function CanvasMapView(jContainer, map) {
        CanvasMapView.superclass.constructor.call(this, jContainer);
        this.map = map;
        this.images = this.loadImages();
    }

    Object.extend(CanvasMapView, Dyna.ui.CanvasView);

    CanvasMapView.prototype.className = "mapCanvas";

    CanvasMapView.prototype.images = null;

    CanvasMapView.prototype.loadImages = function() {
        return {
            "earth": this.loadImage("gfx/tiles/sand.png"),
            "wall":this.loadImage("gfx/tiles/wall.png"),
            "block": this.loadImage("gfx/tiles/crate.png"),
            "powerup": this.loadImage("gfx/powerups/power.png"),
            "corner": this.loadImage("gfx/tiles/wall-corner.png"),
            "wall_horizontal": this.loadImage("gfx/tiles/wall-horizontal.png"),
            "wall_vertical": this.loadImage("gfx/tiles/wall-vertical.png")
        }
    };

    CanvasMapView.prototype.loadImage = function(src) {
        var img = new Image();
        img.src = src;
        return img;
    };

    CanvasMapView.prototype.createMapTiles = function(map) {
        var i, tile, tileSize = Dyna.ui.LevelView.tileSize, x, y, tx, ty,
                groundLayer = new Dyna.ui.Layer("ground"),
                shadowLayer = new Dyna.ui.Layer("shadow"),
                wallLayer = new Dyna.ui.Layer("wall");

        /* Draw the North Wall */
        this.horizontalWall(wallLayer, map, 0);
        this.horizontalShadow(shadowLayer, map, 0);

        ty = wallWidth;

        for (y = 0; y < map.height; y++) {

            /* Draw the West Wall */
            wallLayer.push(new Dyna.ui.Tile(0, ty, wallWidth, tileSize, this.images.wall_vertical));
            if (!map.isSolid(0, y)) {
                shadowLayer.push(new Dyna.ui.VerticalShadow(wallWidth, ty + blockHeight, tileSize));
            }

            tx = wallWidth;

            /* Draw one row of the map */
            for (x = 0; x < map.width; x++) {
                tile = map.tileAt(x, y);

                if (tile.solid) {
                    wallLayer.push(new Dyna.ui.Tile(tx, ty, tileSize, tileSize, this.images[tile.type]));
                    if (!map.isSolid(x, y + 1)) {
                        shadowLayer.push(new Dyna.ui.HorizontalShadow(tx, ty + tileSize + blockHeight, tileSize));
                    }
                    if (!map.isSolid(x + 1, y)) {
                        shadowLayer.push(new Dyna.ui.VerticalShadow(tx + tileSize, ty + blockHeight, tileSize));
                    }
                } else {
                    groundLayer.push(new Dyna.ui.Tile(tx, ty + blockHeight, tileSize, tileSize, this.images[tile.type]));
                }

                tx += tileSize;

            }

            /* Draw the east wall */
            wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + wallWidth, ty, wallWidth, tileSize, this.images.wall_vertical));

            ty += tileSize;

        }

        /* Draw the east wall shadow in one go */
        shadowLayer.push(new Dyna.ui.VerticalShadow(map.width * tileSize + wallWidth + wallWidth, blockHeight, (map.height * tileSize) + wallWidth + wallWidth));

        /* Draw the south wall */
        this.horizontalWall(wallLayer, map, (map.height * tileSize) + wallWidth);
        shadowLayer.push(new Dyna.ui.HorizontalShadow(0, (map.height * tileSize) + tileSize + blockHeight, (map.width * tileSize) + wallWidth + wallWidth));

        return [groundLayer, shadowLayer, wallLayer];
    };

    CanvasMapView.prototype.horizontalWall = function(wallLayer, map, ty) {
        wallLayer.push(new Dyna.ui.Tile(0, ty, 25, 25, this.images.corner));
        for (var x = 0; x < map.width; x++) {
            wallLayer.push(new Dyna.ui.Tile(x * tileSize + 25, ty, 50, 25, this.images.wall_horizontal));
        }
        wallLayer.push(new Dyna.ui.Tile(map.width * tileSize + 25, ty, 25, 25, this.images.corner));
    };

    CanvasMapView.prototype.horizontalShadow = function(shadowLayer, map, y) {
        var x, ty = (y * tileSize) + wallWidth + blockHeight;
        for (x = 0; x < map.width; x++) {
            if (!map.isSolid(x, y)) {
                shadowLayer.push(new Dyna.ui.HorizontalShadow(x * tileSize + wallWidth, ty, tileSize));
            }
        }
    };

    CanvasMapView.prototype.updateAll = function() {
        this.animations = this.createMapTiles(this.map);
        this.render();
    };

    Dyna.ui.CanvasMapView = CanvasMapView;

})(window.Dyna, jQuery);(function(Dyna) {

    function Fireball(x, y, explosion, innerWidth, outerWidth, tileSize, color, start) {
        this.x = x;
        this.y = y;
        this.innerWidth = innerWidth;
        this.outerWidth = outerWidth;
        this.expansionFn = Fireball.STATIC;
        this.color = color;
        var min = (tileSize * 0.5) - outerWidth;
        if (explosion.northExtent) {
            this.northPoint = (tileSize * explosion.northExtent) + min;
        }

        if (explosion.eastExtent) {
            this.eastPoint = (tileSize * explosion.eastExtent) + min;

        }
        if (explosion.southExtent) {
            this.southPoint = (tileSize * explosion.southExtent) + min;

        }
        if (explosion.westExtent) {
            this.westPoint = (tileSize * explosion.westExtent) + min;
        }

        this.start = start;
        this.opacityFn = Fireball.STATIC;
        this.shadowColor = color;
    }

    /**
     * @type {Number} The start time
     */
    Fireball.prototype.start = null;
    Fireball.prototype.x = null;
    Fireball.prototype.y = null;
    Fireball.prototype.northPoint = null;
    Fireball.prototype.southPoint = null;
    Fireball.prototype.eastPoint = null;
    Fireball.prototype.westPoint = null;
    Fireball.prototype.expansionFn = null;
    Fireball.prototype.color = null;
    Fireball.prototype.innerWidth = null;
    Fireball.prototype.outerWidth = null;
    Fireball.prototype.opacityFn = null;
    Fireball.prototype.blur = 5;
    Fireball.prototype.shadowColor = null;
    Fireball.prototype.duration = Dyna.ui.CanvasExplosionView.DURATION;

    Fireball.prototype.withOpacityFn = function(opacityFn) {
        this.opacityFn = opacityFn;
        return this;
    };

    Fireball.prototype.withExpansionFn = function(fn) {
        this.expansionFn = fn;
        return this;
    };

    Fireball.prototype.withShadow = function(blur, shadowColor) {
        this.blur = blur;
        this.shadowColor = shadowColor;
        return this;
    };

    Fireball.prototype.withDuration = function(duration) {
        this.duration = duration;
        return this;
    };

    Fireball.prototype.getTimeElapsed = function(now) {
        return (now - this.start) / this.duration;
    };

    Fireball.prototype.render = function(ctx, now) {

        if (now < this.start) {
            return;
        }

        var
                elapsed = this.getTimeElapsed(now),
                expansion = this.expansionFn(elapsed),
                innerWidth = this.innerWidth * expansion,
                outerWidth = this.outerWidth * expansion,
                furthest;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacityFn(elapsed);
        ctx.shadowBlur = this.blur;
        ctx.shadowColor = this.shadowColor;

        ctx.beginPath();

        ctx.moveTo(this.x - innerWidth, this.y - innerWidth);

        // north point
        if (this.northPoint) {
            furthest = this.y - (this.northPoint * expansion);
            ctx.lineTo(this.x - outerWidth, furthest);
            ctx.arcTo(this.x - outerWidth, furthest - outerWidth, this.x, furthest - outerWidth, outerWidth);
            ctx.arcTo(this.x + outerWidth, furthest - outerWidth, this.x + outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y - innerWidth);

        // east point
        if (this.eastPoint) {
            furthest = this.x + (this.eastPoint * expansion);
            ctx.lineTo(furthest, this.y - outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y - outerWidth, furthest + outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest + outerWidth, this.y + outerWidth, furthest, this.y + outerWidth, outerWidth);
        }
        ctx.lineTo(this.x + innerWidth, this.y + innerWidth);

        // south point
        if (this.southPoint) {
            furthest = this.y + (this.southPoint * expansion);
            ctx.lineTo(this.x + outerWidth, furthest);
            ctx.arcTo(this.x + outerWidth, furthest + outerWidth, this.x, furthest + outerWidth, outerWidth);
            ctx.arcTo(this.x - outerWidth, furthest + outerWidth, this.x - outerWidth, furthest, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y + innerWidth);

        // west point
        if (this.westPoint) {
            furthest = this.x - (this.westPoint * expansion);
            ctx.lineTo(furthest, this.y + outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y + outerWidth, furthest - outerWidth, this.y, outerWidth);
            ctx.arcTo(furthest - outerWidth, this.y - outerWidth, furthest, this.y - outerWidth, outerWidth);
        }
        ctx.lineTo(this.x - innerWidth, this.y - innerWidth);

        ctx.fill();
    };

    Fireball.STATIC = function() {
        return 1;
    };

    Dyna.ui.Fireball = Fireball;

})(Dyna);(function(Dyna) {

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

})(Dyna);(function(Dyna) {

    var dx = 10, dy = 10, color = '#000', fillStyle = 'rgba(0,0,0,0.1)';

    function HorizontalShadow(x, y, width) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y;
    }

    function VerticalShadow(x, y, height) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y + height;
    }

    VerticalShadow.prototype.render = HorizontalShadow.prototype.render = function(ctx, now) {
        var
                x1 = this.x1,
                y1 = this.y1,
                x2 = this.x2,
                y2 = this.y2;

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 10;
        ctx.fillStyle = fillStyle;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 + dx, y2 + dy);
        ctx.lineTo(x1 + dx, y1 + dy);
        ctx.lineTo(x1, y1);
        ctx.fill();

        ctx.shadowBlur = 0;
    };

    Dyna.ui.HorizontalShadow = HorizontalShadow;
    Dyna.ui.VerticalShadow = VerticalShadow;

})(Dyna);(function(Dyna) {

    function Shrapnel(cx, cy, radius) {

        var
                angle = Math.random() * (Math.PI * 2),
                r = radius + Math.random();

        this.dx = r * Math.cos(angle);
        this.dy = r * Math.sin(angle);
        this.initX = cx + this.dx;
        this.initY = cy + this.dy;
        this.start = +new Date();
    }

    Shrapnel.prototype.start = null;
    Shrapnel.prototype.initX = null;
    Shrapnel.prototype.initY = null;
    Shrapnel.prototype.dx = null;
    Shrapnel.prototype.dy = null;
    Shrapnel.prototype.speed =3;

    Shrapnel.prototype.render = function(ctx, now) {

        var
                elapsed = ((now - this.start) / 1000) * this.speed,
                currentX = this.initX + (elapsed * this.dx),
                currentY = this.initY + (elapsed * this.dy);

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000';
        ctx.fillRect(currentX, currentY, 3, 3);

    };

    Dyna.ui.Shrapnel = Shrapnel;

})(Dyna);(function(Dyna) {

    function Tile(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    Tile.prototype.render = function(ctx, now) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(this.image, this.x, this.y);
    };

    Dyna.ui.Tile = Tile;

})(Dyna);(function(Dyna) {

    function init() {

        log("Initialising DynaJS");

        Dyna.app.GlobalEvents = new Dyna.events.CustomEvent();

        var Player = Dyna.model.Player;

        Dyna.util.Timer.initialise();

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
                    return new Dyna.ui.CanvasMapView("#level .map", map)
                },
                lifeformViewFactory = function(lifeform) {
                    return new Dyna.ui.PlayerView("#level .players", lifeform)
                },
                bombViewFactory = function(bomb) {
                    return new Dyna.ui.BombView("#level .players", bomb)
                },
                explosionViewFactory = function(explosion) {
                    return new Dyna.ui.CanvasExplosionView("#level", explosion)
                },
                levelView = new Dyna.ui.LevelView("#level", level, mapViewFactory, lifeformViewFactory, bombViewFactory, explosionViewFactory);

        // controls
        var
                MenuControl = Dyna.ui.MenuControl,
                menuControlFactory = function() {
                    return new MenuControl(new Dyna.util.KeyboardInput(keyboard, {
                        "up" : MenuControl.UP,
                        "down" : MenuControl.DOWN,
                        "enter" : MenuControl.SELECT
                    }));
                };

        // controller
        var
                game = new Dyna.app.Game(level, levelView),
                gameoverView = new Dyna.ui.GameOverView(".menuContainer", game, menuControlFactory),
                player1 = new Player("Computer 1", "redplayer"),
                player2 = new Player("Player 2", "blueplayer"),
                monster1 = new Dyna.model.Lifeform("Mushtopus", "mushtopus"),
                monster2 = new Dyna.model.Lifeform("Lizardcat", "lizardcat"),
                playerDestinationChooser = new Dyna.ai.DestinationChooser({
                    "BREAK_WALLS" : 1,
                    "IS_POWER_UP" : 10,
                    "CLOSE_TO_OTHER_PLAYERS" : 2,
                    "SAME_AS_CURRENT_POSITION": -2,
                    "IN_DANGER_OF_EXPLOSION": -20
                }),
                dumbDestinationChooser = new Dyna.ai.DestinationChooser({
                    "SAME_AS_CURRENT_POSITION": -2,
                    "RANDOM": 1
                }),
                monsterDestinationChooser = new Dyna.ai.DestinationChooser({
                    "CLOSE_TO_OTHER_PLAYERS" : 2,
                    "SAME_AS_CURRENT_POSITION": -2,
                    "IN_DANGER_OF_EXPLOSION": -20
                }),
                bomber = new Dyna.ai.Bomber(),
                walker = new Dyna.ai.Walker(fbi),
                aiController1 = new Dyna.app.ComputerController(player1, level, map, playerDestinationChooser, bomber, walker),
                aiController2 = new Dyna.app.ComputerController(monster1, level, map, monsterDestinationChooser, bomber, walker),
                aiController3 = new Dyna.app.ComputerController(monster2, level, map, dumbDestinationChooser, bomber, walker),
                humanController1 = new Dyna.app.HumanController(player2).withControls(
                        new Dyna.util.KeyboardInput(keyboard, {
                            "up" : Player.UP,
                            "down" : Player.DOWN,
                            "left" : Player.LEFT,
                            "right" : Player.RIGHT,
                            "enter" : Player.ENTER
                        }));

        level.addPlayer(player1);
        level.addPlayer(player2);
        level.addMonster(monster1);
        level.addMonster(monster2);

        game.start();

    }

    jQuery(document).ready(init);

})(window.Dyna);