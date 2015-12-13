'use strict';

var TechTreeNode = function(name, desc, costs) {
    this.name = name;
    this.desc = desc;
    this.costs = costs;
    
    this.hasAchieved = false;
}

TechTreeNode.prototype = Object.create(Object.prototype);



module.exports = TechTreeNode;