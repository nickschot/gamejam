var CommandState = require("./commandState");
var Utils = require("../utils");

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

module.exports = EndState;
