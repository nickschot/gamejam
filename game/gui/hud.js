'use strict';

var Hud = function(robots) {
    this.robots = robots;
    
    this.templates = {};
    this.templates.hud = require('./templates/hud.json');
    this.templates.robots = require('./templates/robots.json');
    
    this.hudWindow = {};
    this.robotsWindow = {};
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
		
		self.robotsWindow = EZGUI.create(self.templates.robots, self.theme);
		self.robotsWindow.visible = false;
		self.robots.forEach(function(robot, index){
            self.addRobotToList(robot, index);
        });
        
		self.initBinds();
	});
};

Hud.prototype.initBinds = function() {
    var self = this;
    
    EZGUI.components.robotsButton.on('click', function(event, me) {
       self.robotsWindow.visible = !self.robotsWindow.visible;
    });
};

Hud.prototype.addRobotToList = function(robot, index) {
    var currentElem = EZGUI.create({   
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
    }, this.theme);
    
    EZGUI.components.levelsList.addChild(currentElem, index);
    
    var self = this;
    console.log(EZGUI.components.robot0Button);
    EZGUI.components.robot0Button.on('click', function(event, me) {
        console.log('ADASdasdasdasdASDASD');
       self.robotsWindow.visible = !self.robotsWindow.visible;
    });
}

module.exports = Hud;
