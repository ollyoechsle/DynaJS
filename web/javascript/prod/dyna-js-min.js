window.Dyna={app:{},util:{},ui:{},model:{},events:{}};if(!Function.prototype.bind){Function.prototype.bind=function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)))};c.prototype=this.prototype;d.prototype=new c();return d}}Object.extend=function(c,a){var d=a.prototype;for(var b in d){if(d.hasOwnProperty(b)){c.prototype[b]=d[b]}}c.prototype.superclass=d};function log(){console&&console.log.apply(window,arguments)}(function(a){function b(){this._subscribers=[]}b.prototype._subscribers=null;b.prototype.on=function(e,d){var c=typeof d;if(c==="undefined"){throw new Error("CustomEvent: Subscriber cannot be undefined")}if(c!=="function"){throw new Error("CustomEvent: Subscriber must be a function")}this._subscribers.push({fn:d,event:e})};b.prototype.fire=function(g){for(var f=0,c=this._subscribers.length;f<c;f++){var h=this._subscribers[f];if(h.event===g){var e=[];for(var d=1;d<arguments.length;d++){e.push(arguments[d])}h.fn.apply(null,e)}}};b.prototype.un=function(g,e){var d,c=this._subscribers.length,f,h=[];for(d=0;d<c;d++){f=this._subscribers[d];if(f.fn===g||f.context===e){}else{h.push(f)}}this._subscribers=h};b.prototype.unsubscribeAll=function(){this._subscribers=[]};a.events.CustomEvent=b})(window.Dyna);(function(b){function a(c,d){this.superclass.constructor.call(this);log("Creating level "+c);this.map=d;this.players=[]}Object.extend(a,b.events.CustomEvent);a.prototype.map=null;a.prototype.players=[];a.prototype.addPlayer=function(c){if(this.map.findPositionFor(c)){this.players.push(c);log("Game has "+this.players.length+" player(s)");this.fire(a.PLAYER_ADDED,c)}else{log("No room for this player on the map")}};a.PLAYER_ADDED="playerAdded";b.model.Level=a})(window.Dyna);(function(b){function a(d,c){log("Creating map");this.name=name;this.width=d;this.height=c;this.build()}a.prototype.name=null;a.prototype.width=null;a.prototype.height=null;a.prototype.data=null;a.prototype.build=function(){var d=[],e;for(var f=0;f<this.height;f++){e=[];for(var c=0;c<this.width;c++){if(c%2==1&&f%2==1){e.push(a.WALL)}else{e.push(a.EARTH)}}d.push(e)}this.data=d};a.prototype.findPositionFor=function(c){c.x=0;c.y=0;return true};a.prototype.tileAt=function(c,d){return this.data[c][d]};a.EARTH="earth";a.WALL="wall";b.model.Map=a})(window.Dyna);(function(b){function a(c){this.superclass.constructor.call(this);log("Creating player "+c);this.name=c}Object.extend(a,b.events.CustomEvent);a.prototype.name=null;a.prototype.withControls=function(c){c.on(a.UP,this.move.bind(this));c.on(a.DOWN,this.move.bind(this));c.on(a.LEFT,this.move.bind(this));c.on(a.RIGHT,this.move.bind(this));return this};a.prototype.move=function(){log("Player is moving")};a.UP="up";a.DOWN="down";a.LEFT="left";a.RIGHT="right";b.model.Player=a})(window.Dyna);(function(d,e){function b(){this.superclass.constructor.call(this);this._init()}Object.extend(b,d.events.CustomEvent);var c=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];var a={"38":"up","40":"down","37":"left","39":"right","13":"enter","9":"tab","27":"esc","190":".","191":"/"};b.prototype._init=function(){log("Initialising keyboard events",this._subscribers);e(document).keydown(this._handleKeyDown.bind(this))};b.prototype._handleKeyDown=function(f){var i=f.keyCode,g,h;log(i);if(i>=65&&i<=90){g=c[i-65]}else{if(i>=48&&i<=57){g=i-48}else{g=a[i]}}if(g!==undefined){h=this.fire("keydown",g,f)}};d.util.Keyboard=b})(window.Dyna,jQuery);(function(a,b){function c(e,g,d,f){log("Creating LevelView for  "+g.name);this.jContainer=b(e);this.level=g;this.playerViewFactory=f;this.playerViews=[];this.mapViewFactory=d;this.mapView=null;this.initialise()}c.prototype.jContainer=null;c.prototype.level=null;c.prototype.playerViewClass=null;c.prototype.playerViews=null;c.prototype.mapViewClass=null;c.prototype.mapView=null;c.prototype.initialise=function(){log("Initialising level view");c.tileSize=30;this.level.on(a.model.Level.PLAYER_ADDED,this._createPlayerView.bind(this));this.mapView=new this.mapViewFactory(this.level.map)};c.prototype._createPlayerView=function(d){log("LevelView: Creating view for new player");this.playerViews.push(new this.playerViewFactory(d))};c.prototype.updateAll=function(){this.mapView.updateAll(this.level);for(var d=0;d<this.playerViews.length;d++){this.playerViews[d].updateAll()}};a.ui.LevelView=c})(window.Dyna,jQuery);(function(b,c){function a(d,e){log("Creating mapview");this.jContainer=c(d);this.map=e;this.initialise()}a.prototype.map=null;a.prototype.jContainer=null;a.prototype.tileTemplate=null;a.prototype.initialise=function(){log("Initialising map view");this.initialiseMap()};a.prototype.initialiseMap=function(){this.jContainer.parent().css("width",b.ui.LevelView.tileSize*this.map.width).css("height",b.ui.LevelView.tileSize*this.map.height);this.tileTemplate=c("<div class='tile'></div>")};a.prototype.getTile=function(e,d,f){return this.tileTemplate.clone().addClass(e).css("left",d*b.ui.LevelView.tileSize).css("top",f*b.ui.LevelView.tileSize)};a.prototype.updateAll=function(){var e=document.createDocumentFragment();for(var f=0;f<this.map.height;f++){for(var d=0;d<this.map.width;d++){e.appendChild(this.getTile(this.map.tileAt(d,f),d,f)[0])}}this.jContainer.empty().append(e)};b.ui.MapView=a})(window.Dyna,jQuery);(function(a,b){function c(d,e){log("Creating player view for  "+e.name);this.jContainer=b(d);this.player=e;this.initialise()}c.prototype.player=null;c.prototype.jPlayer=null;c.prototype.initialise=function(){this.jPlayer=b("<div class='player'></div>").appendTo(this.jContainer);log("PlayerView: Added player to "+this.jContainer[0])};c.prototype.updateAll=function(){this.jPlayer.css("left",a.ui.LevelView.tileSize*this.player.x).css("top",a.ui.LevelView.tileSize*this.player.y)};a.ui.PlayerView=c})(window.Dyna,jQuery);(function(a){function b(d,c){log("Starting Dyna Game on level "+d.name);this.level=d;this.levelView=c;this._initialiseEvents()}b.prototype.level=null;b.prototype.levelView=null;b.prototype._initialiseEvents=function(){a.app.GlobalEvents.on("pause",this.pause.bind(this))};b.prototype.pause=function(){log("Game paused")};b.prototype.start=function(){this.levelView.updateAll()};a.app.Game=b})(window.Dyna);(function(b){function a(c,d){this.superclass.constructor.call(this);if(!d){throw new Error("Cannot create keyboard input without actions")}log("Starting Keyboard Input with actions "+d);c.on("keydown",this.handleKeyPress.bind(this));this.actions=d}Object.extend(a,b.events.CustomEvent);a.prototype.actions=null;a.prototype.handleKeyPress=function(c){log("Keyboard input handling key press for "+c);var d=this.actions[c];d&&this.fire(d)};b.app.KeyboardInput=a})(window.Dyna);(function(a){function b(){log("Initialising DynaJS");a.app.GlobalEvents=new a.events.CustomEvent();var f=a.model.Player;var c=new a.util.Keyboard();var h=new a.model.Map(11,11),j=new a.model.Level("Level 1",h);var d=function(k){return new a.ui.MapView("#level .map",k)},g=function(k){return new a.ui.PlayerView("#level .players",k)},i=new a.ui.LevelView("#level",j,d,g);var e=new a.app.Game(j,i);j.addPlayer(new f("Player 1").withControls(new a.app.KeyboardInput(c,{up:f.UP,down:f.DOWN,left:f.LEFT,right:f.RIGHT})));e.start()}jQuery(document).ready(b)})(window.Dyna);