
  'use strict';
  function Play() {}
  Play.prototype = {
    canvasHasFocus: true,
    create: function() {
      var self = this;
      var canvasElement = document.getElementById('testgame');
      canvasElement.onmouseout  = function(){ self.canvasHasFocus = false; };
      canvasElement.onmouseover = function(){ self.canvasHasFocus = true; };
      
      
      

      this.initWorld();
      this.initRobot();
      
      var ResourceMap = require('../prefabs/resourceMap');
      this.resourceMap = new ResourceMap(this.game, 'Resource');
      console.log(this.resourceMap.getClosestResourceByType(64, 49, 'iron'));
      
     
      
      var City = require("../prefabs/city");
      this.city = new City(this.game, this.game.map.widthInPixels/2+this.game.camera.width/2, this.game.map.heightInPixels/2+this.game.camera.height/2);
      this.game.add.existing(this.city);
      
      this.robots[0].setDestination(67, 48);
      
      //Set camera to middle of map
      this.game.camera.x = this.game.map.widthInPixels/2;
      this.game.camera.y = this.game.map.heightInPixels/2;
      
      //Set cameraspeed
      this.cameraSpeed = 10;
  
      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
      
      this.robots[0].bringToTop();
       
       
      
      //CREATE GUI LAST, MUST HAVE CORRECT REFERENCES
      var Hud = require('../gui/hud');
      this.currentGUI = new Hud(this.robots);
      this.currentGUI.setupGUI();
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
      this.currentGUI.update();
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
    },
    
    initWorld: function(){
      this.game.TILESIZE = 32;
      
      
      this.game.map = this.game.add.tilemap('testmap');

      //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
      this.game.map.addTilesetImage('tileset', 'mapTiles');
  
      //create layer
      this.backgroundlayer = this.game.map.createLayer('Ground');
      this.backgroundCornersLayer = this.game.map.createLayer('GroundCorners');
      this.backgroundBordersLayer = this.game.map.createLayer('GroundBorders');
      this.buildingsLayer = this.game.map.createLayer('Building');
      
      this.collisionLayer = this.game.map.createLayer('Collision');
      
      console.log(this.game.map.layers[this.game.map.getLayer('Collision')]);
      
      this.game.collisionData = new Array(this.game.map.width);
      
      for (var y = 0; y < this.game.map.height; y++) {
        var row = new Array(this.game.map.width);
        for (var x = 0; x < this.game.map.width; x++) {
          if (this.game.map.getTile(x, y, this.game.map.getLayer('Collision'))) {
            row[x] = 1;
          } else {
            row[x] = 0;
          }
        }
        
        this.game.collisionData[y] = row;
      }
  
      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();
    },
    
    initRobot: function(){
      this.robots = [];
      this.addRobot();
    },
    
    addRobot: function(){
      var Robot = require("../prefabs/robot");
      var robot = new Robot(this.game, 64, 49);
      this.robots.push(robot);
      this.game.add.existing(robot);
    }
  };
  
  module.exports = Play;