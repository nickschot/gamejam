'use strict';

var Hud = function(robots) {
    this.robots = robots;
    
    this.templates = {};
    this.templates.hud = require('./templates/hud.json');
    this.templates.robots = require('./templates/robots.json');
    
    this.hudWindow = {};
    this.robotsWindow = {};
};

Hud.prototype = Object.create(Object.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.setupGUI = function() {
    var self = this;
    
    EZGUI.Theme.load(['../../assets/EZGUI/kenney-theme/kenney-theme.json'], function () {
	    //EZGUI.themes['metalworks'].override(themeOverride);
		
		self.hudWindow = EZGUI.create(self.templates.hud, 'kenney');
		self.hudWindow.visible = true;
		
		self.robotsWindow = EZGUI.create(self.templates.robots, 'kenney');
		self.robotsWindow.visible = false;
		
		self.initBinds();
	});
};

Hud.prototype.initBinds = function() {
    var self = this;
    
    EZGUI.components.robotsButton.on('click', function(event, me) {
       self.robotsWindow.visible = !self.robotsWindow.visible;
    });
};

Hud.prototype.update = function() {
    if(this.robotsWindow.visible){
        console.log(this.robots);
    }
}

module.exports = Hud;
