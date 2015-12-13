'use strict';


var Robot = require("../prefabs/robot");
  
var City = function(game, x, y, frame) {
  this.game = game;
  this.position = new Phaser.Point(x, y);
  
  this.storage = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  };
  
  // TODO FInd airlock
  this.airlock = {'position': new Phaser.Point(61,64)};
  // initialize your prefab here
  
};

City.prototype = Object.create(Object.prototype);
City.prototype.constructor = City;

City.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};


City.prototype.transferResource = function (robot) {
  for (var key in this.inventory) {
    if (robot.inventory.hasOwnProperty(key)) {
      this.storage[key] += robot.inventory[key];
      
      robot.inventory[key] = 0;
    }
  }
};

City.prototype.buyRobot = function () {
  if (this.game.techTree.hasAchieved('robotFactory')) {
    if (this.storage["iron"] >= 500 && this.storage["plastic"] >= 500) {
      this.storage["iron"] -= 500;
      this.storage["plastic"] -= 500;
      
      this.addRobot();
      
      return true;
    }
  }
  
  return false;
}


    
City.prototype.initRobot = function(){
  this.robots = [];
  this.addRobot();
};
    
City.prototype.addRobot = function () {
  var robot = new Robot(this.game, 64, 64);
  this.robots.push(robot);
  this.game.add.existing(robot);
  
}


module.exports = City;
