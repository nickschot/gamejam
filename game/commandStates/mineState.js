var CommandState = require("./commandState");
var Utils = require("../utils");

function MineState(command) {
    CommandState.call(this, "mine", command);
}

Utils.extend(CommandState, MineState);

MineState.prototype.update = function () {
    this.command.resource.mine(this.robot);
    
    if (this.command.resource.isDepleted() && !this.robot.isFull()) {
        var FindNodeState = require("./findNodeState");
        this.command.goState(new FindNodeState(this.command));
    } else if (this.robot.isFull()) {
        this.command.goToAirlock();
    }
};

module.exports = MineState;
