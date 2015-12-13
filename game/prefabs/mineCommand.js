var States = {
    City: 0,
    FindNode: 1,
    DriveToNode: 2,
    Mining: 3,
    Airlock: 4,
    End : -1,
};


function MineCommand (game, robot, resourceType) {
    Command.call(this, game, robot);

    this.state = States.FindNode;
    
    this.resourceType = resourceType;
    
    this.airlock = this.game.city.airlock;
    this.airlockTimer = 0;
    
    this.resource = null;
}

var Utils = require("../utils");

MineCommand.prototype = Utils.extend(Command, MineCommand);

MineCommand.prototype.update = function () {
    if(this.state == States.City) {
        // TODO: give resources to city
        
        
    } else if(this.state == States.FindNode) {
        this.robot.clearDestination();
        
        this.resource = this.game.resourceMap.getClosestResourceByType(this.robot.currentTile.x, this.robot.currentTile.y, this.resourceType);
        
        if (this.resource) {
            var foundPath = this.robot.setDestination(this.resource.x, this.resource.y);
            if(foundPath) {
                this.state = States.DriveToNode;
            } else {
                this.state = States.End;
            }
        } else {
            console.log("Could not find node :(");
            this.state = States.End;
        }
    } else if(this.state == States.DriveToNode) {
        if (this.robot.hasFinishedPathing) {
            this.state = States.Mining;
        }
    } else if(this.state == States.Mining) {
        this.resource.mine(this.robot);
        
        if (this.resource.isDepleted() && !this.robot.isFullResource(this.resource["resourceName"])) {
            this.state = States.FindNode;
        } else if (this.resource.isDepleted()) {
            this.goToAirlock();
        }
        
    } else if(this.state == States.Airlock) {
        if(this.hasFinishedPathing) {
            if(this.airlockTimer > 0) {
                this.airlockTimer--;
            } else {
                this.state = States.City;
            }
        }
    } else {
        console.error("Invalid state " + this.state + " for " + this);
    }
    
}

MineCommand.prototype.isFinished = function () {
    return this.state == States.End;
}

MineCommand.prototype.goToAirlock = function () {
    console.error("mineCommand.goToAirlock is nog niet af");
    var foundPath = this.robot.setDestination(this.airlock.position);
    if(foundPath) {
        this.state = States.Airlock;
        this.airlockTimer = 120; // TODO Get airlocktime from Game.
    } else {
        this.state = States.End;
    }
}

module.exports = MineCommand;