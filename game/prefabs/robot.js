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
  this.rotationSpeed = 0.1 * Math.PI;
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
  var directionAngle = Phaser.Point.angle(ZeroPoint, direction);

  // Floating point is vervelend
  if(Math.abs(directionAngle - this.rotation) < 0.01) {
    this.rotation = directionAngle;
  }
  
  // Update rotation if needed.
  if(this.rotation != directionAngle) {
    console.log("rotating... current angle: " + this.rotation + "; directionAngle: " + directionAngle);
    // Not in right rotation, rotate!
    if(!isNaN(this.rotation)) {
      console.log("this.rotation=" + this.rotation + "; directionAngle=" + directionAngle + "; directionAngle - this.rotation=" + (directionAngle - this.rotation));
      
      var rotateAngle = normalizeAngle(directionAngle - this.rotation);
      console.log("rotateAngle=" + rotateAngle + "; rotationSpeed=" + this.rotationSpeed);
      rotateAngle = Math.min(this.rotationSpeed, rotateAngle);
      
      console.log("this.rotation=" + this.rotation + "; rotateAngle=" + rotateAngle + "; new angle: " + (this.rotation + rotateAngle));
      
      this.rotation = normalizeAngle(this.rotation + rotateAngle);
    }
  } else {
    // Right rotation, drive!
    console.log("driving...");
  
    var magnitude = direction.getMagnitude();
    
    direction.setMagnitude(Math.min(this.speed, magnitude));
    
    Phaser.Point.add(this.position, direction, this.position);
    
    // Floating point is vervelend
    if(Phaser.Point.subtract(this.currentTarget, this.position).getMagnitude() < 0.01) {
      this.position = this.currentTarget;
    }
    
    if(this.position == this.currentTarget) {
      console.log("Target " + this.currentTarget + " reached");
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
  
  this.easyStar.setIterationsPerCalculation(1000);
    
  this.easyStar.calculate();
}


module.exports = Robot;
