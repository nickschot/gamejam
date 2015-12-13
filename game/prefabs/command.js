var EndState = require("../commandStates/endState");

function Command (game, robot) {
    this.game = game;
    this.robot = robot;
    this.state = new EndState(this);
}

Command.prototype = Object.create(Object.prototype);

Command.prototype.goState = function (state) {
    console.log("State: " + this.state.name + " ==>" + state.name);
    this.state = state;
    this.state.start();
};

Command.prototype.update = function () {
    this.state.update();
};

Command.prototype.isFinished = function () {
    return this.state.isFinal();
};

module.exports = Command;
