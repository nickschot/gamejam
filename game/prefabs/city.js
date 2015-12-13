'use strict';

var City = function(game, x, y, frame) {
  var center = Phaser.Sprite.call(this, game, x, y, 'city', 0);
  this.sprites = [1,2,1,2,0,2,1,2,1];
  var i=0;
  var self = this;
  this.sprites.forEach(function(sprite) { 
    var sx = (i%3-1)*game.TILESIZE;
    var sy = (Math.floor(i/3)-1)*game.TILESIZE;
    console.log(sx,sy);
    var s = self.addChild(new Phaser.Sprite(game, sx,sy,'city',sprite));
    s.anchor.setTo(0.5, 0.5);
    if(sy==0)
      s.angle=90;
    i++;
  });
  
  this.storage = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  }
  
  // TODO FInd airlock
  this.airlock = null;  
  

  // initialize your prefab here
  
};

City.prototype = Object.create(Phaser.Sprite.prototype);
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
}


module.exports = City;
