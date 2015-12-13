'use strict';

var Fog = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'fog', frame);
  this.fogTiles = []
  this.game = game;
  this.updates = 0;
  game.map.createBlankLayer('fog', game.map.width,game.map.height, 32, 32);
  game.map.addTilesetImage('fog');
  for(var x = 0; x < this.game.map.width; x++) {
    this.fogTiles[x] = []
    for(var y = 0; y < this.game.map.height; y++) {
      //game.map.putTile(0,x,y,'fog');
      this.fogTiles[x][y] = new Phaser.Sprite(game, x * this.game.map.tileWidth , y * this.game.map.tileHeight,'fog');
      this.fogTiles[x][y].alpha = 0.9;
      this.addChild(this.fogTiles[x][y]);
    }
  }
  console.log('FOG',this.fogTiles);
};

Fog.prototype = Object.create(Phaser.Sprite.prototype);
Fog.prototype.constructor = Fog;

Fog.prototype.update = function() {
  this.updates++;
  if(this.updates%10==0) {
    var self = this;
    this.game.robots.forEach(function(robot) {
      var tilex = Math.floor(robot.position.x/self.game.map.tileWidth)
      var tiley = Math.floor(robot.position.y/self.game.map.tileHeight)
      for(var x = -2; x <= 2; x++) {
        for(var y = -2; y<= 2; y++) {
          if(x==0 && y==0)
            self.removeChild(self.fogTiles[tilex][tiley]);
          else 
            self.fogTiles[tilex+x][tiley+y].alpha -= 0.08/(Math.abs(x)+Math.abs(y));
        }
      }
      //self.fogTiles[tilex][tiley];
    });
  }
};

module.exports = Fog;
