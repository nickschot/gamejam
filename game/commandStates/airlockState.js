var CommandState = require("./commandState");
var EndState = require("./endState");
var Utils = require("../utils");

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

module.exports = AirlockState;
