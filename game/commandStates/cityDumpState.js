var CommandState = require("./commandState");
var Utils = require("../utils");

var FindNodeState = require("../commandStates/findNodeState");

function CityDumpState(command) {
    CommandState.call(this, "cityDump", command);
}

Utils.extend(CommandState, CityDumpState);

CityDumpState.prototype.update = function () {
    this.robot.emptyToCity(this.game.city);
    this.command.goState(new FindNodeState(this.command));
};

module.exports = CityDumpState;
