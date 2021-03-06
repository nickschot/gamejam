var EndState = require("../commandStates/states").EndState;

function Command (game, robot) {
    this.game = game;
    this.robot = robot;
    this.state = new EndState(this);
}

Command.prototype = Object.create(Object.prototype);

Command.prototype.goState = function (state) {
    console.log("State: " + this.state.name + " ==> " + state.name);
    this.state = state;
    this.state.start();
};

Command.prototype.update = function () {
    this.state.update();
};

Command.prototype.toString = function () {
    console.warn("command.toString() is not implemented");
    return "<command>";
};

Command.prototype.isFinished = function () {
    return this.state.isFinal();
};

module.exports = Command;
