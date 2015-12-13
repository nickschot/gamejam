
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('robot', 'assets/robot.png', 32, 32);
    this.load.spritesheet('city', 'assets/city.png', 32, 32);
    this.load.image('nuclear', 'assets/nuclear-01.png');
    
    this.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('mapTiles', 'assets/tileset.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
