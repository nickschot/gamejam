var CommandState = require("./commandState");
var Utils = require("../utils");

// -----------------------------------------------------------------------------
// AirlockState
// -----------------------------------------------------------------------------

function AirlockState(command, callback) {
    CommandState.call(this, "airlock", command);
    this.callback = callback;
}

Utils.extend(CommandState, AirlockState);

AirlockState.prototype.start = function () {
    this.airlockTimer = 120; // TODO Get airlocktime from Game.
};

AirlockState.prototype.update = function () {
    if(this.airlockTimer > 0) {
        this.airlockTimer--;
    } else {
        this.callback();
    }
};

// -----------------------------------------------------------------------------
// DriveState
// -----------------------------------------------------------------------------

function DriveState(command, destination, nextState, errorState) {
    CommandState.call(this, "drive", command);
    this.destination = destination;
    this.nextState = nextState;
    this.errorState = errorState || new EndState(command);
}

Utils.extend(CommandState, DriveState);

DriveState.prototype.start = function () {
    this.robot.setDestinationPoint(this.destination);
};

DriveState.prototype.update = function () {
    if (this.robot.hasFailedPathing) {
        console.log("Could not find path to destination :(");
        this.command.goState(this.errorState);
    } else if (this.robot.hasFinishedPathing) {
        this.command.goState(this.nextState);
    }
};

// -----------------------------------------------------------------------------
// EndState
// -----------------------------------------------------------------------------

function EndState(command) {
    CommandState.call(this, "end", command);
}

Utils.extend(CommandState, EndState);

EndState.prototype.update = function () {
    // Do nothing
};

EndState.prototype.isFinal = function () {
    return true;
};

// -----------------------------------------------------------------------------
// ExploreState
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// FindNodeState
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// MineState
// -----------------------------------------------------------------------------

function MineState(command) {
    CommandState.call(this, "mine", command);
}

Utils.extend(CommandState, MineState);

MineState.prototype.update = function () {
    this.command.resource.mine(this.robot);
    
    if (this.command.resource.isDepleted() && !this.robot.isFull()) {
        this.command.goState(new FindNodeState(this.command));
    } else if (this.robot.isFull()) {
        this.command.goToAirlock();
    }
};

// -----------------------------------------------------------------------------
// CityDumpState
// -----------------------------------------------------------------------------

function CityDumpState(command) {
    CommandState.call(this, "cityDump", command);
}

Utils.extend(CommandState, CityDumpState);

CityDumpState.prototype.update = function () {
    this.robot.emptyToCity(this.game.city);
    this.command.goState(new FindNodeState(this.command));
};

module.exports = {
    AirlockState: AirlockState,
    CityDumpState: CityDumpState,
    DriveState: DriveState,
    EndState: EndState,
    ExploreState: ExploreState,
    MineState: MineState,
    FindNodeState: FindNodeState
}
