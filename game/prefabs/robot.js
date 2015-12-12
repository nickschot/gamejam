'use strict';

var Robot = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'robot', frame);

  this.speed = 1;
  this.previous_position;
  this.anchor.setTo(0.5, 0.5);
  this.startlocation = new Phaser.Point(x,y);
  this.direction = 0;
  
};

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
  
  if(this.direction == 0) {
    this.y += this.speed;
  } else if(this.direction == 1) {
    this.x += this.speed;
  } else if(this.direction == 2) {
    this.y -= this.speed;
  } else if(this.direction == 3) {
    this.x -= this.speed;
  }
  var relx = Math.abs(this.position.x-this.startlocation.x);
  var rely = Math.abs(this.position.y-this.startlocation.y);
  if((this.direction == 0 || this.direction == 2) && rely % 16 === 0 ) {
    this.direction = Math.floor(Math.random()*4);
  } else if((this.direction == 1 || this.direction == 3) && relx % 16 === 0 ) {
    this.direction = Math.floor(Math.random()*4);
  }
  
  
};

module.exports = Robot;
