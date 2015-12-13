'use strict';

var Hud = function(game, tech, stats) {
    this.game   = game;
    this.tech   = tech;
    this.city   = game.city;
    
    this.templates          = {};
    this.templates.hud      = require('./templates/hud.json');
    this.templates.menu     = require('./templates/menu.json');
    this.templates.robots   = require('./templates/robots.json');
    this.templates.tech     = require('./templates/tech.json');
    this.templates.stats    = require('./templates/stats.json');
    
    this.hudWindow      = {};
    this.robotsWindow   = {};
    this.techWindow     = {};
    this.statsWindow    = {};
    
    this.robotsList = [];
    
    this.currentRobotDetailView = {};
    
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
	this.game.city.robots.forEach(function(robot, index){
	    EZGUI.components['robot'+index+'Button'].on('click', function(event, me) {
            console.log('Opening detailed view for robot '+index);
            self.currentRobotDetailView = {robot, index};
        });
	});
};

Hud.prototype.update = function(){
    this.showRobotDetailView();
    this.updateStats();
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
	this.game.city.robots.forEach(function(robot, index){
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

Hud.prototype.showRobotDetailView = function(){
    if(this.robotsWindow.visible && this.currentRobotDetailView.robot){
        var robot = this.currentRobotDetailView.robot;
        var index = this.currentRobotDetailView.index;

        var headerLabel = EZGUI.components.robotDetailHeader;
        var inventory = EZGUI.components.robotDetailInventory;
        var inventoryStatus = EZGUI.components.robotDetailInventoryStatus;
        
        var inventoryCount = 0;
        var keyIndex = 0;
        inventory.container.children = [];
        for (var key in robot.inventory) {
            if (robot.inventory.hasOwnProperty(key)) {
                inventoryCount += robot.inventory[key];
                
                var invItem = EZGUI.create({
                    component: 'Label',
                    text: key + ': ' + robot.inventory[key],
                    width: 100,
                    height: 40,
                    position: {x:0, y:40*keyIndex}
                }, this.theme);
                
                inventory.addChild(invItem);
            }
            keyIndex++;
        }
        
        headerLabel.text = 'Robot '+index;
        inventoryStatus.text = inventoryCount + '/' + robot.getMaxCapacity();
    }
};

Hud.prototype.renderTechView = function(){
    this.techWindow = EZGUI.create(this.templates.tech, this.theme);
	this.techWindow.visible = false;
};

Hud.prototype.renderStatsView = function(){
    this.statsWindow = EZGUI.create(this.templates.stats, this.theme);
	this.statsWindow.visible = false;
};

Hud.prototype.updateStats = function(){
    if(this.statsWindow.visible){
        var self = this;
        var resources = this.city.storage;
        
        //Remove current stats
        EZGUI.components.statsDetailLayout.container.children = [];
        
        //Amount of robots
        var robotStats = EZGUI.create({
                    component: 'Label',
                    text: 'robots: ' + self.robotsList.length,
                    width: 310,
                    height: 40,
                    position: {x:0, y:0}
                }, this.theme);
                
        //Add two empty elements and the robot stats
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({component: 'Label', position: {x:0,y:0}}, this.theme));
        EZGUI.components.statsDetailLayout.addChild(robotStats);
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({component: 'Label', position: {x:0,y:0}}, this.theme));
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({
            component: 'Label', 
            text: 'Resources', 
            position: 'center',
            width: 300,
            height: 40,
            font: {
		        size: '24px',
		        family: 'Arial'
		    }
        }, this.theme));
        
        //Add city resources
        var keyIndex = 0;
        for (var key in resources) {
            if (resources.hasOwnProperty(key)) {
                var invItem = EZGUI.create({
                    component: 'Label',
                    text: key + ': ' + resources[key],
                    width: 310,
                    height: 40,
                    position: {x:0, y:0}
                }, this.theme);
                
                EZGUI.components.statsDetailLayout.addChild(invItem);
            }
            keyIndex++;
        }
    }
}

module.exports = Hud;
