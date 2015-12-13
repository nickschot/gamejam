'use strict';

var Fog = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'fog', frame);
  this.fogTiles = []
  this.game = game;
  this.updates = 0;
  this.updatefreq=4;
  this.map = game.add.tilemap();
  this.map.addTilesetImage('fog');
  this.fogLayer = this.map.create('fog', this.game.map.width, this.game.map.height, this.game.map.tileWidth, this.game.map.tileHeight);
  for(var x = 0; x < this.game.map.width; x++) {
    this.fogTiles[x] = []
    for(var y = 0; y < this.game.map.height; y++) {
      var tile = this.map.putTile(0,x,y);
      tile.alpha = 0.9
    }
  }
};

Fog.prototype = Object.create(Phaser.Sprite.prototype);
Fog.prototype.constructor = Fog;

Fog.prototype.update = function() {
  this.updates++;
  if(this.updates%this.updatefreq==0) {
    var self = this;
    this.game.robots.forEach(function(robot) {
      var tilex = Math.floor(robot.position.x/self.game.map.tileWidth)
      var tiley = Math.floor(robot.position.y/self.game.map.tileHeight)
      for(var x = -2; x <= 2; x++) {
        for(var y = -2; y<= 2; y++) {
          var tile = self.map.getTile(tilex-x,tiley-y);
          if(tile != null) {
            if(x==0 && y==0)
              self.map.removeTile(tilex,tiley);
            else {
              tile.alpha -= 0.008*this.updatefreq/(Math.abs(x)+Math.abs(y));
              if(tile.alpha <= 0) {
                self.map.removeTile(tilex-x,tiley-y);
              }
              self.fogLayer.dirty=true;
            }
          }
        }
      }
      //self.fogTiles[tilex][tiley];
    });
  }
};

module.exports = Fog;
