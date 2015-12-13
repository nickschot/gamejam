var CommandState = require("./commandState");
var EndState = require("./endState");
var Utils = require("../utils");

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

module.exports = DriveState;
