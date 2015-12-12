'use strict';

var Hud = function() {
    this.template = require('./templates/hud.json');
};

Hud.prototype = Object.create(Object.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.setupGUI = function() {
    var self = this;
    
    EZGUI.Theme.load(['../../assets/EZGUI/kenney-theme/kenney-theme.json'], function () {
	    //EZGUI.themes['metalworks'].override(themeOverride);
		
		var fakeGameScreen = EZGUI.create(self.template, 'kenney');
		fakeGameScreen.visible = true;
	});
};

module.exports = Hud;
