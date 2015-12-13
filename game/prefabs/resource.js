'use strict';

var Resource = function(resourceMap, tile) {
    this.resourceMap = resourceMap;
    this.tile = tile;

    this.tile.properties["mineSpeed"] = parseInt(this.tile.properties["mineSpeed"]);
    this.tile.properties["resourceCount"] = parseInt(this.tile.properties["resourceCount"]);
}

Resource.prototype = Object.create(Object.prototype);

Resource.prototype.mine = function(robot) {
    var mineSpeed = this.tile.properties["mineSpeed"];
    var resourceCount = this.tile.properties["resourceCount"];
    var mined = Math.min(mineSpeed, resourceCount, robot.getCapacity(this.tile.properties["resourceName"]));
    
    resourceCount -= mined;
    
    if (resourceCount <= 0) {
        this.delete();
    }
    
    
    this.tile.properties["resourceCount"] = resourceCount;
    
    robot.addResource(this.tile.properties["resourceName"], mined);
    
    return mined;
}

Resource.prototype.delete = function() {
    this.resourceMap.removeDepletedResource(this.tile, this.tile.properties["resourceName"]);
}

Resource.prototype.isDepleted = function () {
    return this.tile.properties["resourceCount"] <= 0;
}


module.exports = Resource;