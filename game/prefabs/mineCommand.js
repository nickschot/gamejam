var Command = require("./command");
var Utils = require("../utils");

var AirlockState = require("../commandStates/airlockState");
var CityDumpState = require("../commandStates/cityDumpState");
var DriveState = require("../commandStates/driveState");
var FindNodeState = require("../commandStates/findNodeState");

function MineCommand (game, robot, resourceType) {
    Command.call(this, game, robot);

    this.resourceType = resourceType;
    this.resource = null;
    this.airlock = this.game.city.airlock;

    this.goState(new FindNodeState(this));
}

Utils.extend(Command, MineCommand);

MineCommand.prototype.goToAirlock = function () {
    var destination = this.airlock.position;
    this.goState(new DriveState(this, destination,
                                new AirlockState(this, (function(){this.goToCity();}).bind(this))));
};

MineCommand.prototype.goToCity = function () {
    var destination = Utils.pixelsToTile(this.game.city.position);
    this.goState(new DriveState(this, destination,
                                new CityDumpState(this)));
};

Command.prototype.toString = function () {
    return "Mine " + this.resourceType;
};

module.exports = MineCommand;
