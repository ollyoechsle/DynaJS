window.Dyna={app:{},ai:{},events:{},model:{},service:{},util:{},ui:{}};if(!Array.prototype.filter){Array.prototype.filter=function(b){if(this==null){throw new TypeError()}var f=Object(this);var a=f.length>>>0;if(typeof b!="function"){throw new TypeError()}var e=[];var d=arguments[1];for(var c=0;c<a;c++){if(c in f){var g=f[c];if(b.call(d,g,c,f)){e.push(g)}}}return e}}if(!Array.prototype.forEach){Array.prototype.forEach=function(g,b){var d,c;if(this==null){throw new TypeError(" this is null or not defined")}var f=Object(this);var a=f.length>>>0;if({}.toString.call(g)!="[object Function]"){throw new TypeError(g+" is not a function")}if(b){d=b}c=0;while(c<a){var e;if(c in f){e=f[c];g.call(d,e,c,f)}c++}}}if(!Function.prototype.bind){Function.prototype.bind=function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)))};c.prototype=this.prototype;d.prototype=new c();return d}}Math.randomGaussian=function(a,c){a=a||0;c=isNaN(c)?1:c;if(this.hasAnotherGaussian){this.hasAnotherGaussian=false;return(this.nextGaussian*c)+a}else{var f,d,b,e;do{f=2*Math.random()-1;d=2*Math.random()-1;b=f*f+d*d}while(b>=1||b==0);e=Math.sqrt(-2*Math.log(b)/b);this.nextGaussian=d*e;this.hasAnotherGaussian=true;return(f*e*c)+a}};Object.extend=function(c,a){function b(){}b.prototype=a.prototype;c.prototype=new b();c.prototype.constructor=c;c.superclass=a.prototype};(function(b){var a=Function.prototype.bind.call(console.log,console);b.log=function(){a.apply(console,arguments)}})(window);(function(a){function b(){this._subscribers=[]}b.prototype._subscribers=null;b.prototype.on=function(e,d){var c=typeof d;if(c==="undefined"){throw new Error("CustomEvent: Subscriber cannot be undefined")}if(c!=="function"){throw new Error("CustomEvent: Subscriber must be a function")}this._subscribers.push({fn:d,event:e})};b.prototype.fire=function(g){for(var f=0,c=this._subscribers.length;f<c;f++){var h=this._subscribers[f];if(h.event===g){var e=[];for(var d=1;d<arguments.length;d++){e.push(arguments[d])}h.fn.apply(null,e)}}};b.prototype.un=function(g,e){var d,c=this._subscribers.length,f,h=[];for(d=0;d<c;d++){f=this._subscribers[d];if(f.fn===g||f.context===e){}else{h.push(f)}}this._subscribers=h};b.prototype.unsubscribeAll=function(){this._subscribers=[]};a.events.CustomEvent=b})(window.Dyna);(function(c){function a(j,i,h){this.map=j;this.startX=i;this.startY=h}a.prototype.startX=null;a.prototype.startY=null;a.prototype.map=null;a.prototype.stack=null;a.prototype.completePathsFound=null;a.prototype.getAvailableDestinations=function(){var i="",j=this.map;function h(l,p){var m,n,k,o;i=i+b(l,p)+",";for(m in e){n=e[m],k=l+n.x,o=p+n.y;if(j.isFree(k,o)){if(i.lastIndexOf(b(k,o))==-1){h(k,o)}}}}h(this.startX,this.startY);return d(i)};a.prototype.getPathTo=function(h,l){this.stack=[];this.completePathsFound=[];this.stack.push([this.startX,this.startY,b(h,l),""]);while(this.stack.length&&this.completePathsFound.length==0){var j=[];while(this.stack.length){j.push(this.stack.pop())}for(var k=0;k<j.length;k++){this._findPath.apply(this,j[k])}}if(!this.completePathsFound.length){return null}else{return d(this.completePathsFound[0])}};a.prototype._findPath=function(j,i,m,o){var h=b(j,i);o=o+h+",";if(h===m){this.completePathsFound.push(o);return}for(var p in e){var n=e[p],l=j+n.x,k=i+n.y;if(this.map.isFree(l,k)){if(o.lastIndexOf(b(l,k))==-1){this.stack.push([l,k,m,o])}}}};var g=["a","b","c","d","e","f","g","h","i","j","k","l","m","n"];var b=function(h,i){return g[h]+i};var f=function(h){return{x:g.indexOf(h[0]),y:+h.substring(1)}};var e={east:{x:-1,y:0},west:{x:+1,y:0},north:{x:0,y:-1},south:{x:0,y:+1}};var d=function(n){var j=[],m=n.split(","),k,h;for(k=0,h=m.length-1;k<h;k++){j.push(f(m[k]))}return j};c.util.PathFinder=a})(window.Dyna);(function(b){function a(){}a.play=function(d){var c=new window.Audio("snd/"+d);c.play()};a.SELECT="select.wav";a.EXPLOSION="explosion.wav";a.POWERUP="powerup.wav";a.DIE="die.wav";b.util.Sound=a})(window.Dyna);(function(b){function a(){b.app.GlobalEvents.on("gameover",this.clearAll.bind(this));this.timeouts=[];this.intervals=[]}a.prototype.timeouts=null;a.prototype.intervals=null;a.prototype.setTimeout=function(d,c){var e=window.setTimeout(d,c);this.timeouts.push(e);return e};a.prototype.setInterval=function(d,c){var e=window.setInterval(d,c);this.intervals.push(e);return id};a.prototype.clearAll=function(){this.timeouts.forEach(function(c){window.clearTimeout(c)});this.intervals.forEach(function(c){window.clearInterval(c)});this.timeouts=[];this.intervals=[]};a.initialise=function(){b.util.Timer=new a()};b.util.Timer=a})(Dyna);(function(d,e){function b(){b.superclass.constructor.call(this);this._init()}Object.extend(b,d.events.CustomEvent);var c=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];var a={"38":"up","40":"down","37":"left","39":"right","13":"enter","9":"tab","27":"esc","190":".","191":"/"};b.prototype._init=function(){log("Initialising keyboard events",this._subscribers);e(document).keydown(this._handleKeyDown.bind(this))};b.prototype._handleKeyDown=function(f){var i=f.keyCode,g,h;if(i>=65&&i<=90){g=c[i-65]}else{if(i>=48&&i<=57){g=i-48}else{g=a[i]}}if(g!==undefined){h=this.fire("keydown",g,f);return false}else{return true}};d.util.Keyboard=b})(window.Dyna,jQuery);(function(b){function a(c,d){a.superclass.constructor.call(this);if(!d){throw new Error("Cannot create keyboard input without actions")}log("Starting Keyboard Input with actions "+d);c.on("keydown",this.handleKeyPress.bind(this));this.actions=d}Object.extend(a,b.events.CustomEvent);a.prototype.actions=null;a.prototype.handleKeyPress=function(c){var d=this.actions[c];d&&this.fire(d)};b.util.KeyboardInput=a})(window.Dyna);(function(b){var c=0;function a(d,f,e){a.superclass.constructor.call(this);this.id=++c;this.x=d;this.y=f;this.exploded=false;this.power=e;log("Creating bomb",this.id);this.startTicking()}Object.extend(a,b.events.CustomEvent);a.prototype.id=null;a.prototype.x=null;a.prototype.y=null;a.prototype.exploded=false;a.prototype.power=0;a.prototype.timer=null;a.prototype.startTicking=function(){this.timer=b.util.Timer.setTimeout(this.explode.bind(this),3*1000);b.app.GlobalEvents.on(b.model.Level.EXPLOSION,this.triggerChainReaction.bind(this))};a.prototype.triggerChainReaction=function(d){if(d.affects(this.x,this.y)&&this.timer){window.clearTimeout(this.timer);b.util.Timer.setTimeout(this.explode.bind(this),300);this.explode()}};a.prototype.explode=function(){this.timer=null;this.exploded=true;this.fire(a.EXPLODE,this.x,this.y,this.power,this)};a.prototype.at=function(d,e){return this.x==d&&this.y==e};a.EXPLODE="explode";b.model.Bomb=a})(window.Dyna);(function(a){function c(){this.tilesAffected=[];this.blocksAffected=0}c.prototype.tilesAffected=null;c.prototype.blocksAffected=0;c.prototype.addAffectedTile=function(d,e){this.tilesAffected.push({x:d,y:e})};c.prototype.affects=function(d,g){for(var e=0;e<this.tilesAffected.length;e++){var f=this.tilesAffected[e];if(f.x==d&&f.y==g){return true}}return false};c.create=function(d,k,h,e){var o=new c(),j;for(var n in b){j=b[n];for(var f=0;f<=e;f++){var m=k+(j.x*f),l=h+(j.y*f),g=d.tileAt(m,l);if(g&&g!=a.model.Map.WALL){o.addAffectedTile(m,l);if(g==a.model.Map.BLOCK){o.blocksAffected++}if(g.solid){break}}else{break}}}return o};var b={east:{x:-1,y:0},west:{x:+1,y:0},north:{x:0,y:-1},south:{x:0,y:+1}};a.model.Explosion=c})(window.Dyna);(function(b){function a(c,d){a.superclass.constructor.call(this);log("Creating level "+c);this.map=d;this.players=[]}Object.extend(a,b.events.CustomEvent);a.prototype.map=null;a.prototype.players=[];a.prototype.monsters=[];a.prototype.addPlayer=function(c){if(this.addLifeForm(c)){this.players.push(c);c.on(b.model.Player.LAID_BOMB,this.handleBombAdded.bind(this))}else{log("No room for this player on the map")}};a.prototype.addMonster=function(c){if(this.addLifeForm(c)){this.monsters.push(c)}else{log("No room for this monster on the map")}};a.prototype.addLifeForm=function(c){if(this.map.findPositionFor(c)){c.on(b.model.Lifeform.WANTS_TO_MOVE,this.handlePlayerMove.bind(this));c.on(b.model.Lifeform.DIED,this.handlePlayerDied.bind(this));this.fire(a.LIFEFORM_ADDED,c);return true}else{return false}};a.prototype.handleBombAdded=function(c){this.fire(a.BOMB_ADDED,c);c.on(b.model.Bomb.EXPLODE,this.handleBombExploded.bind(this))};a.prototype.handleBombExploded=function(c,h,e){var g=b.model.Explosion.create(this.map,c,h,e);for(var d=0;d<g.tilesAffected.length;d++){var f=g.tilesAffected[d];this.map.destroy(f.x,f.y)}b.app.GlobalEvents.fire(a.EXPLOSION,g)};a.prototype.handlePlayerMove=function(d,c,e){if(this.map.isFree(c,e)){d.moveTo(c,e);this.killAnyPlayersOverlappingMonstersAt(c,e);if(this.map.steppedOnLevelUp(c,e)&&d.powerUp){this.fire(a.LEVEL_UP,d);d.powerUp()}}};a.prototype.killAnyPlayersOverlappingMonstersAt=function(c,d){if(this.monstersAt(c,d).length){this.playersAt(c,d).forEach(function(e){e.die()})}};a.prototype.playersAt=function(d,e){return this.players.filter(function c(f){return f.x==d&&f.y==e})};a.prototype.monstersAt=function(d,e){return this.monsters.filter(function c(f){return f.x==d&&f.y==e})};a.prototype.handlePlayerDied=function(){if(this.getRemainingPlayers().length<=1){window.setTimeout(this.endLevel.bind(this),3000)}};a.prototype.getRemainingPlayers=function(){return this.players.filter(function c(d){return !d.dead})};a.prototype.endLevel=function(){this.fire(a.ENDED,this.getRemainingPlayers())};a.LIFEFORM_ADDED="lifeformAdded";a.BOMB_ADDED="bombAdded";a.EXPLOSION="bombExploded";a.LEVEL_UP="levelUp";a.ENDED="ended";b.model.Level=a})(window.Dyna);(function(b){function a(e,c,d){this.width=e;this.height=c;this.maxDistance=e+c;this.playerPositions=[];this._createMap(d)}a.prototype.width=null;a.prototype.height=null;a.prototype.maxDistance=null;a.prototype.data=null;a.prototype.playerPositions=null;a.prototype._createMap=function(d){var e=[],f,c,g;for(g=0;g<this.height;g++){f=[];for(c=0;c<this.width;c++){if(c%2==1&&g%2==1){f.push(a.WALL)}else{if(Math.random()<d.blocks){if(Math.random()<d.powerups){f.push(a.HIDDEN_POWERUP)}else{f.push(a.BLOCK)}}else{f.push(a.EARTH)}}}e.push(f)}this.playerPositions.push({x:0,y:0});this.playerPositions.push({x:this.width-1,y:this.height-1});this.playerPositions.push({x:this.width-1,y:0});this.playerPositions.push({x:0,y:this.height-1});this.data=e};a.prototype.clearSpaceAround=function(c,d){this.data[c][d]=a.EARTH;if(d<this.height-1){this.data[c][d+1]=a.EARTH}if(d>0){this.data[c][d-1]=a.EARTH}if(c>0){this.data[c-1][d]=a.EARTH}if(c<this.width-1){this.data[c+1][d]=a.EARTH}};a.prototype.findPositionFor=function(d){var c=this.playerPositions.shift();if(c){d.moveTo(c.x,c.y);this.clearSpaceAround(c.x,c.y);return true}else{return false}};a.prototype.destroy=function(c,e){var d=this.tileAt(c,e);if(d&&d.destroy){this.data[c][e]=d.destroy()}};a.prototype.inBounds=function(c,d){return !(c<0||c>this.width-1||d<0||d>this.height-1)};a.prototype.tileAt=function(c,d){if(this.inBounds(c,d)){return this.data[c][d]}else{return null}};a.prototype.isFree=function(c,e){var d=this.tileAt(c,e);return d&&!d.solid&&!b.service.FBI.instance.bombAt(c,e)};a.prototype.isPowerUp=function(c,e){var d=this.tileAt(c,e);return d==a.POWERUP};a.prototype.steppedOnLevelUp=function(c,e){var d=this.tileAt(c,e);if(d&&d==a.POWERUP){this.data[c][e]=d.destroy();return true}else{return false}};a.EARTH={solid:false,type:"earth"};a.WALL={solid:true,type:"wall"};a.BLOCK={type:"block",solid:true,destroy:function(){return a.EARTH}};a.POWERUP={type:"powerup",solid:false,destroy:function(){return a.EARTH}};a.HIDDEN_POWERUP={type:"block",solid:true,destroy:function(){return a.POWERUP}};b.model.Map=a})(window.Dyna);(function(a){function b(c,d){log("Creating Lifeform "+c);b.superclass.constructor.call(this);this.name=c;this.skin=d;this.initialise()}Object.extend(b,a.events.CustomEvent);b.prototype.name=null;b.prototype.skin=null;b.prototype.dead=false;b.prototype.x=null;b.prototype.y=null;b.prototype.initialise=function(){a.app.GlobalEvents.on(a.model.Level.EXPLOSION,this.possiblyGetBlownUp.bind(this))};b.prototype.possiblyGetBlownUp=function(c){if(c.affects(this.x,this.y)){this.die()}};b.prototype.move=function(c,d){this.fire(b.WANTS_TO_MOVE,this,c,d)};b.prototype.moveTo=function(c,d){this.x=c;this.y=d;this.fire(b.MOVED)};b.prototype.die=function(){this.dead=true;this.fire(b.DIED)};b.prototype.distanceTo=function(c,d){return Math.abs(this.x-c)+Math.abs(this.y-d)};b.MOVED="moved";b.DIRECTION_CHANGED="directionChanged";b.WANTS_TO_MOVE="wantsToMove";b.DIED="died";a.model.Lifeform=b})(window.Dyna);(function(b){function a(c,d){log("Creating player "+c);a.superclass.constructor.call(this,c,d);this.bombsLaid=0;this.bombsAvailable=2}Object.extend(a,b.model.Lifeform);a.prototype.bombsLaid=0;a.prototype.power=1;a.prototype.bombsAvailable=0;a.prototype.powerUp=function(){this.power++};a.prototype.layBomb=function(){if(this.bombsLaid<this.bombsAvailable){var c=new b.model.Bomb(this.x,this.y,this.power);this.bombsLaid++;c.on(b.model.Bomb.EXPLODE,this._handleMyBombExploded.bind(this));this.fire(a.LAID_BOMB,c)}};a.prototype.move=function(c,e){var d;if(this.x>c){d="west"}else{if(this.x<c){d="east"}else{if(this.y<e){d="south"}else{d="north"}}}a.superclass.move.apply(this,arguments);this.fire(b.model.Lifeform.DIRECTION_CHANGED,d)};a.prototype._handleMyBombExploded=function(){this.bombsLaid--};a.UP="up";a.DOWN="down";a.LEFT="left";a.RIGHT="right";a.ENTER="enter";a.LAID_BOMB="laidBomb";b.model.Player=a})(window.Dyna);(function(a,c){function b(d,e){this.jContainer=c(d);this.bomb=e;this.initialise()}b.prototype.bomb=null;b.prototype.jBomb=null;b.prototype.initialise=function(){this.bomb.on(a.model.Bomb.EXPLODE,this.showExplosion.bind(this));this.jBomb=c("<div class='ticking bomb'></div>").css("left",a.ui.LevelView.tileSize*this.bomb.x).css("top",a.ui.LevelView.tileSize*this.bomb.y).appendTo(this.jContainer)};b.prototype.showExplosion=function(){this.jBomb.removeClass("ticking").addClass("exploded"+(parseInt(Math.random()*3)+1))};a.ui.BombView=b})(window.Dyna,jQuery);(function(a,b){function d(e,g,f){this.ctx=this.createContext(b(e));this.fireballs=this.createExplosion(g,f);this.start=+new Date();this.interval=window.setInterval(this.render.bind(this),1000/24);a.util.Timer.setTimeout(this.destroy.bind(this),d.DURATION);a.util.Sound.play(a.util.Sound.EXPLOSION)}d.prototype.jContainer=null;d.prototype.start=null;d.prototype.ctx=null;d.prototype.fireballs=null;d.prototype.createContext=function(e){this.jContainer=b("<canvas class='explosion'></canvas>").attr("width",e.width()).attr("height",e.width()).appendTo(e);return this.jContainer[0].getContext("2d")};d.prototype.createExplosion=function(j,h){var f,g,e=[];for(f=0;f<j.tilesAffected.length;f++){g=j.tilesAffected[f];if(h.inBounds(g.x,g.y)){e.push(new c(g.x*a.ui.LevelView.tileSize,g.y*a.ui.LevelView.tileSize))}}return e};d.prototype.render=function(){this.clear();var g=this.ctx,h,f=this.fireballs,j=f.length,e=this.getTimeElapsed();for(h=0;h<j;h++){f[h].render(g,e)}};d.prototype.clear=function(){this.ctx.clearRect(0,0,this.jContainer.width(),this.jContainer.height())};d.prototype.getTimeElapsed=function(){return(+new Date()-this.start)/d.DURATION};d.prototype.destroy=function(){window.clearInterval(this.interval);this.jContainer.remove()};d.DURATION=800;function c(e,f){this.x=e;this.y=f}c.prototype.render=function(e,g){var f=a.ui.LevelView.tileSize;e.fillStyle="#FF0000";e.fillRect(this.x,this.y,g*f,g*f)};a.ui.CanvasExplosionView=d})(window.Dyna,jQuery);(function(b,c){function a(d,f,e){this.jContainer=c(d);this.createExplosion(f,e);b.util.Timer.setTimeout(this.destroy.bind(this),a.DURATION)}a.prototype.jContainer=null;a.prototype.jExplosion=null;a.prototype.createExplosion=function(h,g){var d=document.createDocumentFragment();for(var e=0;e<h.tilesAffected.length;e++){var f=h.tilesAffected[e];if(g.inBounds(f.x,f.y)){d.appendChild(a.createFireBall(f.x,f.y))}}this.jExplosion=c("<div></div>").append(d);this.jContainer.append(this.jExplosion);this.boom()};a.createFireBall=function(d,e){return c("<div class='fireBall'></div>").css("left",d*b.ui.LevelView.tileSize).css("top",e*b.ui.LevelView.tileSize)[0]};a.prototype.boom=function(){b.util.Sound.play(b.util.Sound.EXPLOSION)};a.prototype.destroy=function(){this.jExplosion.remove()};a.DURATION=800;b.ui.ExplosionView=a})(window.Dyna,jQuery);(function(b,c){function a(d,e,f){this.jContainer=c(d);this.game=e;this.menuControlFactory=f;this.initialise()}a.prototype.game=null;a.prototype.initialise=function(){b.app.GlobalEvents.on("gameover",this.showGameOverMessage.bind(this))};a.prototype.showGameOverMessage=function(){this.jContainer.removeClass("hidden");this.jContainer.find("h2").text("Game Over");this.menuControlFactory().withItem("Play Again?",this.onPlayAgainPressed.bind(this)).showOn(this.jContainer.find("ul"))};a.prototype.onPlayAgainPressed=function(){window.location.reload()};b.ui.GameOverView=a})(window.Dyna,jQuery);(function(a,b){function c(e,i,d,g,h,f){log("Creating LevelView for  "+i.name);this.jContainer=b(e);this.level=i;this.lifeformViewFactory=g;this.lifeformViews=[];this.mapViewFactory=d;this.mapView=null;this.bombViewFactory=h;this.explosionViewFactory=f;this.initialise()}c.prototype.jContainer=null;c.prototype.level=null;c.prototype.lifeformViewFactory=null;c.prototype.lifeformViews=null;c.prototype.mapViewFactory=null;c.prototype.mapView=null;c.prototype.bombViewFactory=null;c.prototype.explosionViewFactory=null;c.prototype.initialise=function(){log("Initialising level view");c.tileSize=30;this.level.on(a.model.Level.LIFEFORM_ADDED,this._createViewForLifeForm.bind(this));this.level.on(a.model.Level.BOMB_ADDED,this._handleBombLaid.bind(this));this.level.on(a.model.Level.LEVEL_UP,this._handlePlayerLevelUp.bind(this));a.app.GlobalEvents.on(a.model.Level.EXPLOSION,this._handleExplosion.bind(this));this.mapView=this.mapViewFactory(this.level.map)};c.prototype._handleBombLaid=function(d){this.bombViewFactory(d)};c.prototype._handleExplosion=function(d){this.explosionViewFactory(d)};c.prototype._handlePlayerLevelUp=function(d){a.util.Sound.play(a.util.Sound.POWERUP);this.mapView.updateAll(this.level)};c.prototype._createViewForLifeForm=function(d){this.lifeformViews.push(this.lifeformViewFactory(d))};c.prototype.updateAll=function(){this.mapView.updateAll(this.level);for(var d=0;d<this.lifeformViews.length;d++){this.lifeformViews[d].updateAll()}};a.ui.LevelView=c})(window.Dyna,jQuery);(function(b,c){function a(d,e){this.jContainer=c(d);this.map=e;this.initialise()}a.prototype.map=null;a.prototype.jContainer=null;a.prototype.tileTemplate=null;a.prototype.initialise=function(){log("Initialising map view");this.initialiseMap();b.app.GlobalEvents.on(b.model.Level.EXPLOSION,this.updateAll.bind(this))};a.prototype.initialiseMap=function(){this.jContainer.parent().css("width",b.ui.LevelView.tileSize*this.map.width).css("height",b.ui.LevelView.tileSize*this.map.height);this.tileTemplate=c("<div class='tile'></div>")};a.prototype.getTile=function(e,d,f){return this.tileTemplate.clone().addClass(e).css("left",d*b.ui.LevelView.tileSize).css("top",f*b.ui.LevelView.tileSize)};a.prototype.updateAll=function(){var e=document.createDocumentFragment();e.appendChild(this.getTile("wall-corner",-0.33,-0.33)[0]);for(d=0;d<this.map.width;d++){e.appendChild(this.getTile("wall-horizontal",d,-0.33)[0])}e.appendChild(this.getTile("wall-corner",this.map.width,-0.33)[0]);for(var f=0;f<this.map.height;f++){for(var d=0;d<this.map.width;d++){e.appendChild(this.getTile(this.map.tileAt(d,f).type,d,f)[0])}e.appendChild(this.getTile("wall-vertical",-0.333,f)[0]);e.appendChild(this.getTile("wall-vertical",this.map.width,f)[0])}e.appendChild(this.getTile("wall-corner",-0.33,this.map.height)[0]);for(d=0;d<this.map.width;d++){e.appendChild(this.getTile("wall-horizontal",d,this.map.height)[0])}e.appendChild(this.getTile("wall-corner",this.map.width,this.map.height)[0]);this.jContainer.empty().append(e)};b.ui.MapView=a})(window.Dyna,jQuery);(function(a,b){function c(d,e){log("Creating player view for  "+e.name);this.jContainer=b(d);this.player=e;this.initialise()}c.prototype.player=null;c.prototype.jPlayer=null;c.prototype.currentDirection=null;c.prototype.initialise=function(){this.player.on(a.model.Lifeform.MOVED,this.updateAll.bind(this));this.player.on(a.model.Lifeform.DIRECTION_CHANGED,this.changeDirection.bind(this));this.player.on(a.model.Lifeform.DIED,this.handlePlayerDied.bind(this));this.jPlayer=b("<div class='player'></div>").addClass(this.player.skin).appendTo(this.jContainer);b("<div class='nameBadge'></div>").text(this.player.name).appendTo(this.jPlayer);b("<div class='avatar'></div>").appendTo(this.jPlayer)};c.prototype.handlePlayerDied=function(){a.util.Sound.play(a.util.Sound.DIE);this.jPlayer.addClass("dead")};c.prototype.changeDirection=function(d){if(this.currentDirection||this.currentDirection!=d){this.jPlayer.removeClass(this.currentDirection)}this.jPlayer.addClass(d);this.currentDirection=d};c.prototype.updateAll=function(){this.jPlayer.css("left",a.ui.LevelView.tileSize*this.player.x).css("top",a.ui.LevelView.tileSize*this.player.y)};a.ui.PlayerView=c})(window.Dyna,jQuery);(function(b){function a(c){this.player=c;this.initialiseEvents()}a.prototype.player=null;a.prototype.initialiseEvents=function(){this.player.on(b.model.Lifeform.DIED,this.stopControlling.bind(this));b.app.GlobalEvents.on("gameover",this.stopControlling.bind(this))};a.prototype.stopControlling=function(){log("Controller should stop controlling here")};b.app.BasicController=a})(window.Dyna);(function(a){function b(e,h,f,c,d,g){b.superclass.constructor.call(this,e);this.level=h;this.map=f;this.destinationChooser=c;this.bomber=d;this.walker=g;this.initialiseAnimation()}Object.extend(b,a.app.BasicController);b.prototype.map=null;b.prototype.currentPath=null;b.prototype.destinationChooser=null;b.prototype.bomber=null;b.prototype.walker=null;b.prototype.initialiseAnimation=function(){this.interval=window.setInterval(this.think.bind(this),b.SPEED)};b.prototype.think=function(){if(!this.currentPath){this.chooseSomewhereToGo()}this.takeNextStep()};b.prototype.takeNextStep=function(){if(this.currentPath){if(this.currentPath.length){var c=this.currentPath[0],d=this.player.layBomb||this.map.isFree(c.x,c.y);if(this.player.layBomb&&this.bomber.canLayBombOnRoute(this.currentPath,this.player.x,this.player.y,this.player)){this.player.layBomb()}if(this.walker.shouldWalkTo(c.x,c.y,this.player)){if(d){this.player.move(c.x,c.y);this.currentPath.shift()}else{this.currentPath=null}}else{log("Freezing!")}}else{if(this.player.layBomb&&this.bomber.layingBombHereIsAGoodIdea(this.player.x,this.player.y,this.map,this.player)){this.player.layBomb()}this.currentPath=null}}};b.prototype.chooseSomewhereToGo=function(){var d=new a.util.PathFinder(this.map,this.player.x,this.player.y),e=d.getAvailableDestinations(),c=this.destinationChooser.chooseDestinationFrom(d.getAvailableDestinations(),this.level,this.map,this.player);if(c){this.currentPath=d.getPathTo(c.x,c.y);if(!this.currentPath){log(this.player.name+" cannot get to chosen destination",this.player.x,this.player.y,c)}}else{log(this.player.name+" has nowhere to go")}};b.prototype.stopControlling=function(){window.clearInterval(this.interval)};b.SPEED=500;a.app.ComputerController=b})(window.Dyna);(function(a){function b(c){b.instance=this;this.intelligence={};this.level=c;this.level.on(a.model.Level.BOMB_ADDED,this.handleBombThreat.bind(this))}b.prototype.level=null;b.prototype.intelligence=null;b.prototype.handleBombThreat=function(c){log("FBI has had a report of a bomb threat at "+c.id);this.intelligence[c.id]={bomb:c,explosion:a.model.Explosion.create(this.level.map,c.x,c.y,c.power)};c.on(a.model.Bomb.EXPLODE,this.handleBombExplosion.bind(this))};b.prototype.handleBombExplosion=function(c,f,d,e){log("FBI standing down at",e.id);delete this.intelligence[e.id]};b.prototype.estimateDangerAt=function(d,f){var e,c;for(e in this.intelligence){c=this.intelligence[e];if(c.bomb.at(d,f)||c.explosion.affects(d,f)){return 1}}return 0};b.prototype.bombAt=function(d,f){var e,c;for(e in this.intelligence){c=this.intelligence[e];if(c.bomb.at(d,f)){return true}}return false};b.instance=null;a.service.FBI=b})(window.Dyna);(function(a){function b(d,c){this.level=d;this.levelView=c;this.players=[];this._initialiseEvents()}b.prototype.level=null;b.prototype.levelView=null;b.prototype.players=null;b.prototype._initialiseEvents=function(){this.level.on(a.model.Level.ENDED,this.gameOver.bind(this));a.app.GlobalEvents.on("pause",this.pause.bind(this))};b.prototype.gameOver=function(c){log("Game Over",c);a.app.GlobalEvents.fire("gameover")};b.prototype.pause=function(){log("Game paused")};b.prototype.start=function(){log("Starting Dyna Game on level "+this.level.name);a.app.GlobalEvents.fire("gamestarted");this.levelView.updateAll()};a.app.Game=b})(window.Dyna);(function(b){function a(c){a.superclass.constructor.call(this,c)}Object.extend(a,b.app.BasicController);a.prototype.keyboardInput=null;a.prototype.withControls=function(c){var d=this.movePlayerTo;this.keyboardInput=c;c.on(b.model.Player.UP,d.bind(this,0,-1));c.on(b.model.Player.DOWN,d.bind(this,0,+1));c.on(b.model.Player.LEFT,d.bind(this,-1,0));c.on(b.model.Player.RIGHT,d.bind(this,+1,0));c.on(b.model.Player.ENTER,this.player.layBomb.bind(this.player));return this};a.prototype.movePlayerTo=function(d,c){this.player.move(this.player.x+d,this.player.y+c)};a.prototype.stopControlling=function(){if(this.keyboardInput){this.keyboardInput.unsubscribeAll()}};b.app.HumanController=a})(window.Dyna);(function(b){function a(){}a.prototype.layingBombHereIsAGoodIdea=function(c,g,f,d){if(d.bombsLaid>0){return false}var e=b.model.Explosion.create(f,c,g,d.power);return e.blocksAffected>0};a.prototype.canLayBombOnRoute=function(d,c,f,e){return false};b.ai.Bomber=a})(window.Dyna);(function(a){function b(c){this.weights=c}b.prototype.weights=null;b.prototype.chooseDestinationFrom=function(h,k,g,f){var j=-1000,c,e;for(var d=0;d<h.length;d++){c=h[d];c.score=this.getScoreForDestination(c.x,c.y,k,g,f);if(c.score>j){j=c.score;e=c}}return e};b.prototype.getScoreForDestination=function(c,j,i,g,e){var h=0,d,f;for(d in this.weights){f=this.weights[d];h+=this[d](c,j,i,g,e)*f}return h};b.prototype.getDistanceToClosestPlayer=function(j,h,d,e,g){var k=d.maxDistance,l,f;for(f=0;f<e.length;f++){l=e[f];if(l!==g){var c=l.distanceTo(j,h);if(c<k){k=c}}}return k/d.maxDistance};b.prototype.BREAK_WALLS=function(c,h,g,f,d){var e=a.model.Explosion.create(f,c,h,d.power);return e.blocksAffected};b.prototype.IS_POWER_UP=function(c,g,f,e,d){return e.isPowerUp(c,g)?1:0};b.prototype.CLOSE_TO_OTHER_PLAYERS=function(c,g,f,e,d){return 1-this.getDistanceToClosestPlayer(c,g,e,f.players,d)};b.prototype.SAME_AS_CURRENT_POSITION=function(c,g,f,e,d){return(c==d.x&&g==d.y)?1:0};b.prototype.IN_DANGER_OF_EXPLOSION=function(c,g,f,e,d){return a.service.FBI.instance.estimateDangerAt(c,g)?1:0};b.prototype.RANDOM=function(c,g,f,e,d){return Math.random()};a.ai.DestinationChooser=b})(window.Dyna);(function(a){function b(c){this.fbi=c}b.prototype.fbi=null;b.prototype.shouldWalkTo=function(c,e,d){return !this.fbi.estimateDangerAt(c,e)||this.fbi.estimateDangerAt(d.x,d.y)};a.ai.Walker=b})(window.Dyna);(function(b,c){function a(d){this.items=[];d.on(a.UP,this.moveSelection.bind(this,a.UP));d.on(a.DOWN,this.moveSelection.bind(this,a.DOWN));d.on(a.SELECT,this.chooseSelection.bind(this))}a.prototype.jMenu=null;a.prototype.items=null;a.prototype.withItem=function(d,e){this.items.push({text:d,callback:e});return this};a.prototype.moveSelection=function(d){var f=this.jMenu.find(".selected").removeClass("selected"),e=d.getNext(f);if(!e.length){e=d.getFirst(this.jMenu.find("li"))}e.addClass("selected")};a.prototype.chooseSelection=function(){b.util.Sound.play(b.util.Sound.SELECT);this.jMenu.find(".selected").click()};a.prototype.showOn=function(f){this.jMenu=f;var e,d,g;this.jMenu.empty();for(e=0,d=this.items.length;e<d;e++){g=this.items[e];if(!this.selectedItem){this.selectedItem=g}f.append(a.createMenuItem(g.text,g.callback,g===this.selectedItem))}return this};a.createMenuItem=function(e,f,d){return c("<li></li>").text(e).click(f).toggleClass("selected",d)};a.UP={getNext:function(d){return d.prev()},getFirst:function(d){return d.last()}};a.DOWN={getNext:function(d){return d.next()},getFirst:function(d){return d.first()}};a.SELECT="select";b.ui.MenuControl=a})(window.Dyna,jQuery);(function(a){function b(){log("Initialising DynaJS");a.app.GlobalEvents=new a.events.CustomEvent();var v=a.model.Player;a.util.Timer.initialise();var g=new a.util.Keyboard();var A=new a.model.Map(11,11,{blocks:0.75,powerups:0.1}),d=new a.model.Level("Level 1",A),s=new a.service.FBI(d);var e=function(D){return new a.ui.MapView("#level .map",D)},c=function(D){return new a.ui.PlayerView("#level .players",D)},i=function(D){return new a.ui.BombView("#level .players",D)},j=function(D){return new a.ui.CanvasExplosionView("#level",D,A)},C=new a.ui.LevelView("#level",d,e,c,i,j);var x=a.ui.MenuControl,z=function(){return new x(new a.util.KeyboardInput(g,{up:x.UP,down:x.DOWN,enter:x.SELECT}))};var B=new a.app.Game(d,C),n=new a.ui.GameOverView(".menuContainer",B,z),r=new v("Computer 1","redplayer"),q=new v("Player 2","blueplayer"),h=new a.model.Lifeform("Mushtopus","mushtopus"),f=new a.model.Lifeform("Lizardcat","lizardcat"),t=new a.ai.DestinationChooser({BREAK_WALLS:1,IS_POWER_UP:10,CLOSE_TO_OTHER_PLAYERS:2,SAME_AS_CURRENT_POSITION:-2,IN_DANGER_OF_EXPLOSION:-20}),o=new a.ai.DestinationChooser({SAME_AS_CURRENT_POSITION:-2,RANDOM:1}),u=new a.ai.DestinationChooser({CLOSE_TO_OTHER_PLAYERS:2,SAME_AS_CURRENT_POSITION:-2,IN_DANGER_OF_EXPLOSION:-20}),y=new a.ai.Bomber(),w=new a.ai.Walker(s),m=new a.app.ComputerController(r,d,A,t,y,w),l=new a.app.ComputerController(h,d,A,u,y,w),k=new a.app.ComputerController(f,d,A,o,y,w),p=new a.app.HumanController(q).withControls(new a.util.KeyboardInput(g,{up:v.UP,down:v.DOWN,left:v.LEFT,right:v.RIGHT,enter:v.ENTER}));d.addPlayer(r);d.addPlayer(q);d.addMonster(h);d.addMonster(f);B.start()}jQuery(document).ready(b)})(window.Dyna);