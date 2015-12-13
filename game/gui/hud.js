'use strict';

var Hud = function(game, robots, tech, stats) {
    this.game   = game;
    this.robots = robots;
    this.tech   = tech;
    this.stats  = stats;
    
    this.templates          = {};
    this.templates.hud      = require('./templates/hud.json');
    this.templates.menu     = require('./templates/menu.json');
    this.templates.robots   = require('./templates/robots.json');
    this.templates.tech     = require('./templates/tech.json');
    this.templates.stats    = require('./templates/stats.json');
    
    this.hudWindow      = {};
    this.robotsWindow   = {};
    this.techWindow     = {};
    
    this.robotsList = [];
    
    this.theme = 'kenney';
};

Hud.prototype = Object.create(Object.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.setupGUI = function() {
    var self = this;
    
    EZGUI.Theme.load(['../../assets/EZGUI/'+this.theme+'-theme/'+this.theme+'-theme.json'], function () {
	    //EZGUI.themes['metalworks'].override(themeOverride);
		
		self.hudWindow = EZGUI.create(self.templates.hud, self.theme);
		self.hudWindow.visible = true;
        
        self.renderMenuView();
        self.renderRobotsView();
        self.renderTechView();
        self.renderStatsView();
        
		self.initBinds();
	});
};

Hud.prototype.initBinds = function() {
    var self = this;
    
    //Window control
    EZGUI.components.menuButton.on('click', function(event, me) {
        var visible = !self.menuWindow.visible;
        self.hideWindows();
        self.menuWindow.visible = visible;
    });
    EZGUI.components.robotsButton.on('click', function(event, me) {
        var visible = !self.robotsWindow.visible;
        self.hideWindows();
        self.robotsWindow.visible = visible;
    });
    EZGUI.components.techButton.on('click', function(event, me) {
        var visible = !self.techWindow.visible;
        self.hideWindows();
        self.techWindow.visible = visible;
    });
    EZGUI.components.statsButton.on('click', function(event, me) {
        var visible = !self.statsWindow.visible;
        self.hideWindows();
        self.statsWindow.visible = visible;
    });
    
    EZGUI.components.quitButton.on('click', function(event, me){
        self.hideWindows();
        self.hudWindow.visible = false;
        self.game.state.start('menu');
    });
	
	//Add a click handler to each robot button
	this.robots.forEach(function(robot, index){
	    EZGUI.components['robot'+index+'Button'].on('click', function(event, me) {
            console.log('Opening detailed view for robot '+index);
        });
	});
};

Hud.prototype.hideWindows = function(){
    this.menuWindow.visible     = false;
    this.robotsWindow.visible   = false;
    this.techWindow.visible     = false;
    this.statsWindow.visible    = false;
};

Hud.prototype.renderMenuView = function(){
    this.menuWindow = EZGUI.create(this.templates.menu, this.theme);
	this.menuWindow.visible = false;
};

//TODO: call this whenever a robot is added
Hud.prototype.renderRobotsView = function(){
    var self = this;
    
    //Empty the list of robots and add all current robots to the template
    this.templates.robots.children[0].children[1].children = [];
	this.robots.forEach(function(robot, index){
        var currentElem = {   
            id: 'robot'+index+'Entry',
            component: 'Layout',
            layout: [3,1],
            position: { x: 10, y: 10 },
            width: 275,
            height:50,
            children: [
                {
                    id: 'robot'+index+'Name',
                    component: 'Label',
                    text: 'ROBOT '+index,
                    width: 100,
                    height: 50,
                    position: 'center'
                },
                {
                    id: 'robot'+index+'Status',
                    component: 'Label',
                    text: 'LIVE',
                    font: {
                        color: 'green'
                    },
                    width: 100,
                    height: 50,
                    position: 'center'
                },
                {
                    id: 'robot'+index+'Button',
                    component: 'Button',
                    text: 'open',
                    width: 75,
                    height: 30,
                    position: 'center',
                    font: {
                        size: '16px'
                    }
                }
            ]
        };
        
        self.templates.robots.children[0].children[1].children.push(currentElem);
    });  
    
    //Destroy the old view;
    if(this.robotsWindow && !this.robotsWindow === {}){
        this.robotsWindow.destroy();
    }
    
    //Create the new view from the new edited template
    this.robotsWindow = EZGUI.create(this.templates.robots, this.theme);
	this.robotsWindow.visible = false;
};

Hud.prototype.renderTechView = function(){
    this.techWindow = EZGUI.create(this.templates.tech, this.theme);
	this.techWindow.visible = false;
};

Hud.prototype.renderStatsView = function(){
    this.statsWindow = EZGUI.create(this.templates.stats, this.theme);
	this.statsWindow.visible = false;
};

module.exports = Hud;
