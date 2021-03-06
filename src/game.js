var util = require('util'),
    Jarsmith = require('../jarsmith/lib/jarsmith'),
    keyboard = Jarsmith.keyboard,
    Scene = Jarsmith.Scene;

var $;

var Game = function(engine, events) {
	Scene.apply(this, [engine, events]);
	var self = this;
	$ = this.$;
	//this.s = 
	this.leftmenu = null;
	
	this.guys = [];
	engine.loadResources('game', function(s) {
		var engine = s.engine;
		
		$(s.body).attr('texture', 'gamebg');
		
		s.leftmenu = $('<obj>',  {
			width: 143,
			height: 627,
			texture: "leftmenu",
			left: 0,
			top: 60,
		}).delay(500)
		  .animate({left: -130}, 200, "swing")
		  .data('state', 0)
		  .appendTo(s.body);
		var put = function() {
			var obj = $('<obj>',  {
				width: 50,
				height: 50,
				left: Math.random()*1024,
				top: Math.random()*768,
				texture: 'guy1',
			});
			s.guys.push(obj);
			obj
				.animate({
					width: 100,
					height: 100
				}, 100)
				.animate({
					width: 50,
					height: 50
				}, 100)
				.animate({
					rotation: 100,
					top: obj.attr('top') + Math.random()*400-200,
					left: obj.attr('left') + Math.random()*400-200
				}, 1000)
				.animate({
					rotation: -180,
					top: obj.attr('top') + Math.random()*500-250,
					left: obj.attr('left') + Math.random()*500-250
				}, Math.random()*5000+1000, "linear")
				.animate({
					rotation: 360,
					top: obj.attr('top') + Math.random()*500-250,
					left: obj.attr('left') + Math.random()*500-250
				}, Math.random()*5000+1000, "linear")
				.appendTo($('body'));
		};
		put();put();put();put();put();put();put();put();
	}, this);

	
	events.on('KEYUP', function(event){self.keyup.apply(self, [event]);});
};

util.inherits(Game, Scene);

Game.prototype.keyup = function(event) {
	switch (event.sym) {
    case keyboard.tab:
			this.toggleLeftMenu();
			break;
	}
}

Game.prototype.toggleLeftMenu = function() {
	var menu = this.leftmenu;
	if (!menu)
		return;
	menu.stop(true);
	if (menu.data('state') == 0) { // closed
		menu.animate({left: 0}, 100, "swing")
			.data('state', 1);
	} else {
		menu.animate({left: -130}, 200, "swing")
			.data('state', 0);
	}
}

module.exports = Game;
