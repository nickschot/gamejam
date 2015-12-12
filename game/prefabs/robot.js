'use strict';

var Robot = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'robot', frame);

  this.speed = 1;
  this.previous_position;
  
  
};

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Robot;
