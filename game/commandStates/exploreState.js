var CommandState = require("./commandState");
var DriveState = require("./driveState");
var EndState = require("./endState");
var MineState = require("./mineState");
var Utils = require("../utils");

function ExploreState(command) {
    CommandState.call(this, "findNode", command);
}

Utils.extend(CommandState, ExploreState);

ExploreState.prototype.update = function () {
    this.robot.clearDestination();
    
    var curX = this.robot.currentTile.x;
    var curY = this.robot.currentTile.y;
    
    var minX = Math.max(0, curX - 5);
    var minY = Math.max(0, curY - 5);
    
    var maxX = Math.min(this.game.map.width, curX + 5);
    var maxY = Math.min(this.game.map.height, curY + 5);
    
    var newX = 0;
    var newY = 0;

    var candidateFound = false;
    while(!candidateFound) {
        newX = minX + Math.round(Math.random() * (maxX - minX));
        newY = minY + Math.round(Math.random() * (maxY - minY));
        
        candidateFound = !this.game.collisionData[newY][newX];
    }
    
    var destination =  new Phaser.Point(newX, newY);
    
    this.command.goState(new DriveState(this.command,
                                        destination,
                                        new ExploreState(this.command),
                                        new ExploreState(this.command)));
};

module.exports = ExploreState;
