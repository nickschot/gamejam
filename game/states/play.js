
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      
      this.map = this.game.add.tilemap('testmap');

      //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
      this.map.addTilesetImage('tileset', 'mapTiles');
  
      //create layer
      this.backgroundlayer = this.map.createLayer('Ground');
      this.backgroundCornersLayer = this.map.createLayer('GroundCorners');
      this.backgroundBordersLayer = this.map.createLayer('GroundBorders');
  
      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();
      
      var Robot = require("../prefabs/robot");
      this.robot = new Robot(this.game, this.map.widthInPixels/2+this.game.camera.width/2, this.map.heightInPixels/2+this.game.camera.height/2);
      this.game.add.existing(this.robot);
      
      //Set camera to middle of map
      this.game.camera.x = this.map.widthInPixels/2;
      this.game.camera.y = this.map.heightInPixels/2;
      
      //Set cameraspeed
      this.cameraSpeed = 10;
  
      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function() {
      if (this.cursors.up.isDown){
        this.game.camera.y -= this.cameraSpeed;
      }
      else if (this.cursors.down.isDown){
        this.game.camera.y += this.cameraSpeed;
      }
      if (this.cursors.left.isDown){
        this.game.camera.x -= this.cameraSpeed;
      }
      else if (this.cursors.right.isDown){
        this.game.camera.x += this.cameraSpeed;
      }
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;