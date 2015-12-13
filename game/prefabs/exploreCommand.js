var Command = require("./command");
var Utils = require("../utils");

var ExploreState = require("../commandStates/exploreState");

function ExploreCommand (game, robot) {
    Command.call(this, game, robot);

    this.goState(new ExploreState(this));
}

Utils.extend(Command, ExploreCommand);

ExploreCommand.prototype.toString = function () {
    return "Explore";
};

module.exports = ExploreCommand;
