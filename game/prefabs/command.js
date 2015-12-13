function Command (game, robot) {
    this.game = game;
    this.robot = robot;
    
}

Command.prototype = Object.create(Object.prototype);

Command.prototype.update = function () {
    console.log("deze mag je zo niet aanroepen, panneNkoek.");
}

Command.prototype.isFinished = function () {
    console.log("deze mag je zo niet aanroepen, panneNkoek.");
}

module.exports = Command;