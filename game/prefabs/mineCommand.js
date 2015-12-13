var States = {
    City: 0,
    FindNode: 1,
    DriveToNode: 2,
    Mining: 3,
    Airlock: 4,
    End : -1,
};

var Command = require("./command");
var Utils = require("../utils");

function MineCommand (game, robot, resourceType) {
    Command.call(this, game, robot);

    this.state = States.FindNode;
    
    this.resourceType = resourceType;
    
    this.airlock = this.game.city.airlock;
    this.airlockTimer = 0;
    
    this.resource = null;
}

Utils.extend(Command, MineCommand);

MineCommand.prototype.update = function () {
    if(this.state == States.City) {
        // TODO: give resources to city
        console.log("City state not implemented");
        
    } else if(this.state == States.FindNode) {
        this.robot.clearDestination();
        
        this.resource = this.game.resourceMap.getClosestResourceByType(this.robot.currentTile.x, this.robot.currentTile.y, this.resourceType);
        
        if (this.resource) {
            this.robot.setDestination(this.resource.tile.x, this.resource.tile.y);
            this.state = States.DriveToNode;
        } else {
            console.log("Could not find node :(");
            this.state = States.End;
        }
    } else if(this.state == States.DriveToNode) {
        if (this.robot.hasFailedPathing) {
            console.log("Could not find path to node :(");
            this.state = States.End;
        } else if (this.robot.hasFinishedPathing) {
            this.state = States.Mining;
        }
    } else if(this.state == States.Mining) {
        this.resource.mine(this.robot);
        
        if (this.resource.isDepleted() && !this.robot.isFull()) {
            this.state = States.FindNode;
        } else if (this.robot.isFull()) {
            this.goToAirlock();
        }
        
    } else if(this.state == States.Airlock) {
        if (this.robot.hasFailedPathing) {
            console.log("Could not find path to airlock :(");
            this.state = States.End;
        } else if(this.robot.hasFinishedPathing) {
            if(this.airlockTimer > 0) {
                this.airlockTimer--;
            } else {
                this.state = States.City;
            }
        }
    } else if(this.state == States.End) {
        // End state
    } else {
        console.error("Invalid state " + this.state + " for " + this);
    }
}

MineCommand.prototype.isFinished = function () {
    return this.state == States.End;
}

MineCommand.prototype.goToAirlock = function () {
    this.robot.setDestinationPoint(this.airlock.position);
    this.state = States.Airlock;
    this.airlockTimer = 120; // TODO Get airlocktime from Game.
}

module.exports = MineCommand;