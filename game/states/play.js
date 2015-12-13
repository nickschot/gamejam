
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
      
      console.log(this.game);
      
      var ResourceMap = require('../prefabs/resourceMap');
      this.game.resourceMap = new ResourceMap(this.game, 'Resource');
      
      var TechTree = require("../prefabs/techTree");
      this.game.techTree = new TechTree();
      
      var City = require("../prefabs/city");
      this.city = new City(this.game, this.game.map.widthInPixels/2, this.game.map.heightInPixels/2);
      this.game.city.initRobot();
      
      //Set camera to middle of map
      this.game.camera.x = this.game.map.widthInPixels/2;
      this.game.camera.y = this.game.map.heightInPixels/2;
      
      //Set cameraspeed
      this.cameraSpeed = 10;
  
      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
       
       
      var Fog = require("../prefabs/fog");
      this.fog = new Fog(this.game, 0, 0);
      this.game.add.existing(this.fog); 
       
      
      //CREATE GUI LAST, MUST HAVE CORRECT REFERENCES
      var Hud = require('../gui/hud');
      this.currentGUI = new Hud(this.game, null, this.city);
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
          this.game.camera.x -= this.cameraSpeed*Math.min((deadzone-x)/deadzone*1.5,1);
        }else if(x > width - deadzone){
          this.game.camera.x += this.cameraSpeed*Math.min((x-width+deadzone)/deadzone*1.5,1);
        }
        
        if(y < deadzone){
          this.game.camera.y -= this.cameraSpeed*Math.min((deadzone-y)/deadzone*1.5,1);
        } else if(y > height - deadzone){
          this.game.camera.y += this.cameraSpeed*Math.min((y-height+deadzone)/deadzone*1.5,1);
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
      this.airlocksLayer = this.game.map.createLayer('Airlocks');
      this.spawnLayer = this.game.map.createLayer('spawn');

      this.collisionLayer = this.game.map.createLayer('Collision');
      this.resourceLayer = this.game.map.createLayer('Resource');
      
      
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
  };
  
  module.exports = Play;