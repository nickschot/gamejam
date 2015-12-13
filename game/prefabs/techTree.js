'use strict';

var TechTreeNode = require("./techTreeNode");
var TechTreeModificationNode = require("./techTreeModificationNode");
var TechTreeUnlockNode = require("./techTreeUnlockNode");

var TechTree = function() {
    this.tree = [];
    
    this.createModNode('Commands I', 'Increases command input bits by one', {iron: 500}, 'bits', 1);
    this.createModNode('Commands II', 'Increases command input bits by one', {iron: 1000, pastic: 1000, stone: 1000}, 'bits', 1);
    
    this.createModNode('Storage I', 'Increases storage by 25 units', {plastic: 500, stone: 500}, 'storageSize', 25);
    this.createModNode('Storage II', 'Increases storage by 50 units', {plastic: 1000, stone: 1000}, 'storageSize', 50);
    this.createModNode('Storage III', 'Increases storage by 75 units', {plastic: 2000, stone: 2000, glass: 2000}, 'storageSize', 75);
    
    this.createUnlockNode('RobotFactory', 'Allows you to make new robots', {iron: 1000, plastic: 500}, 'robotFactory');
    
    this.createModNode('DriveSpeed I', 'Increases drive speed by 25%', {glass: 500}, 'drivingSpeed', 0.25);
    this.createModNode('DriveSpeed II', 'Increases drive speed by another 50%', {plastic: 2000}, 'drivingSpeed', 0.25);
    this.createModNode('DriveSpeed III', 'Increases drive speed by another 75%', {glass: 2000, lead: 2000},'drivingSpeed', 0.25);
}

TechTree.prototype = Object.create(Object.prototype);

TechTree.prototype.createModNode = function (name, desc, costs, affectedValue, diff) {
    this.tree.push(new TechTreeModificationNode(name, desc, costs, affectedValue, diff));
}

TechTree.prototype.createUnlockNode = function (name, desc, costs, affectedValue) {
    this.tree.push(new TechTreeUnlockNode(name, desc, costs, affectedValue))
}

TechTree.prototype.getValueModification = function (affectedValue){
    
    var mod = 0;
    
    for (var item of this.tree) {
        if (item instanceof TechTreeModificationNode && item.affects(affectedValue) && item.hasAchieved) {
            
            mod += item.getModificaton();
        }
    }
    
    return mod;
}

TechTree.prototype.hasAchieved = function (unlock){
    var achieved = false;
    
    for (var item of this.tree) {
        if (item instanceof TechTreeUnlockNode && item.affects(unlock) && item.hasAchieved) {
            achieved = true;
        }
    }
    
    return achieved;
}

TechTree.prototype.buyUpgrade = function (city, upgradeName) {
    var res = null;
    
    // First check if this actually an upgrade
    for (var obj of this.tree) {
        if (obj.name == upgradeName) {
            res = obj;
        }
    }
    

    //  Is this actually an upgrade
    if (!res) return true;
    
    // Buying an upgrade you already have is silly
    if (res.hasAchieved) return true;
    
    var canBuy = true;
    
    for (var key in res.costs) {
        if (res.costs.hasOwnProperty(key)) {
            
            if (city.storage[key] < res.costs[key]) {
                canBuy = false;
            }
        }
    }
    
    if (!canBuy) return false;
    
    // We've check everything, go buy
    for (var key in res.costs) {
        if (res.costs.hasOwnProperty(key)) {
            city.storage[key] -= res.costs[key];
        }
    }
    
    res.hasAchieved = true;
    
    return true;
}



module.exports = TechTree;