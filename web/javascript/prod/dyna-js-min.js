window.Dyna={app:{},util:{},ui:{},model:{},events:{}};if(!Function.prototype.bind){Function.prototype.bind=function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)))};c.prototype=this.prototype;d.prototype=new c();return d}}Object.extend=function(c,a){var d=a.prototype;for(var b in d){if(d.hasOwnProperty(b)){c.prototype[b]=d[b]}}c.prototype.superclass=d};function log(){console&&console.log(arguments)}(function(a){function b(){this._subscribers=[]}b.prototype._subscribers=null;b.prototype.on=function(e,d){var c=typeof d;if(c==="undefined"){throw new Error("CustomEvent: Subscriber cannot be undefined")}if(c!=="function"){throw new Error("CustomEvent: Subscriber must be a function")}this._subscribers.push({fn:d,event:e})};b.prototype.fire=function(g){for(var f=0,c=this._subscribers.length;f<c;f++){var h=this._subscribers[f];if(h.event===g){var e=[];for(var d=1;d<arguments.length;d++){e.push(arguments[d])}h.fn.apply(null,e)}}};b.prototype.un=function(g,e){var d,c=this._subscribers.length,f,h=[];for(d=0;d<c;d++){f=this._subscribers[d];if(f.fn===g||f.context===e){}else{h.push(f)}}this._subscribers=h};b.prototype.unsubscribeAll=function(){this._subscribers=[]};a.events.CustomEvent=b})(window.Dyna);(function(d,e){function b(){this.superclass.constructor.call(this);this._init()}Object.extend(b,d.events.CustomEvent);var c=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];var a={"38":"up","40":"down","37":"left","39":"right","13":"enter","9":"tab","27":"esc","190":".","191":"/"};b.prototype._init=function(){log("Initialising keyboard events",this._subscribers);e(document).keydown(this._handleKeyDown.bind(this))};b.prototype._handleKeyDown=function(f){var i=f.keyCode,g,h;if(i>=65&&i<=90){g=c[i-65]}else{if(i>=48&&i<=57){g=i-48}else{g=a[i]}}if(g!==undefined){h=this.fire("keydown",g,f);return false}else{return true}};d.util.Keyboard=b})(window.Dyna,jQuery);(function(b){function a(c,d){this.superclass.constructor.call(this);if(!d){throw new Error("Cannot create keyboard input without actions")}log("Starting Keyboard Input with actions "+d);c.on("keydown",this.handleKeyPress.bind(this));this.actions=d}Object.extend(a,b.events.CustomEvent);a.prototype.actions=null;a.prototype.handleKeyPress=function(c){var d=this.actions[c];d&&this.fire(d)};b.app.KeyboardInput=a})(window.Dyna);(function(b){function a(c,d){this.superclass.constructor.call(this);log("Creating bomb");this.x=c;this.y=d;this.exploded=false;this.startTicking()}Object.extend(a,b.events.CustomEvent);a.prototype.x=null;a.prototype.y=null;a.prototype.exploded=false;a.prototype.startTicking=function(){window.setTimeout(this.explode.bind(this),3*1000)};a.prototype.getExplosion=function(){var c=new b.model.Explosion();c.addAffectedTile(this.x,this.y);c.addAffectedTile(this.x+1,this.y);c.addAffectedTile(this.x-1,this.y);c.addAffectedTile(this.x,this.y+1);c.addAffectedTile(this.x,this.y-1);return c};a.prototype.explode=function(){this.exploded=true;this.fire(a.EXPLODE,this.getExplosion())};a.EXPLODE="explode";b.model.Bomb=a})(window.Dyna);(function(a){function b(){log("Creating explosion");this.tilesAffected=[]}b.prototype.tilesAffected=null;b.prototype.addAffectedTile=function(c,d){this.tilesAffected.push({x:c,y:d})};b.prototype.affects=function(c,f){for(var d=0;d<this.tilesAffected.length;d++){var e=this.tilesAffected[d];if(e.x==c&&e.y==f){return true}}return false};a.model.Explosion=b})(window.Dyna);(function(b){function a(c,d){this.superclass.constructor.call(this);log("Creating level "+c);this.map=d;this.players=[]}Object.extend(a,b.events.CustomEvent);a.prototype.map=null;a.prototype.players=[];a.prototype.addPlayer=function(c){if(this.map.findPositionFor(c)){this.players.push(c);c.on(b.model.Player.WANTS_TO_MOVE,this.handlePlayerMove.bind(this));c.on(b.model.Player.LAID_BOMB,this.handleBombAdded.bind(this));this.fire(a.PLAYER_ADDED,c)}else{log("No room for this player on the map")}};a.prototype.handleBombAdded=function(c){this.fire(a.BOMB_ADDED,c);c.on(b.model.Bomb.EXPLODE,this.handleBombExploded.bind(this))};a.prototype.handleBombExploded=function(e){for(var c=0;c<e.tilesAffected.length;c++){var d=e.tilesAffected[c];this.map.destroy(d.x,d.y)}b.app.GlobalEvents.fire(b.model.Bomb.EXPLODE,e)};a.prototype.handlePlayerMove=function(d,c,e){if(this.map.isFree(c,e)){d.moveTo(c,e)}};a.PLAYER_ADDED="playerAdded";a.BOMB_ADDED="bombAdded";b.model.Level=a})(window.Dyna);(function(b){function a(d,c){this.width=d;this.height=c;this.playerPositions=[];this.build()}a.prototype.width=null;a.prototype.height=null;a.prototype.data=null;a.prototype.playerPositions=null;a.prototype.build=function(){var d=[],e;for(var f=0;f<this.height;f++){e=[];for(var c=0;c<this.width;c++){if(c%2==1&&f%2==1){e.push(a.WALL)}else{e.push(Math.random()<0.75?a.BLOCK:a.EARTH)}}d.push(e)}this.playerPositions.push({x:0,y:0});this.playerPositions.push({x:this.width-1,y:this.height-1});this.data=d};a.prototype.clearSpaceAround=function(c,d){this.data[c][d]=a.EARTH;if(d<this.height-1){this.data[c][d+1]=a.EARTH}if(d>0){this.data[c][d-1]=a.EARTH}if(c>0){this.data[c-1][d]=a.EARTH}if(c<this.width-1){this.data[c+1][d]=a.EARTH}};a.prototype.findPositionFor=function(d){var c=this.playerPositions.shift();if(c){d.x=c.x;d.y=c.y;this.clearSpaceAround(c.x,c.y);return true}else{return false}};a.prototype.destroy=function(c,e){var d=this.tileAt(c,e);if(d&&d==a.BLOCK){this.data[c][e]=a.EARTH}};a.prototype.tileAt=function(c,d){if(c<0||c>this.width-1||d<0||d>this.height-1){return null}return this.data[c][d]};a.prototype.isFree=function(c,e){var d=this.tileAt(c,e);return d&&d==a.EARTH};a.EARTH="earth";a.WALL="wall";a.BLOCK="block";b.model.Map=a})(window.Dyna);(function(b){function a(c){this.superclass.constructor.call(this);log("Creating player "+c);this.name=c;this.bombsLaid=0;this.bombsAvailable=2;this.initialise()}Object.extend(a,b.events.CustomEvent);a.prototype.name=null;a.prototype.x=null;a.prototype.y=null;a.prototype.bombsLaid=0;a.prototype.bombsAvailable=0;a.prototype.keyboardInput=null;a.prototype.initialise=function(){b.app.GlobalEvents.on(b.model.Bomb.EXPLODE,this.possiblyGetBlownUp.bind(this))};a.prototype.possiblyGetBlownUp=function(c){if(c.affects(this.x,this.y)){this.die()}};a.prototype.withControls=function(c){this.keyboardInput=c;c.on(a.UP,this.move.bind(this,0,-1,"north"));c.on(a.DOWN,this.move.bind(this,0,+1,"south"));c.on(a.LEFT,this.move.bind(this,-1,0,"west"));c.on(a.RIGHT,this.move.bind(this,+1,0,"east"));c.on(a.ENTER,this.layBomb.bind(this));return this};a.prototype.move=function(d,c,e){this.fire(a.WANTS_TO_MOVE,this,this.x+d,this.y+c);this.fire(a.DIRECTION_CHANGED,e)};a.prototype.moveTo=function(c,d){this.x=c;this.y=d;this.fire(a.MOVED)};a.prototype.layBomb=function(){log("Laying bomb");if(this.bombsLaid<this.bombsAvailable){var c=new b.model.Bomb(this.x,this.y);this.bombsLaid++;c.on(b.model.Bomb.EXPLODE,this._handleMyBombExploded.bind(this));this.fire(a.LAID_BOMB,c)}};a.prototype.die=function(){this.keyboardInput.unsubscribeAll();this.fire(a.DIED)};a.prototype._handleMyBombExploded=function(){this.bombsLaid--};a.UP="up";a.DOWN="down";a.LEFT="left";a.RIGHT="right";a.ENTER="enter";a.MOVED="moved";a.DIRECTION_CHANGED="directionChanged";a.WANTS_TO_MOVE="wantsToMove";a.LAID_BOMB="laidBomb";a.DIED="died";b.model.Player=a})(window.Dyna);(function(a,c){function b(d,e){log("Creating bomb view");this.jContainer=c(d);this.bomb=e;this.initialise()}b.prototype.bomb=null;b.prototype.jBomb=null;b.prototype.initialise=function(){this.bomb.on(a.model.Bomb.EXPLODE,this.showExplosion.bind(this));this.jBomb=c("<div class='ticking bomb'></div>").css("left",a.ui.LevelView.tileSize*this.bomb.x).css("top",a.ui.LevelView.tileSize*this.bomb.y).appendTo(this.jContainer)};b.prototype.showExplosion=function(){this.jBomb.removeClass("ticking").addClass("exploded"+(parseInt(Math.random()*3)+1))};a.ui.BombView=b})(window.Dyna,jQuery);(function(b,c){function a(d,e){this.jContainer=c(d);this.explosion=e;this.initialise()}a.prototype.explosion=null;a.prototype.jContainer=null;a.prototype.jExplosion=null;a.prototype.initialise=function(){};a.prototype.showExplosion=function(){};b.ui.ExplosionView=a})(window.Dyna,jQuery);(function(a,b){function c(e,h,d,f,g){log("Creating LevelView for  "+h.name);this.jContainer=b(e);this.level=h;this.playerViewFactory=f;this.playerViews=[];this.mapViewFactory=d;this.mapView=null;this.bombViewFactory=g;this.initialise()}c.prototype.jContainer=null;c.prototype.level=null;c.prototype.playerViewFactory=null;c.prototype.playerViews=null;c.prototype.mapViewFactory=null;c.prototype.mapView=null;c.prototype.bombViewFactory=null;c.prototype.initialise=function(){log("Initialising level view");c.tileSize=30;this.level.on(a.model.Level.PLAYER_ADDED,this._createPlayerView.bind(this));this.level.on(a.model.Level.BOMB_ADDED,this._handleBombLaid.bind(this));this.mapView=this.mapViewFactory(this.level.map)};c.prototype._handleBombLaid=function(d){this.bombViewFactory(d)};c.prototype._createPlayerView=function(d){log("LevelView: Creating view for new player");this.playerViews.push(this.playerViewFactory(d))};c.prototype.updateAll=function(){this.mapView.updateAll(this.level);for(var d=0;d<this.playerViews.length;d++){this.playerViews[d].updateAll()}};a.ui.LevelView=c})(window.Dyna,jQuery);(function(b,c){function a(d,e){log("Creating mapview");this.jContainer=c(d);this.map=e;this.initialise()}a.prototype.map=null;a.prototype.jContainer=null;a.prototype.tileTemplate=null;a.prototype.initialise=function(){log("Initialising map view");this.initialiseMap();b.app.GlobalEvents.on(b.model.Bomb.EXPLODE,this.updateAll.bind(this))};a.prototype.initialiseMap=function(){this.jContainer.parent().css("width",b.ui.LevelView.tileSize*this.map.width).css("height",b.ui.LevelView.tileSize*this.map.height);this.tileTemplate=c("<div class='tile'></div>")};a.prototype.getTile=function(e,d,f){return this.tileTemplate.clone().addClass(e).css("left",d*b.ui.LevelView.tileSize).css("top",f*b.ui.LevelView.tileSize)};a.prototype.updateAll=function(){var e=document.createDocumentFragment();for(var f=0;f<this.map.height;f++){for(var d=0;d<this.map.width;d++){e.appendChild(this.getTile(this.map.tileAt(d,f),d,f)[0])}}this.jContainer.empty().append(e)};b.ui.MapView=a})(window.Dyna,jQuery);(function(a,b){function c(d,e){log("Creating player view for  "+e.name);this.jContainer=b(d);this.player=e;this.initialise()}c.prototype.player=null;c.prototype.jPlayer=null;c.prototype.currentDirection=null;c.prototype.initialise=function(){this.player.on(a.model.Player.MOVED,this.updateAll.bind(this));this.player.on(a.model.Player.DIRECTION_CHANGED,this.changeDirection.bind(this));this.player.on(a.model.Player.DIED,this.handlePlayerDied.bind(this));this.jPlayer=b("<div class='player'></div>").appendTo(this.jContainer);b("<div class='nameBadge'></div>").text(this.player.name).appendTo(this.jPlayer);b("<div class='avatar'></div>").appendTo(this.jPlayer);log("PlayerView: Added player to "+this.jContainer[0])};c.prototype.handlePlayerDied=function(){this.jPlayer.addClass("dead")};c.prototype.changeDirection=function(d){if(this.currentDirection||this.currentDirection!=d){this.jPlayer.removeClass(this.currentDirection)}this.jPlayer.addClass(d);this.currentDirection=d};c.prototype.updateAll=function(){this.jPlayer.css("left",a.ui.LevelView.tileSize*this.player.x).css("top",a.ui.LevelView.tileSize*this.player.y)};a.ui.PlayerView=c})(window.Dyna,jQuery);(function(a){function b(d,c){log("Starting Dyna Game on level "+d.name);this.level=d;this.levelView=c;this._initialiseEvents()}b.prototype.level=null;b.prototype.levelView=null;b.prototype._initialiseEvents=function(){a.app.GlobalEvents.on("pause",this.pause.bind(this))};b.prototype.pause=function(){log("Game paused")};b.prototype.start=function(){this.levelView.updateAll()};a.app.Game=b})(window.Dyna);(function(a){function b(){log("Initialising DynaJS");a.app.GlobalEvents=new a.events.CustomEvent();var e=a.model.Player;var h=new a.util.Keyboard();var d=new a.model.Map(11,11),c=new a.model.Level("Level 1",d);var i=function(l){return new a.ui.MapView("#level .map",l)},g=function(l){return new a.ui.PlayerView("#level .players",l)},k=function(l){return new a.ui.BombView("#level .players",l)},f=new a.ui.LevelView("#level",c,i,g,k);var j=new a.app.Game(c,f);c.addPlayer(new e("Player 1").withControls(new a.app.KeyboardInput(h,{up:e.UP,down:e.DOWN,left:e.LEFT,right:e.RIGHT,enter:e.ENTER})));c.addPlayer(new e("Player 2").withControls(new a.app.KeyboardInput(h,{w:e.UP,s:e.DOWN,a:e.LEFT,d:e.RIGHT,tab:e.ENTER})));j.start()}jQuery(document).ready(b)})(window.Dyna);