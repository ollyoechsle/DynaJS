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
    console && console.log(arguments);
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
        var event = this.actions[key];
        event && this.fire(event);
    };

    Dyna.app.KeyboardInput = KeyboardInput;

})(window.Dyna);(function(Dyna) {

    /**
     * Constructor
     */
    function Bomb(x, y, power) {

        this.superclass.constructor.call(this);
        log("Creating bomb");
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.power = power;

        this.startTicking();

    }

    Object.extend(Bomb, Dyna.events.CustomEvent);

    Bomb.prototype.x = null;
    Bomb.prototype.y = null;
    Bomb.prototype.exploded = false;
    Bomb.prototype.power = 0;
    Bomb.prototype.timer = null;

    Bomb.prototype.startTicking = function() {
        this.timer = window.setTimeout(this.explode.bind(this), 3 * 1000);
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.triggerChainReaction.bind(this))
    };

    Bomb.prototype.triggerChainReaction = function(explosion) {
        if (explosion.affects(this.x, this.y) && this.timer) {
            window.clearTimeout(this.timer);
            window.setTimeout(this.explode.bind(this), 300);
            this.explode();
        }
    };

    Bomb.prototype.explode = function() {
        this.timer = null;
        this.exploded = true;
        this.fire(Bomb.EXPLODE, this.x, this.y, this.power);
    };

    /** @event */
    Bomb.EXPLODE = "explode";

    Dyna.model.Bomb = Bomb;

})(window.Dyna);(function(Dyna) {

    function Explosion() {
        log("Creating explosion");
        this.tilesAffected = [];
    }

    Explosion.prototype.tilesAffected = null;

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
        log("Creating explosion", x, y, power);
        var explosion = new Explosion();

        for (var key in directions) {
            var direction = directions[key];

            for (var i = 0; i <= power; i++) {
                var mx = x + (direction.x * i);
                var my = y + (direction.y * i);
                var tile = map.tileAt(mx, my);
                if (tile && tile != Dyna.model.Map.WALL) {
                    explosion.addAffectedTile(mx, my);
                    if (tile.solid) {
                        break;
                    }
                } else {
                    break;
                }
            }

        }

        return explosion;

    };

    var directions = {
        "east": {x: -1, y: 0},
        "west": {x: +1, y: 0},
        "north": {x: 0, y: -1},
        "south": {x: 0, y: +1}
    };

    Dyna.model.Explosion = Explosion;

})(window.Dyna);(function(Dyna) {

    /**
     * Constructor
     */
    function Level(name, map) {

        this.superclass.constructor.call(this);

        log("Creating level " + name);
        this.map = map;
        this.players = [];

    }

    Object.extend(Level, Dyna.events.CustomEvent);

    Level.prototype.map = null;
    Level.prototype.players = [];

    Level.prototype.addPlayer = function(player) {
        if (this.map.findPositionFor(player)) {
            this.players.push(player);
            player.on(Dyna.model.Player.WANTS_TO_MOVE, this.handlePlayerMove.bind(this));
            player.on(Dyna.model.Player.LAID_BOMB, this.handleBombAdded.bind(this));
            this.fire(Level.PLAYER_ADDED, player);
        } else {
            log("No room for this player on the map");
        }
    };

    Level.prototype.handleBombAdded = function(bomb) {
        this.fire(Level.BOMB_ADDED, bomb);
        bomb.on(Dyna.model.Bomb.EXPLODE, this.handleBombExploded.bind(this));
    };

    Level.prototype.handleBombExploded = function(x, y, power) {

        var explosion = Dyna.model.Explosion.create(this.map, x, y, power);

        for (var i = 0; i < explosion.tilesAffected.length; i++) {
            var tile = explosion.tilesAffected[i];
            this.map.destroy(tile.x, tile.y);
        }

        Dyna.app.GlobalEvents.fire(Level.EXPLOSION, explosion);

    };

    Level.prototype.handlePlayerMove = function(player, x, y) {
        if (this.map.isFree(x, y)) {
            player.moveTo(x, y);
            if (this.map.steppedOnLevelUp(x, y)) {
                log("Level up");
                this.fire(Level.LEVEL_UP, player);
                player.powerUp();
            } else {
                log("Didn't level up");
            }
        }
    };

    /** @event */
    Level.PLAYER_ADDED = "playerAdded";

    /** @event */
    Level.BOMB_ADDED = "bombAdded";

    /** @event */
    Level.EXPLOSION = "bombExploded";

    /** @event */
    Level.LEVEL_UP = "levelUp";

    Dyna.model.Level = Level;

})(window.Dyna);(function(Dyna) {

    function Map(width, height) {
        this.width = width;
        this.height = height;
        this.playerPositions = [];
        this._createMap();
    }

    Map.prototype.width = null;
    Map.prototype.height = null;
    Map.prototype.data = null;
    Map.prototype.playerPositions = null;

    Map.prototype._createMap = function() {
        var data = [], row, x, y;

        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
                if (x % 2 == 1 && y % 2 == 1) {
                    row.push(Map.WALL);
                } else {
                    if (Math.random() < 0.75) {
                        if (Math.random() < 0.1) {
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

        this.data = data;
    };

    Map.prototype.clearSpaceAround = function(x, y) {
        this.data[x][y] = Map.EARTH;
        if (y < this.height - 1) this.data[x][y + 1] = Map.EARTH;
        if (y > 0) this.data[x][y - 1] = Map.EARTH;
        if (x > 0) this.data[x - 1][y] = Map.EARTH;
        if (x < this.width - 1) this.data[x + 1][y] = Map.EARTH;
    };

    Map.prototype.findPositionFor = function(player) {
        var position = this.playerPositions.shift();
        if (position) {
            player.x = position.x;
            player.y = position.y;
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

    Map.prototype.isFree = function(x, y) {
        var tile = this.tileAt(x, y);
        return tile && !tile.solid;
    };

    Map.prototype.steppedOnLevelUp = function(x, y) {
        var tile = this.tileAt(x, y);
        if (tile && tile == Map.POWERUP) {
            log("Level up");
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
     * Constructor
     */
    function Player(name) {

        this.superclass.constructor.call(this);
        log("Creating player " + name);
        this.name = name;
        this.bombsLaid = 0;
        this.bombsAvailable = 2;
        this.initialise();
    }

    Object.extend(Player, Dyna.events.CustomEvent);

    Player.prototype.name = null;
    Player.prototype.x = null;
    Player.prototype.y = null;
    Player.prototype.bombsLaid = 0;
    Player.prototype.power = 1;
    Player.prototype.bombsAvailable = 0;
    Player.prototype.keyboardInput = null;

    Player.prototype.initialise = function() {
        Dyna.app.GlobalEvents.on(Dyna.model.Level.EXPLOSION, this.possiblyGetBlownUp.bind(this));
    };

    Player.prototype.possiblyGetBlownUp = function(explosion) {
        if (explosion.affects(this.x, this.y)) {
            this.die();
        }
    };

    Player.prototype.withControls = function(keyboardInput) {
        this.keyboardInput = keyboardInput;
        keyboardInput.on(Player.UP, this.move.bind(this, 0, -1, 'north'));
        keyboardInput.on(Player.DOWN, this.move.bind(this, 0, +1, 'south'));
        keyboardInput.on(Player.LEFT, this.move.bind(this, -1, 0, 'west'));
        keyboardInput.on(Player.RIGHT, this.move.bind(this, +1, 0, 'east'));
        keyboardInput.on(Player.ENTER, this.layBomb.bind(this));
        return this;
    };

    Player.prototype.powerUp = function() {
        this.power++;
    };

    Player.prototype.move = function(dx, dy, direction) {
        this.fire(Player.WANTS_TO_MOVE, this, this.x + dx, this.y + dy);
        this.fire(Player.DIRECTION_CHANGED, direction);
    };

    Player.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.fire(Player.MOVED);
    };

    Player.prototype.layBomb = function() {

        log("Laying bomb");
        if (this.bombsLaid < this.bombsAvailable) {
            var bomb = new Dyna.model.Bomb(this.x, this.y, this.power);
            this.bombsLaid++;
            bomb.on(Dyna.model.Bomb.EXPLODE, this._handleMyBombExploded.bind(this));
            this.fire(Player.LAID_BOMB, bomb);
        }

    };

    Player.prototype.die = function() {
        this.keyboardInput.unsubscribeAll();
        this.fire(Player.DIED);
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
    Player.MOVED = "moved";

    /** @event */
    Player.DIRECTION_CHANGED = "directionChanged";

    /** @event */
    Player.WANTS_TO_MOVE = "wantsToMove";

    /** @event */
    Player.LAID_BOMB = "laidBomb";

    /** @event */
    Player.DIED = "died";

    Dyna.model.Player = Player;

})(window.Dyna);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function BombView(jContainer, bomb) {
        log("Creating bomb view");
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
     * Constructor
     */
    function ExplosionView(jContainer, explosion, map) {
        this.jContainer = jQuery(jContainer);
        this.explosion = explosion;
        this.map = map;
        this.initialise();
    }

    ExplosionView.prototype.map = null;
    ExplosionView.prototype.explosion = null;
    ExplosionView.prototype.jContainer = null;
    ExplosionView.prototype.jExplosion = null;

    ExplosionView.prototype.initialise = function() {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < this.explosion.tilesAffected.length; i++) {
            var tile = this.explosion.tilesAffected[i];
            if (this.map.inBounds(tile.x, tile.y)) {
                fragment.appendChild(jQuery("<div class='fireBall'></div>")
                        .css("left", tile.x * Dyna.ui.LevelView.tileSize)
                        .css("top", tile.y * Dyna.ui.LevelView.tileSize)
                        [0]);
            }
        }
        this.jContainer.append(fragment);
        this.boom();
    };

    ExplosionView.prototype.boom = function() {
        var snd = new Audio("snd/explosion.wav");
        snd.play();
    };

    Dyna.ui.ExplosionView = ExplosionView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function LevelView(jContainer, level, mapViewFactory, playerViewFactory, bombViewFactory, explosionViewFactory) {
        log("Creating LevelView for  " + level.name);

        this.jContainer = jQuery(jContainer);
        this.level = level;

        this.playerViewFactory = playerViewFactory;
        this.playerViews = [];

        this.mapViewFactory = mapViewFactory;
        this.mapView = null;

        this.bombViewFactory = bombViewFactory;
        this.explosionViewFactory = explosionViewFactory;

        this.initialise();
    }

    LevelView.prototype.jContainer = null;
    LevelView.prototype.level = null;

    LevelView.prototype.playerViewFactory = null;
    LevelView.prototype.playerViews = null;

    LevelView.prototype.mapViewFactory = null;
    LevelView.prototype.mapView = null;

    LevelView.prototype.bombViewFactory = null;
    LevelView.prototype.explosionViewFactory = null;

    LevelView.prototype.initialise = function() {
        log("Initialising level view");
        LevelView.tileSize = 30;
        this.level.on(Dyna.model.Level.PLAYER_ADDED, this._createPlayerView.bind(this));
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
    };

    LevelView.prototype._handlePlayerLevelUp = function(player) {
        var snd = new Audio("snd/powerup.wav");
        snd.play();
        this.mapView.updateAll(this.level);
    };

    LevelView.prototype._createPlayerView = function(player) {
        log("LevelView: Creating view for new player");
        this.playerViews.push(this.playerViewFactory(player))
    };

    LevelView.prototype.updateAll = function() {

        this.mapView.updateAll(this.level);
        for (var i = 0; i < this.playerViews.length; i++) {
            this.playerViews[i].updateAll();
        }

    };

    Dyna.ui.LevelView = LevelView;

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * Constructor
     */
    function MapView(jContainer, map) {
        log("Creating mapview");
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

    MapView.prototype.getTile = function(tileObj, x, y) {
        return this.tileTemplate.clone()
                .addClass(tileObj.type)
                .css("left", x * Dyna.ui.LevelView.tileSize)
                .css("top", y * Dyna.ui.LevelView.tileSize)
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

})(window.Dyna, jQuery);(function(Dyna, jQuery) {

    /**
     * Constructor
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
        this.player.on(Dyna.model.Player.MOVED, this.updateAll.bind(this));
        this.player.on(Dyna.model.Player.DIRECTION_CHANGED, this.changeDirection.bind(this));
        this.player.on(Dyna.model.Player.DIED, this.handlePlayerDied.bind(this));

        this.jPlayer = jQuery("<div class='player'></div>").appendTo(this.jContainer);

        jQuery("<div class='nameBadge'></div>")
                .text(this.player.name)
                .appendTo(this.jPlayer);

        jQuery("<div class='avatar'></div>")
                .appendTo(this.jPlayer);

        log("PlayerView: Added player to " + this.jContainer[0]);
    };

    PlayerView.prototype.handlePlayerDied = function() {
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
     * Constructor
     */
    function Game(level, levelView) {

        log("Starting Dyna Game on level " + level.name);
        this.level = level;
        this.levelView = levelView;
        this._initialiseEvents();
                                                       
    }

    Game.prototype.level = null;
    Game.prototype.levelView = null;

    Game.prototype._initialiseEvents = function() {
        Dyna.app.GlobalEvents.on("pause", this.pause.bind(this));
    };

    Game.prototype.pause = function() {
        log("Game paused");
    };

    Game.prototype.start = function() {
        this.levelView.updateAll();
    };

    Dyna.app.Game = Game;

})(window.Dyna);(function(Dyna) {

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
                explosionViewFactory = function(explosion) { return new Dyna.ui.ExplosionView("#level .explosions", explosion, map) },
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