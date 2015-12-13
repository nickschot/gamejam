'use strict';

var Utils = require('../utils');
var TechTreeNode = require('./techTreeNode');

var TechtreeModificationNode = function(name, desc, costs, affectedValue, addition) {
    TechTreeNode.call(this, name, desc, costs);
    
    this.affectedValue = affectedValue;
    this.addition = addition;
    
    this.hasAchieved = true;
}

Utils.extend(TechTreeNode, TechtreeModificationNode);

TechtreeModificationNode.prototype.affects = function (value) {
    console.log("Value: " + value + " , AffectedValue: " + this.affectedValue);
    return value == this.affectedValue;
}

TechtreeModificationNode.prototype.getModificaton = function () {
    return this.hasAchieved ? this.addition : 0;
}

module.exports = TechtreeModificationNode;