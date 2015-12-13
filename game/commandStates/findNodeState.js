var CommandState = require("./commandState");
var DriveState = require("./driveState");
var EndState = require("./endState");
var MineState = require("./mineState");
var Utils = require("../utils");

function FindNodeState(command) {
    CommandState.call(this, "findNode", command);
}

Utils.extend(CommandState, FindNodeState);

FindNodeState.prototype.update = function () {
    this.robot.clearDestination();
    
    var resource = this.game.resourceMap.getClosestResourceByType(this.robot.currentTile.x, this.robot.currentTile.y, this.command.resourceType);
    this.command.resource = resource;
    
    if (this.command.resource) {
        var destination =  new Phaser.Point(resource.tile.x, resource.tile.y);
        
        this.command.goState(new DriveState(this.command,
                                            destination,
                                            new MineState(this.command)));
    } else {
        console.log("Could not find node :(");
        this.command.goState(new EndState(this.command));
    }
};

module.exports = FindNodeState;
