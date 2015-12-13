'use strict';

function normalizeAngle(angle) {
  var result = angle;
  if(angle > Math.PI) {
    result = angle - 2*Math.PI;
  }
  if(angle <= -Math.PI) {
    result = angle + 2*Math.PI;
  }
  return result;
}

var MineCommand = require("../prefabs/mineCommand");
var Utils = require("../utils");

var Robot = function(game, x, y, frame) {
  this.currentTile = {x: x, y: y};
  
  Phaser.Sprite.call(this, game, x * 32 + 16, y * 32 + 16, 'robot', frame);

  this.rotationSpeed = 0.02 * Math.PI;
  this.previous_position;
  this.anchor.setTo(0.5, 0.5);
  this.startlocation = new Phaser.Point(x, y);

  var EasyStar = require("../../bower_components/easystarjs");
      
  this.easyStar = new EasyStar.js();
  
  // Pathfinding
  this.currentDestination = null;
  this.path = [];
  this.currentIndexInPath = 0;
  this.currentTarget = null;
  this.hasFailedPathing = false;
  this.hasFinishedPathing = true;
  
  // Home city TODO
  this.city = null;
  
  this.inventory = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  }
  
  this.maxCapacity = 100;

  // Commands
  this.command = new MineCommand(this.game, this, 'iron');
};

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
  this.moveToCurrentTarget();
  
  if(this.command) {
    this.command.update();
  }
};

Robot.prototype.moveToCurrentTarget = function() {
  if (!this.currentTarget) return;
  
  var ZeroPoint = new Phaser.Point(0, 0);
  
  var direction = Phaser.Point.subtract(this.currentTarget, this.position);
  var directionAngle = Phaser.Point.angle(direction, ZeroPoint);

  // Floating point is vervelend
  if(Math.abs(directionAngle - this.rotation) < 0.0001) {
    this.rotation = directionAngle;
  }
  
  // Update rotation if needed.
  if(this.rotation != directionAngle) {
    // Not in right rotation, rotate!
    var rotateAngle = normalizeAngle(directionAngle - this.rotation);
    if(rotateAngle < 0) {
      rotateAngle = Math.max(-this.rotationSpeed, rotateAngle);
    } else {
      rotateAngle = Math.min(this.rotationSpeed, rotateAngle);
    }

    this.rotation = normalizeAngle(this.rotation + rotateAngle);
  } else {
    // Right rotation, drive!

    var magnitude = direction.getMagnitude();
    
    direction.setMagnitude(Math.min(1.0 + this.game.techTree.getValueModification('drivingSpeed'), magnitude));
    
    Phaser.Point.add(this.position, direction, this.position);
    
    // Floating point is vervelend
    if(Phaser.Point.subtract(this.currentTarget, this.position).getMagnitude() < 0.0001) {
      this.position = this.currentTarget;
    }
    
    if(this.position == this.currentTarget) {
      this.currentTarget = null;
      this.updatePath();
    }
  }
};

Robot.prototype.updatePath = function () {
    if (!this.path) return;
    
    // Update current tile.
    this.currentTile = new Phaser.Point(this.path[this.currentIndex].x, this.path[this.currentIndex].y);

    this.currentIndex++;
    
    if (this.currentIndex < this.path.length) {
      this.setCurrentTargetForTile(this.path[this.currentIndex].x, this.path[this.currentIndex].y);
    } else {
      this.hasFinishedPathing = true;
      this.path = null;
    }
};

Robot.prototype.setCurrentTargetForTile = function (tileX, tileY) {
  this.currentTarget = new Phaser.Point(tileX * 32 + 16, tileY * 32 + 16);
};


Robot.prototype.setDestination = function(x, y) {
  this.setDestinationPoint({x: x, y: y});
};

Robot.prototype.setDestinationPoint = function(destination) {
  this.hasFailedPathing = false;
  this.hasFinishedPathing = false;

  this.currentDestination = destination;
  
  this.easyStar.setGrid(this.game.collisionData);
      
  this.easyStar.setAcceptableTiles([0]);
      
  this.easyStar.findPath(this.currentTile.x, this.currentTile.y, this.currentDestination.x, this.currentDestination.y, (function( path ) {
      if (path === null || path.length < 2) {
          console.log("No path!");
          this.hasFailedPathing = true;
          this.path = [];
      } else {
          this.path = path;
          this.currentIndex = 0;
          
          console.log("I found a path!");
          
          this.updatePath();
      }
  }).bind(this));
  
  this.easyStar.setIterationsPerCalculation(10000000000);
    
  this.easyStar.calculate();
};

Robot.prototype.clearDestination = function () {
  this.currentDestination = null;
  this.path = [];
  this.currentIndexInPath = 0;
  this.currentTarget = null;
};

Robot.prototype.resourceCount = function () {
  var count = 0;
  
  for (var key in this.inventory) {
    if (this.inventory.hasOwnProperty(key)) {
      count += this.inventory[key];
    }
  }
  
  return count;
};
  
Robot.prototype.getCapacity = function () {
  return Math.max(this.getMaxCapacity() - this.resourceCount(), 0);
};

Robot.prototype.addResource = function (type, count) {
  this.inventory[type] += count;
};

Robot.prototype.isFull = function () {
  return this.getCapacity() == 0;
};

Robot.prototype.isEmpty = function () {
  return this.resourceCount() == 0;
};

Robot.prototype.removeResource = function (type, count) {
  this.inventory["resource"] -= count;
};

Robot.prototype.getMaxCapacity = function () {
  return this.maxCapacity + this.game.techTree.getValueModification('storageSize');
}

Robot.prototype.emptyToCity = function (city) {
  for (var key in this.inventory) {
    if (this.inventory.hasOwnProperty(key)) {
      city.storage[key] += this.inventory[key];
      this.inventory[key] = 0;
    }
  }
};

Robot.prototype.changeCommand = function (bits) {
  this.clearDestination();
  this.command = Utils.bitsToCommand(this.game, this, bits);
}

module.exports = Robot;
