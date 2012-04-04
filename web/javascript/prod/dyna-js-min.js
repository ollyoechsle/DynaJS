window.Dyna={app:{},ai:{},events:{},model:{},service:{},util:{},ui:{}};if(!Function.prototype.bind){Function.prototype.bind=function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)))};c.prototype=this.prototype;d.prototype=new c();return d}}Math.randomGaussian=function(a,c){a=a||0;c=isNaN(c)?1:c;if(this.hasAnotherGaussian){this.hasAnotherGaussian=false;return(this.nextGaussian*c)+a}else{var f,d,b,e;do{f=2*Math.random()-1;d=2*Math.random()-1;b=f*f+d*d}while(b>=1||b==0);e=Math.sqrt(-2*Math.log(b)/b);this.nextGaussian=d*e;this.hasAnotherGaussian=true;return(f*e*c)+a}};Object.extend=function(c,a){function b(){}b.prototype=a.prototype;c.prototype=new b();c.prototype.superclass=a.prototype};(function(b){var a=Function.prototype.bind.call(console.log,console);b.log=function(){a.apply(console,arguments)}})(window);(function(a){function b(){this._subscribers=[]}b.prototype._subscribers=null;b.prototype.on=function(e,d){var c=typeof d;if(c==="undefined"){throw new Error("CustomEvent: Subscriber cannot be undefined")}if(c!=="function"){throw new Error("CustomEvent: Subscriber must be a function")}this._subscribers.push({fn:d,event:e})};b.prototype.fire=function(g){for(var f=0,c=this._subscribers.length;f<c;f++){var h=this._subscribers[f];if(h.event===g){var e=[];for(var d=1;d<arguments.length;d++){e.push(arguments[d])}h.fn.apply(null,e)}}};b.prototype.un=function(g,e){var d,c=this._subscribers.length,f,h=[];for(d=0;d<c;d++){f=this._subscribers[d];if(f.fn===g||f.context===e){}else{h.push(f)}}this._subscribers=h};b.prototype.unsubscribeAll=function(){this._subscribers=[]};a.events.CustomEvent=b})(window.Dyna);(function(c){function a(j,i,h){this.map=j;this.startX=i;this.startY=h}a.prototype.startX=null;a.prototype.startY=null;a.prototype.map=null;a.prototype.stack=null;a.prototype.completePathsFound=null;a.prototype.getAvailableDestinations=function(){var i="",j=this.map;function h(l,p){var m,n,k,o;i=i+b(l,p)+",";for(m in e){n=e[m],k=l+n.x,o=p+n.y;if(j.isFree(k,o)){if(i.lastIndexOf(b(k,o))==-1){h(k,o)}}}}h(this.startX,this.startY);return d(i)};a.prototype.getPathTo=function(h,l){this.stack=[];this.completePathsFound=[];this.stack.push([this.startX,this.startY,b(h,l),""]);while(this.stack.length&&this.completePathsFound.length==0){var j=[];while(this.stack.length){j.push(this.stack.pop())}for(var k=0;k<j.length;k++){this._findPath.apply(this,j[k])}}if(!this.completePathsFound.length){return null}else{return d(this.completePathsFound[0])}};a.prototype._findPath=function(j,i,m,o){var h=b(j,i);o=o+h+",";if(h===m){this.completePathsFound.push(o);return}for(var p in e){var n=e[p],l=j+n.x,k=i+n.y;if(this.map.isFree(l,k)){if(o.lastIndexOf(b(l,k))==-1){this.stack.push([l,k,m,o])}}}};var g=["a","b","c","d","e","f","g","h","i","j","k","l","m","n"];var b=function(h,i){return g[h]+i};var f=function(h){return{x:g.indexOf(h[0]),y:+h[1]}};var e={east:{x:-1,y:0},west:{x:+1,y:0},north:{x:0,y:-1},south:{x:0,y:+1}};var d=function(n){var j=[],m=n.split(","),k,h;for(k=0,h=m.length-1;k<h;k++){j.push(f(m[k]))}return j};c.util.PathFinder=a})(window.Dyna);(function(d,e){function b(){this.superclass.constructor.call(this);this._init()}Object.extend(b,d.events.CustomEvent);var c=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];var a={"38":"up","40":"down","37":"left","39":"right","13":"enter","9":"tab","27":"esc","190":".","191":"/"};b.prototype._init=function(){log("Initialising keyboard events",this._subscribers);e(document).keydown(this._handleKeyDown.bind(this))};b.prototype._handleKeyDown=function(f){var i=f.keyCode,g,h;if(i>=65&&i<=90){g=c[i-65]}else{if(i>=48&&i<=57){g=i-48}else{g=a[i]}}if(g!==undefined){h=this.fire("keydown",g,f);return false}else{return true}};d.util.Keyboard=b})(window.Dyna,jQuery);(function(b){function a(c,d){this.superclass.constructor.call(this);if(!d){throw new Error("Cannot create keyboard input without actions")}log("Starting Keyboard Input with actions "+d);c.on("keydown",this.handleKeyPress.bind(this));this.actions=d}Object.extend(a,b.events.CustomEvent);a.prototype.actions=null;a.prototype.handleKeyPress=function(c){var d=this.actions[c];d&&this.fire(d)};b.util.KeyboardInput=a})(window.Dyna);(function(b){var c=0;function a(d,f,e){this.superclass.constructor.call(this);this.id=++c;this.x=d;this.y=f;this.exploded=false;this.power=e;log("Creating bomb",this.id);this.startTicking()}Object.extend(a,b.events.CustomEvent);a.prototype.id=null;a.prototype.x=null;a.prototype.y=null;a.prototype.exploded=false;a.prototype.power=0;a.prototype.timer=null;a.prototype.startTicking=function(){this.timer=window.setTimeout(this.explode.bind(this),3*1000);b.app.GlobalEvents.on(b.model.Level.EXPLOSION,this.triggerChainReaction.bind(this))};a.prototype.triggerChainReaction=function(d){if(d.affects(this.x,this.y)&&this.timer){window.clearTimeout(this.timer);window.setTimeout(this.explode.bind(this),300);this.explode()}};a.prototype.explode=function(){this.timer=null;this.exploded=true;this.fire(a.EXPLODE,this.x,this.y,this.power,this)};a.prototype.at=function(d,e){return this.x==d&&this.y==e};a.EXPLODE="explode";b.model.Bomb=a})(window.Dyna);(function(a){function c(){this.tilesAffected=[];this.blocksAffected=0}c.prototype.tilesAffected=null;c.prototype.blocksAffected=0;c.prototype.addAffectedTile=function(d,e){this.tilesAffected.push({x:d,y:e})};c.prototype.affects=function(d,g){for(var e=0;e<this.tilesAffected.length;e++){var f=this.tilesAffected[e];if(f.x==d&&f.y==g){return true}}return false};c.create=function(d,k,h,e){var o=new c(),j;for(var n in b){j=b[n];for(var f=0;f<=e;f++){var m=k+(j.x*f),l=h+(j.y*f),g=d.tileAt(m,l);if(g&&g!=a.model.Map.WALL){o.addAffectedTile(m,l);if(g==a.model.Map.BLOCK){o.blocksAffected++}if(g.solid){break}}else{break}}}return o};var b={east:{x:-1,y:0},west:{x:+1,y:0},north:{x:0,y:-1},south:{x:0,y:+1}};a.model.Explosion=c})(window.Dyna);(function(b){function a(c,d){this.superclass.constructor.call(this);log("Creating level "+c);this.map=d;this.players=[]}Object.extend(a,b.events.CustomEvent);a.prototype.map=null;a.prototype.players=[];a.prototype.addPlayer=function(c){if(this.map.findPositionFor(c)){this.players.push(c);c.on(b.model.Player.WANTS_TO_MOVE,this.handlePlayerMove.bind(this));c.on(b.model.Player.LAID_BOMB,this.handleBombAdded.bind(this));this.fire(a.PLAYER_ADDED,c)}else{log("No room for this player on the map")}};a.prototype.handleBombAdded=function(c){this.fire(a.BOMB_ADDED,c);c.on(b.model.Bomb.EXPLODE,this.handleBombExploded.bind(this))};a.prototype.handleBombExploded=function(c,h,e){var g=b.model.Explosion.create(this.map,c,h,e);for(var d=0;d<g.tilesAffected.length;d++){var f=g.tilesAffected[d];this.map.destroy(f.x,f.y)}b.app.GlobalEvents.fire(a.EXPLOSION,g)};a.prototype.handlePlayerMove=function(d,c,e){if(this.map.isFree(c,e)){d.moveTo(c,e);if(this.map.steppedOnLevelUp(c,e)){this.fire(a.LEVEL_UP,d);d.powerUp()}}};a.PLAYER_ADDED="playerAdded";a.BOMB_ADDED="bombAdded";a.EXPLOSION="bombExploded";a.LEVEL_UP="levelUp";b.model.Level=a})(window.Dyna);(function(b){function a(e,c,d){this.width=e;this.height=c;this.maxDistance=e+c;this.playerPositions=[];this._createMap(d)}a.prototype.width=null;a.prototype.height=null;a.prototype.maxDistance=null;a.prototype.data=null;a.prototype.playerPositions=null;a.prototype._createMap=function(d){var e=[],f,c,g;for(g=0;g<this.height;g++){f=[];for(c=0;c<this.width;c++){if(c%2==1&&g%2==1){f.push(a.WALL)}else{if(Math.random()<d.blocks){if(Math.random()<d.powerups){f.push(a.HIDDEN_POWERUP)}else{f.push(a.BLOCK)}}else{f.push(a.EARTH)}}}e.push(f)}this.playerPositions.push({x:0,y:0});this.playerPositions.push({x:this.width-1,y:this.height-1});this.data=e};a.prototype.clearSpaceAround=function(c,d){this.data[c][d]=a.EARTH;if(d<this.height-1){this.data[c][d+1]=a.EARTH}if(d>0){this.data[c][d-1]=a.EARTH}if(c>0){this.data[c-1][d]=a.EARTH}if(c<this.width-1){this.data[c+1][d]=a.EARTH}};a.prototype.findPositionFor=function(d){var c=this.playerPositions.shift();if(c){d.x=c.x;d.y=c.y;this.clearSpaceAround(c.x,c.y);return true}else{return false}};a.prototype.destroy=function(c,e){var d=this.tileAt(c,e);if(d&&d.destroy){this.data[c][e]=d.destroy()}};a.prototype.inBounds=function(c,d){return !(c<0||c>this.width-1||d<0||d>this.height-1)};a.prototype.tileAt=function(c,d){if(this.inBounds(c,d)){return this.data[c][d]}else{return null}};a.prototype.isFree=function(c,e){var d=this.tileAt(c,e);return d&&!d.solid};a.prototype.isPowerUp=function(c,e){var d=this.tileAt(c,e);return d==a.POWERUP};a.prototype.steppedOnLevelUp=function(c,e){var d=this.tileAt(c,e);if(d&&d==a.POWERUP){this.data[c][e]=d.destroy();return true}else{return false}};a.EARTH={solid:false,type:"earth"};a.WALL={solid:true,type:"wall"};a.BLOCK={type:"block",solid:true,destroy:function(){return a.EARTH}};a.POWERUP={type:"powerup",solid:false,destroy:function(){return a.EARTH}};a.HIDDEN_POWERUP={type:"block",solid:true,destroy:function(){return a.POWERUP}};b.model.Map=a})(window.Dyna);(function(b){function a(c){this.superclass.constructor.call(this);log("Creating player "+c);this.name=c;this.bombsLaid=0;this.bombsAvailable=2;this.initialise()}Object.extend(a,b.events.CustomEvent);a.prototype.name=null;a.prototype.x=null;a.prototype.y=null;a.prototype.bombsLaid=0;a.prototype.power=1;a.prototype.bombsAvailable=0;a.prototype.initialise=function(){b.app.GlobalEvents.on(b.model.Level.EXPLOSION,this.possiblyGetBlownUp.bind(this))};a.prototype.possiblyGetBlownUp=function(c){if(c.affects(this.x,this.y)){this.die()}};a.prototype.powerUp=function(){this.power++};a.prototype.move=function(c,e){var d;if(this.x>c){d="west"}else{if(this.x<c){d="east"}else{if(this.y<e){d="south"}else{d="north"}}}this.fire(a.WANTS_TO_MOVE,this,c,e);this.fire(a.DIRECTION_CHANGED,d)};a.prototype.moveTo=function(c,d){this.x=c;this.y=d;this.fire(a.MOVED)};a.prototype.layBomb=function(){if(this.bombsLaid<this.bombsAvailable){var c=new b.model.Bomb(this.x,this.y,this.power);this.bombsLaid++;c.on(b.model.Bomb.EXPLODE,this._handleMyBombExploded.bind(this));this.fire(a.LAID_BOMB,c)}};a.prototype.die=function(){this.fire(a.DIED)};a.prototype._handleMyBombExploded=function(){this.bombsLaid--};a.prototype.distanceTo=function(c,d){return Math.abs(this.x-c)+Math.abs(this.y-d)};a.UP="up";a.DOWN="down";a.LEFT="left";a.RIGHT="right";a.ENTER="enter";a.MOVED="moved";a.DIRECTION_CHANGED="directionChanged";a.WANTS_TO_MOVE="wantsToMove";a.LAID_BOMB="laidBomb";a.DIED="died";b.model.Player=a})(window.Dyna);(function(a,c){function b(d,e){this.jContainer=c(d);this.bomb=e;this.initialise()}b.prototype.bomb=null;b.prototype.jBomb=null;b.prototype.initialise=function(){this.bomb.on(a.model.Bomb.EXPLODE,this.showExplosion.bind(this));this.jBomb=c("<div class='ticking bomb'></div>").css("left",a.ui.LevelView.tileSize*this.bomb.x).css("top",a.ui.LevelView.tileSize*this.bomb.y).appendTo(this.jContainer)};b.prototype.showExplosion=function(){this.jBomb.removeClass("ticking").addClass("exploded"+(parseInt(Math.random()*3)+1))};a.ui.BombView=b})(window.Dyna,jQuery);(function(b,c){function a(d,f,e){this.jContainer=c(d);this.explosion=f;this.map=e;this.initialise()}a.prototype.map=null;a.prototype.explosion=null;a.prototype.jContainer=null;a.prototype.jExplosion=null;a.prototype.initialise=function(){var d=document.createDocumentFragment();for(var e=0;e<this.explosion.tilesAffected.length;e++){var f=this.explosion.tilesAffected[e];if(this.map.inBounds(f.x,f.y)){d.appendChild(a.createFireBall(f.x,f.y))}}this.jContainer.append(d);this.boom()};a.createFireBall=function(d,e){return c("<div class='fireBall'></div>").css("left",d*b.ui.LevelView.tileSize).css("top",e*b.ui.LevelView.tileSize)[0]};a.prototype.boom=function(){var d=new Audio("snd/explosion.wav");d.play()};b.ui.ExplosionView=a})(window.Dyna,jQuery);(function(a,b){function c(e,i,d,g,h,f){log("Creating LevelView for  "+i.name);this.jContainer=b(e);this.level=i;this.playerViewFactory=g;this.playerViews=[];this.mapViewFactory=d;this.mapView=null;this.bombViewFactory=h;this.explosionViewFactory=f;this.initialise()}c.prototype.jContainer=null;c.prototype.level=null;c.prototype.playerViewFactory=null;c.prototype.playerViews=null;c.prototype.mapViewFactory=null;c.prototype.mapView=null;c.prototype.bombViewFactory=null;c.prototype.explosionViewFactory=null;c.prototype.initialise=function(){log("Initialising level view");c.tileSize=30;this.level.on(a.model.Level.PLAYER_ADDED,this._createPlayerView.bind(this));this.level.on(a.model.Level.BOMB_ADDED,this._handleBombLaid.bind(this));this.level.on(a.model.Level.LEVEL_UP,this._handlePlayerLevelUp.bind(this));a.app.GlobalEvents.on(a.model.Level.EXPLOSION,this._handleExplosion.bind(this));this.mapView=this.mapViewFactory(this.level.map)};c.prototype._handleBombLaid=function(d){this.bombViewFactory(d)};c.prototype._handleExplosion=function(d){this.explosionViewFactory(d)};c.prototype._handlePlayerLevelUp=function(e){var d=new Audio("snd/powerup.wav");d.play();this.mapView.updateAll(this.level)};c.prototype._createPlayerView=function(d){this.playerViews.push(this.playerViewFactory(d))};c.prototype.updateAll=function(){this.mapView.updateAll(this.level);for(var d=0;d<this.playerViews.length;d++){this.playerViews[d].updateAll()}};a.ui.LevelView=c})(window.Dyna,jQuery);(function(b,c){function a(d,e){this.jContainer=c(d);this.map=e;this.initialise()}a.prototype.map=null;a.prototype.jContainer=null;a.prototype.tileTemplate=null;a.prototype.initialise=function(){log("Initialising map view");this.initialiseMap();b.app.GlobalEvents.on(b.model.Level.EXPLOSION,this.updateAll.bind(this))};a.prototype.initialiseMap=function(){this.jContainer.parent().css("width",b.ui.LevelView.tileSize*this.map.width).css("height",b.ui.LevelView.tileSize*this.map.height);this.tileTemplate=c("<div class='tile'></div>")};a.prototype.getTile=function(e,d,f){return this.tileTemplate.clone().addClass(e.type).css("left",d*b.ui.LevelView.tileSize).css("top",f*b.ui.LevelView.tileSize)};a.prototype.updateAll=function(){var e=document.createDocumentFragment();for(var f=0;f<this.map.height;f++){for(var d=0;d<this.map.width;d++){e.appendChild(this.getTile(this.map.tileAt(d,f),d,f)[0])}}this.jContainer.empty().append(e)};b.ui.MapView=a})(window.Dyna,jQuery);(function(a,b){function c(d,e){log("Creating player view for  "+e.name);this.jContainer=b(d);this.player=e;this.initialise()}c.prototype.player=null;c.prototype.jPlayer=null;c.prototype.currentDirection=null;c.prototype.initialise=function(){this.player.on(a.model.Player.MOVED,this.updateAll.bind(this));this.player.on(a.model.Player.DIRECTION_CHANGED,this.changeDirection.bind(this));this.player.on(a.model.Player.DIED,this.handlePlayerDied.bind(this));this.jPlayer=b("<div class='player'></div>").appendTo(this.jContainer);b("<div class='nameBadge'></div>").text(this.player.name).appendTo(this.jPlayer);b("<div class='avatar'></div>").appendTo(this.jPlayer)};c.prototype.handlePlayerDied=function(){this.jPlayer.addClass("dead")};c.prototype.changeDirection=function(d){if(this.currentDirection||this.currentDirection!=d){this.jPlayer.removeClass(this.currentDirection)}this.jPlayer.addClass(d);this.currentDirection=d};c.prototype.updateAll=function(){this.jPlayer.css("left",a.ui.LevelView.tileSize*this.player.x).css("top",a.ui.LevelView.tileSize*this.player.y)};a.ui.PlayerView=c})(window.Dyna,jQuery);(function(a){function b(e,h,f,c,d,g){this.player=e;this.level=h;this.map=f;this.destinationChooser=c;this.bomber=d;this.walker=g;this.initialise()}b.prototype.player=null;b.prototype.map=null;b.prototype.currentPath=null;b.prototype.destinationChooser=null;b.prototype.bomber=null;b.prototype.walker=null;b.prototype.initialise=function(){this.player.on(a.model.Player.DIED,this.stopControlling.bind(this));this.interval=window.setInterval(this.think.bind(this),b.SPEED)};b.prototype.think=function(){if(!this.currentPath){this.chooseSomewhereToGo()}this.takeNextStep()};b.prototype.takeNextStep=function(){if(this.currentPath){if(this.currentPath.length){var c=this.currentPath[0];if(this.walker.shouldWalkTo(c.x,c.y,this.player)){this.player.move(c.x,c.y);this.currentPath.shift()}else{log("Freezing!")}}else{if(this.bomber.layingBombHereIsAGoodIdea(this.player.x,this.player.y,this.map,this.player)){this.player.layBomb()}this.currentPath=null}}};b.prototype.chooseSomewhereToGo=function(){var d=new a.util.PathFinder(this.map,this.player.x,this.player.y),e=d.getAvailableDestinations(),c=this.destinationChooser.chooseDestinationFrom(d.getAvailableDestinations(),this.level,this.map,this.player);if(c){this.currentPath=d.getPathTo(c.x,c.y)}};b.prototype.stopControlling=function(){window.clearInterval(this.interval)};b.SPEED=500;a.app.ComputerController=b})(window.Dyna);(function(a){function b(c){b.instance=this;this.intelligence={};this.level=c;this.level.on(a.model.Level.BOMB_ADDED,this.handleBombThreat.bind(this))}b.prototype.level=null;b.prototype.intelligence=null;b.prototype.handleBombThreat=function(c){log("FBI has had a report of a bomb threat at "+c.id);this.intelligence[c.id]={bomb:c,explosion:a.model.Explosion.create(this.level.map,c.x,c.y,c.power)};c.on(a.model.Bomb.EXPLODE,this.handleBombExplosion.bind(this))};b.prototype.handleBombExplosion=function(c,f,d,e){log("FBI standing down at",e.id);delete this.intelligence[e.id]};b.prototype.estimateDangerAt=function(d,f){var e,c;for(e in this.intelligence){c=this.intelligence[e];if(c.bomb.at(d,f)||c.explosion.affects(d,f)){return 1}}return 0};b.instance=null;a.service.FBI=b})(window.Dyna);(function(a){function b(d,c){log("Starting Dyna Game on level "+d.name);this.level=d;this.levelView=c;this._initialiseEvents()}b.prototype.level=null;b.prototype.levelView=null;b.prototype._initialiseEvents=function(){a.app.GlobalEvents.on("pause",this.pause.bind(this))};b.prototype.pause=function(){log("Game paused")};b.prototype.start=function(){this.levelView.updateAll()};a.app.Game=b})(window.Dyna);(function(b){function a(c){this.player=c;this.player.on(b.model.Player.DIED,this.stopControlling.bind(this))}a.prototype.player=null;a.prototype.keyboardInput=null;a.prototype.withControls=function(c){var d=this.movePlayerTo;this.keyboardInput=c;c.on(b.model.Player.UP,d.bind(this,0,-1));c.on(b.model.Player.DOWN,d.bind(this,0,+1));c.on(b.model.Player.LEFT,d.bind(this,-1,0));c.on(b.model.Player.RIGHT,d.bind(this,+1,0));c.on(b.model.Player.ENTER,this.player.layBomb.bind(this.player));return this};a.prototype.movePlayerTo=function(d,c){this.player.move(this.player.x+d,this.player.y+c)};a.prototype.stopControlling=function(){this.keyboardInput.unsubscribeAll();this.keyboardInput=null};b.app.HumanController=a})(window.Dyna);(function(b){function a(){}a.prototype.layingBombHereIsAGoodIdea=function(c,g,f,d){if(d.bombsLaid>0){return false}var e=b.model.Explosion.create(f,c,g,d.power);return e.blocksAffected>0};b.ai.Bomber=a})(window.Dyna);(function(a){function b(){}b.prototype.chooseDestinationFrom=function(h,k,g,f){var j=0,c,e;for(var d=0;d<h.length;d++){c=h[d];c.score=this.getScoreForDestination(c.x,c.y,k,g,f);if(c.score>j){j=c.score;e=c}}return e};b.prototype.getScoreForDestination=function(c,i,h,f,d){var g=0,e;e=a.model.Explosion.create(f,c,i,d.power);g+=e.blocksAffected;if(f.isPowerUp(c,i)){g+=10}g+=2*(1-this.getDistanceToClosestPlayer(c,i,f,h.players,d));if(c==d.x&&i==d.y){g-=2}if(a.service.FBI.instance.estimateDangerAt(c,i)){g-=20}return g};b.prototype.getDistanceToClosestPlayer=function(j,h,d,e,g){var k=d.maxDistance,l,f;for(f=0;f<e.length;f++){l=e[f];if(l!==g){var c=l.distanceTo(j,h);if(c<k){k=c}}}return k/d.maxDistance};a.ai.DestinationChooser=b})(window.Dyna);(function(a){function b(c){this.fbi=c}b.prototype.fbi=null;b.prototype.shouldWalkTo=function(c,e,d){return !this.fbi.estimateDangerAt(c,e)||this.fbi.estimateDangerAt(d.x,d.y)};a.ai.Walker=b})(window.Dyna);(function(a){function b(){log("Initialising DynaJS");a.app.GlobalEvents=new a.events.CustomEvent();var n=a.model.Player;var e=new a.util.Keyboard();var r=new a.model.Map(11,11,{blocks:0.75,powerups:0.1}),c=new a.model.Level("Level 1",r),m=new a.service.FBI(c);var d=function(u){return new a.ui.MapView("#level .map",u)},l=function(u){return new a.ui.PlayerView("#level .players",u)},f=function(u){return new a.ui.BombView("#level .players",u)},g=function(u){return new a.ui.ExplosionView("#level .explosions",u,r)},t=new a.ui.LevelView("#level",c,d,l,f,g);var s=new a.app.Game(c,t),k=new n("Computer 1"),j=new n("Player 2"),q=new a.ai.DestinationChooser(),p=new a.ai.Bomber(),o=new a.ai.Walker(m),i=new a.app.ComputerController(k,c,r,q,p,o),h=new a.app.HumanController(j).withControls(new a.util.KeyboardInput(e,{w:n.UP,s:n.DOWN,a:n.LEFT,d:n.RIGHT,tab:n.ENTER}));c.addPlayer(k);c.addPlayer(j);s.start()}jQuery(document).ready(b)})(window.Dyna);