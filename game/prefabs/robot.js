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

var Robot = function(game, x, y, frame) {
  this.currentTile = {x: x, y: y};
  
  Phaser.Sprite.call(this, game, x * 32 + 16, y * 32 + 16, 'robot', frame);

  this.speed = 1;
  this.rotationSpeed = 0.02 * Math.PI;
  this.previous_position;
  this.anchor.setTo(0.5, 0.5);
  this.startlocation = new Phaser.Point(x, y);

  this.currentDestination = null;
  
  var EasyStar = require("../../bower_components/easystarjs");
      
  this.easyStar = new EasyStar.js();
  
  this.path = [];
  
  this.currentIndexInPath = 0;
  
  this.currentTarget = null;
};

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
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
    
    direction.setMagnitude(Math.min(this.speed, magnitude));
    
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

    this.currentIndex++;
    
    if (this.currentIndex < this.path.length) {
      this.setCurrentTargetForTile(this.path[this.currentIndex].x, this.path[this.currentIndex].y);
    } else {
      console.log("Path ended");
      this.path = null;
    }
}

Robot.prototype.setCurrentTargetForTile = function (tileX, tileY) {
  this.currentTarget = new Phaser.Point(tileX * 32 + 16, tileY * 32 + 16);
}

Robot.prototype.setDestination = function(x, y) {
  this.currentDestination = {x: x, y: y};
  
  this.easyStar.setGrid(  this.game.collisionData );
      
  this.easyStar.setAcceptableTiles([0]);
      
  this.easyStar.findPath(this.currentTile.x, this.currentTile.y, this.currentDestination.x, this.currentDestination.y, (function( path ) {
      if (path === null) {
          console.log("No path!");
          
          this.path = [];
      } else {
          this.path = path;
          this.currentIndex = 0;
          
          console.log("I found a path!")
          
          this.updatePath();
      }
  }).bind(this));
  
  this.easyStar.setIterationsPerCalculation(10000000000);
    
  this.easyStar.calculate();
}


module.exports = Robot;
