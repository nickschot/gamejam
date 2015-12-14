var Command = require("./command");
var Utils = require("../utils");

var AirlockState = require("../commandStates/states").AirlockState;
var CityDumpState = require("../commandStates/states").CityDumpState;
var DriveState = require("../commandStates/states").DriveState;
var FindNodeState = require("../commandStates/states").FindNodeState;

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

MineCommand.prototype.toString = function () {
    return "Mine " + this.resourceType;
};

module.exports = MineCommand;
