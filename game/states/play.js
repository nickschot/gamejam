
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
      this.game.city = new City(this.game, this.game.map.widthInPixels/2, this.game.map.heightInPixels/2);
      this.game.city.initRobot();
      
      //Set camera to middle of map
      this.game.camera.x = this.game.map.widthInPixels/2 - this.game.camera.width/2;
      this.game.camera.y = this.game.map.heightInPixels/2 - this.game.camera.height/2;
      
      //Set cameraspeed
      this.cameraSpeed = 10;
      
      //Update frequency settings;
      this.updates = 0;
      this.fogUpdateSkip = 4;
  
      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
      
      
      //CREATE GUI LAST, MUST HAVE CORRECT REFERENCES
      var Hud = require('../gui/hud');
      this.currentGUI = new Hud(this.game, null, this.city);
      this.currentGUI.setupGUI();
    },
    update: function() {
      this.updates++;
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
      
      this.fogUpdate();

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
    
    fogUpdate: function() {
      
      if(this.updates%this.fogUpdateSkip==0) {
        var self = this;
        this.game.city.robots.forEach(function(robot) {
          var tilex = Math.floor(robot.position.x/self.game.map.tileWidth)
          var tiley = Math.floor(robot.position.y/self.game.map.tileHeight)
          for(var x = -2; x <= 2; x++) {
            for(var y = -2; y<= 2; y++) {
              var tile = self.game.map.getTile(tilex-x,tiley-y,'fog');
              if(tile != null) {
                if(x==0 && y==0)
                  self.game.map.removeTile(tilex,tiley,'fog');
                else {
                  tile.alpha -= 0.008*self.fogUpdateSkip/(Math.abs(x)+Math.abs(y));
                  if(tile.alpha <= 0) {
                    self.game.map.removeTile(tilex-x,tiley-y,'fog');
                  }
                  self.fogLayer.dirty=true;
                }
              }
            }
          }
        });
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
      this.collisionLayer.visible = false;
      this.resourceLayer = this.game.map.createLayer('Resource');
      this.fogLayer = this.game.map.createLayer('fog');
      
      
      this.game.collisionData = new Array(this.game.map.width);
      
      for (var y = 0; y < this.game.map.height; y++) {
        var row = new Array(this.game.map.width);
        for (var x = 0; x < this.game.map.width; x++) {
          if (this.game.map.getTile(x, y, 'Collision')) {
            row[x] = 1;
          } else {
            row[x] = 0;
          }
          // Set default fog alpha
          this.game.map.getTile(x, y, 'fog').alpha = 0.9;
        }
        
        this.game.collisionData[y] = row;
      }
      
      // Remove some fog initially.
      var center = 63.5;
      var citysize = 2.5;
      var extrafog = 2;
      for (var x = -citysize-extrafog; x <= citysize+extrafog; x++) {
        for (var y = -citysize-extrafog; y <= citysize+extrafog; y++) {
          var sx = Math.floor(center-x);
          var sy = Math.floor(center-y);
          if(x >= -citysize && x <= citysize && y >= -citysize && y <= citysize)
            this.game.map.removeTile(sx,sy,'fog');
          else 
            this.game.map.getTile(sx, sy, 'fog').alpha = Math.max(Math.abs(x)-citysize,Math.abs(y)-citysize)*0.3;
        }
      }
  
      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();
    },
  };
  
  module.exports = Play;