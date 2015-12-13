'use strict';

var Resource = require('./resource');

var ResourceMap = function(game, layerName) {
    this.game = game;
    this.layerName = layerName;
    
    this.init();
}

ResourceMap.prototype = Object.create(Object.prototype);

ResourceMap.prototype.init = function() {
    this.resourceMap = {};    
    
    
    for (var y = 0; y < this.game.map.height; y++) {
        for (var x = 0; x < this.game.map.width; x++) {

            var resourceTile = this.game.map.getTile(x, y, this.game.map.getLayer(this.layerName));
            if (resourceTile) {

                var currResourceList = this.resourceMap[resourceTile.properties["resourceName"]] || [];

                currResourceList.push(new Resource(this, resourceTile));

                this.resourceMap[resourceTile.properties["resourceName"]] = currResourceList;
            }
        }
    }
}

ResourceMap.prototype.getClosestResourceByType = function (tileX, tileY, type) {
    var typeList = this.resourceMap[type] || [];
    
    var res = null;
    var resDist = -1;
    
    typeList.forEach(function (item) {
        var dist = Math.sqrt(Math.pow(item.tile.x - tileX, 2) + Math.pow(item.tile.y - tileY, 2));
        
        dist += Math.random() * 5;
        
        
        if (resDist == -1 || dist < resDist) {
            res = item;
            resDist = dist;
        }
    });
    
    return res;
}

ResourceMap.prototype.removeDepletedResource = function (tile, type) {
    var typeList = this.resourceMap[type] || [];
    
    var index = -1;
    
    typeList.forEach((function (item, i) {
        if (item.tile == tile) {
            this.game.map.removeTile(tile.x,  tile.y, this.layerName);
            
            index = i;
        }
    }).bind(this));
    
    if (index > -1) {
        typeList.splice(index, 1);
    }
}


module.exports = ResourceMap;