
  'use strict';
  function Play() {}
  Play.prototype = {
    canvasHasFocus: true,
    create: function() {
      var self = this;
      var canvasElement = document.getElementById('testgame');
      canvasElement.onmouseout  = function(){ self.canvasHasFocus = false; };
      canvasElement.onmouseover = function(){ self.canvasHasFocus = true; };
      
      
      var Hud = require('../gui/hud');
      var currentGUI = new Hud();
      currentGUI.setupGUI();
      
      
      this.map = this.game.add.tilemap('testmap');

      //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
      this.map.addTilesetImage('tileset', 'mapTiles');
  
      //create layer
      this.backgroundlayer = this.map.createLayer('Ground');
      this.backgroundCornersLayer = this.map.createLayer('GroundCorners');
      this.backgroundBordersLayer = this.map.createLayer('GroundBorders');
      this.buildingsLayer = this.map.createLayer('Building');
      
      this.collisionLayer = this.map.createLayer('Collision');
      
      console.log(this.collisionLayer);
  
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
      
      console.log(this.game);
      
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

      if(this.game.input.activePointer.justPressed()) {
        console.log(this.game.camera.x + " " + this.game.camera.y);
      }
    },
    
    edgeScrollEnabled: true,
    disableEdgeScroll: function(){
      this.edgeScrollEnabled = false;
    },
    enableEdgeScroll: function(){
      this.edgeScrollEnabled = true;
    },
    
    edgeScroll: function(){
      if(this.canvasHasFocus){
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
    }
  };
  
  module.exports = Play;