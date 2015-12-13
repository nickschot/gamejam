'use strict';

var City = function(game, x, y, frame) {
  this.position = new Phaser.Point(x, y);
  
  this.storage = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  };
  
  // TODO FInd airlock
  this.airlock = {'position': new Phaser.Point(53,66)};  

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


module.exports = City;
