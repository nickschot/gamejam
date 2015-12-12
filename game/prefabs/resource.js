'use strict';

var Resource = function(tile) {
    this.tile = tile;
}

Resource.prototype = Object.prototype;

Resource.prototype.mine = function(robot) {
    var mineSpeed = this.tile.properties["mineSpeed"];
    var resourceCount = this.tile.properties["resourceCount"];
    var mined = Math.min(mineSpeed, Math.max(mineSpeed - resourceCount, 0), robot.getCapacity(this.tile.properties["resourceName"]));
    
    resourceCount -= mined;
    
    if (resourceCount <= 0) {
        this.delete();
    }
    
    return mined;
}

Resource.prototype.delete = function() {
    // TODO dit kan nog wel eens stuk zijn.
    this.game.map.removeTile(this.tile.x, this.tile.y, this.tile.layer);
}


module.exports = Resource;