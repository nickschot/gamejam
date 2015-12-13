'use strict';

var Utils = require('../utils');
var TechTreeNode = require('./techTreeNode');

var TechtreeUnlockNode = function(name, desc, costs, affectedValue) {
    TechTreeNode.call(this, name, desc, costs);
    
    this.affectedValue = affectedValue;
    
    this.hasAchieved = false;
}

Utils.extend(TechTreeNode, TechtreeUnlockNode);

TechtreeUnlockNode.prototype.affects = function (value) {
    return value == this.affectedValue;
}

module.exports = TechtreeUnlockNode;