var Command = require("./command");
var Utils = require("../utils");

var AirlockState = require("../commandStates/airlockState");
var DriveState = require("../commandStates/driveState");
var EndState = require("../commandStates/endState");

function OffCommand (game, robot) {
    Command.call(this, game, robot);

    var destination = this.game.city.airlock.position;

    this.goState(new DriveState(this, destination,
                                new AirlockState(this, (function(){this.goToCity();}).bind(this))));
}

Utils.extend(Command, OffCommand);

OffCommand.prototype.goToCity = function () {
    var destination = Utils.pixelsToTile(this.game.city.position);
    this.goState(new DriveState(this, destination,
                                new EndState(this)));
};

OffCommand.prototype.toString = function () {
    return "Off";
};

module.exports = OffCommand;
