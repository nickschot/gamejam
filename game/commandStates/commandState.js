function CommandState (name, command) {
    this.name = name;
    this.command = command;
    this.game = command.game;
    this.robot = command.robot;
}

CommandState.prototype = Object.create(Object.prototype);

CommandState.prototype.start = function () {
    // Do nothing.
};

CommandState.prototype.update = function () {
    console.log("deze mag je zo niet aanroepen, panneNkoek.");
};

CommandState.prototype.isFinal = function () {
    return false;
};

module.exports = CommandState;
