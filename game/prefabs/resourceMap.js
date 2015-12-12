'use strict';

var Resource = require('./resource');

var ResourceMap = function(game, layerName) {
    this.game = game;
    this.layerName = layerName;
}

ResourceMap.prototype = Object.prototype;

ResourceMap.prototype.init = function() {
    this.resourceMap = {};    
    
    
    for (var y = 0; y < this.game.map.height; y++) {
        var row = new Array(this.game.map.width);
        for (var x = 0; x < this.game.map.width; x++) {


            var resourceTile = this.game.map.getTile(x, y, this.game.map.getLayer(this.layerName));
            if (resourceTile) {

                var currResourceList = this.resourceMap[resourceTile.properties["resourceName"]] || [];

                currResourceList.push(new Resource(resourceTile));

                this.resourceMap[resourceTile.properties["resourceName"]] = currResourceList;
            }
        }
    }
}


module.exports = ResourceMap;