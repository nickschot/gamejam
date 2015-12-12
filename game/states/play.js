
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
      
      //this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
  
      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();
      
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
      }else if (this.cursors.down.isDown){
        this.game.camera.y += this.cameraSpeed;
      }
      if (this.cursors.left.isDown){
        this.game.camera.x -= this.cameraSpeed;
      }else if (this.cursors.right.isDown){
        this.game.camera.x += this.cameraSpeed;
      }
      
      this.edgeScroll();
    },
    clickListener: function() {
      this.game.state.start('gameover');
    },
    
    edgeScroll: function(){
      var deadzone = 50;
      
      var width = this.game.width;
      var height = this.game.height;
      
      var x = this.game.input.mousePointer.x;
      var y = this.game.input.mousePointer.y;
      
      if(x < deadzone){
        this.game.camera.x -= this.cameraSpeed;
      }else if(x > width - deadzone){
        this.game.camera.x += this.cameraSpeed;
      }
      
      if(y < deadzone){
        this.game.camera.y -= this.cameraSpeed;
      } else if(y > height - deadzone){
        this.game.camera.y += this.cameraSpeed;
      }
    }
  };
  
  module.exports = Play;