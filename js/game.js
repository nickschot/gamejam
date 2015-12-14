(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// NameSpace
var EasyStar = EasyStar || {};

// For require.js
if (typeof define === "function" && define.amd) {
	define("easystar", [], function() {
		return EasyStar;
	});
}

// For browserify and node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = EasyStar;
}
/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.costSoFar = costSoFar;
	this.simpleDistanceToTarget = simpleDistanceToTarget;

	/**
	* @return {Number} Best guess distance of a cost using this node.
	**/
	this.bestGuessDistance = function() {
		return this.costSoFar + this.simpleDistanceToTarget;
	}
};

// Constants
EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;
/**
* This is an improved Priority Queue data type implementation that can be used to sort any object type.
* It uses a technique called a binary heap.
* 
* For more on binary heaps see: http://en.wikipedia.org/wiki/Binary_heap
* 
* @param {String} criteria The criteria by which to sort the objects. 
* This should be a property of the objects you're sorting.
* 
* @param {Number} heapType either PriorityQueue.MAX_HEAP or PriorityQueue.MIN_HEAP.
**/
EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;

	//Constructor
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	/**
	* Inserts the value into the heap and sorts it.
	* 
	* @param value The object to insert into the heap.
	**/
	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		bubbleUp(this.length-1);
	}

	/**
	* Peeks at the highest priority element.
	*
	* @return the highest priority element
	**/
	this.getHighestPriorityElement = function() {
		return queue[0];
	}

	/**
	* Removes and returns the highest priority element from the queue.
	*
	* @return the highest priority element
	**/
	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		swapUntilQueueIsCorrect(0);
		return oldRoot;
	}

	var bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = getParentOf(index);
		if (evaluate(index,parent)) {
			swap(index,parent);
			bubbleUp(parent);
		} else {
			return;
		}
	}

	var swapUntilQueueIsCorrect = function(value) {
		var left = getLeftOf(value);
		var right = getRightOf(value);
		if (evaluate(left,value)) {
			swap(value,left);
			swapUntilQueueIsCorrect(left);
		} else if (evaluate(right,value)) {
			swap(value,right);
			swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			swapUntilQueueIsCorrect(0);
		}
	}

	var swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	}

	var evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}
		
		var selfValue;
		var targetValue;
		
		// Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			selfValue = queue[self][criteria]();
			targetValue = queue[target][criteria]();
		} else {
			selfValue = queue[self][criteria];
			targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	}

	var getParentOf = function(index) {
		return Math.floor((index-1) / 2);
	}

	var getLeftOf = function(index) {
		return index*2 + 1;
	}

	var getRightOf = function(index) {
		return index*2 + 2;
	}
};

// Constants
EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
};
/**
*	EasyStar.js
*	github.com/prettymuchbryce/EasyStarJS
*	Licensed under the MIT license.
* 
*	Implementation By Bryce Neal (@prettymuchbryce)
**/
EasyStar.js = function() {
	var STRAIGHT_COST = 1.0;
	var DIAGONAL_COST = 1.4;
	var syncEnabled = false;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var pointsToCost = {};
	var allowCornerCutting = true;
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array|Number} tiles An array of numbers that represent 
	* which tiles in your grid should be considered
	* acceptable, or "walkable".
	**/
	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			// Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			// Number
			acceptableTiles = [tiles];
		}
	};

	/**
	* Enables sync mode for this EasyStar instance..
	* if you're into that sort of thing.
	**/
	this.enableSync = function() {
		syncEnabled = true;
	};

	/**
	* Disables sync mode for this EasyStar instance.
	**/
	this.disableSync = function() {
		syncEnabled = false;
	};

	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	}

	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	}

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array} grid The collision grid that this EasyStar instance will read from. 
	* This should be a 2D Array of Numbers.
	**/
	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	/**
	* Sets the tile cost for a particular tile type.
	*
	* @param {Number} The tile type to set the cost for.
	* @param {Number} The multiplicative cost associated with the given tile.
	**/
	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	/**
	* Sets the an additional cost for a particular point.
	* Overrides the cost from setTileCost.
	*
	* @param {Number} x The x value of the point to cost.
	* @param {Number} y The y value of the point to cost.
	* @param {Number} The multiplicative cost associated with the given point.
	**/
	this.setAdditionalPointCost = function(x, y, cost) {
		pointsToCost[x + '_' + y] = cost;
	};

	/**
	* Remove the additional cost for a particular point.
	*
	* @param {Number} x The x value of the point to stop costing.
	* @param {Number} y The y value of the point to stop costing.
	**/
	this.removeAdditionalPointCost = function(x, y) {
		delete pointsToCost[x + '_' + y];
	}

	/**
	* Remove all additional point costs.
	**/
	this.removeAllAdditionalPointCosts = function() {
		pointsToCost = {};
	}

	/**
	* Sets the number of search iterations per calculation. 
	* A lower number provides a slower result, but more practical if you 
	* have a large tile-map and don't want to block your thread while
	* finding a path.
	* 
	* @param {Number} iterations The number of searches to prefrom per calculate() call.
	**/
	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};
	
	/**
	* Avoid a particular point on the grid, 
	* regardless of whether or not it is an acceptable tile.
	*
	* @param {Number} x The x value of the point to avoid.
	* @param {Number} y The y value of the point to avoid.
	**/
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	/**
	* Stop avoiding a particular point on the grid.
	*
	* @param {Number} x The x value of the point to stop avoiding.
	* @param {Number} y The y value of the point to stop avoiding.
	**/
	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	/**
	* Enables corner cutting in diagonal movement.
	**/
	this.enableCornerCutting = function() {
		allowCornerCutting = true;
	};

	/**
	* Disables corner cutting in diagonal movement.
	**/
	this.disableCornerCutting = function() {
		allowCornerCutting = false;
	};

	/**
	* Stop avoiding all additional points on the grid.
	**/
	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	/**
	* Find a path.
	* 
	* @param {Number} startX The X position of the starting point.
	* @param {Number} startY The Y position of the starting point.
	* @param {Number} endX The X position of the ending point.
	* @param {Number} endY The Y position of the ending point.
	* @param {Function} callback A function that is called when your path
	* is found, or no path is found.
	* 
	**/
	this.findPath = function(startX, startY, endX, endY, callback) {
		// Wraps the callback for sync vs async logic
		var callbackWrapper = function(result) {
			if (syncEnabled) {
				callback(result);
			} else {
				setTimeout(function() {
					callback(result);
				});
			}
		}

		// No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
		}
		// No grid was set
		if (collisionGrid === undefined) {
			throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
		}

		// Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 || 
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw new Error("Your start or end point is outside the scope of your grid.");
		}

		// Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callbackWrapper([]);
			return;
		}

		// End point is not an acceptable tile.
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callbackWrapper(null);
			return;
		}

		// Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callbackWrapper;

		instance.openList.insert(coordinateToNode(instance, instance.startX, 
			instance.startY, null, STRAIGHT_COST));

		instances.push(instance);
	};

	/**
	* This method steps through the A* Algorithm in an attempt to
	* find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
	* You can change the number of calculations done in a call by using
	* easystar.setIteratonsPerCalculation().
	**/
	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			if (syncEnabled) {
				// If this is a sync instance, we want to make sure that it calculates synchronously. 
				iterationsSoFar = 0;
			}

			// Couldn't find a path.
			if (instances[0].openList.length === 0) {
				var ic = instances[0];
				ic.callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();

			var tilesToSearch = [];
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 0, y: -1, cost: STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y-1)});
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 1, y: 0, cost: STRAIGHT_COST * getTileCost(searchNode.x+1, searchNode.y)});
			}
			if (searchNode.y < collisionGrid.length-1) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: 0, y: 1, cost: STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y+1)});
			}
			if (searchNode.x > 0) {
				tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
					x: -1, y: 0, cost: STRAIGHT_COST * getTileCost(searchNode.x-1, searchNode.y)});
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {
						
						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: -1, y: -1, cost: DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y-1)});
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {
						
						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: 1, y: 1, cost: DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y+1)});
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {


						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: 1, y: -1, cost: DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y-1)});
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {

					if (allowCornerCutting ||
						(isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
						isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {


						tilesToSearch.push({ instance: instances[0], searchNode: searchNode, 
							x: -1, y: 1, cost: DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y+1)});
					}
				}
			}

			// First sort all of the potential nodes we could search by their cost + heuristic distance.
			tilesToSearch.sort(function(a, b) {
				var aCost = a.cost + getDistance(searchNode.x + a.x, searchNode.y + a.y, instances[0].endX, instances[0].endY)
				var bCost = b.cost + getDistance(searchNode.x + b.x, searchNode.y + b.y, instances[0].endX, instances[0].endY)
				if (aCost < bCost) {
					return -1;
				} else if (aCost === bCost) {
					return 0;
				} else {
					return 1;
				}
			});

			var isDoneCalculating = false;

			// Search all of the surrounding nodes
			for (var i = 0; i < tilesToSearch.length; i++) {
				checkAdjacentNode(tilesToSearch[i].instance, tilesToSearch[i].searchNode, 
					tilesToSearch[i].x, tilesToSearch[i].y, tilesToSearch[i].cost);
				if (tilesToSearch[i].instance.isDoneCalculating === true) {
					isDoneCalculating = true;
					break;
				}
			}

			if (isDoneCalculating) {
				instances.shift();
				continue;
			}

		}
	};

	// Private methods follow
	var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			// Handles the case where we have found the destination
			if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
				instance.isDoneCalculating = true;
				var path = [];
				var pathLen = 0;
				path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
				pathLen++;
				path[pathLen] = {x: searchNode.x, y:searchNode.y};
				pathLen++;
				var parent = searchNode.parent;
				while (parent!=null) {
					path[pathLen] = {x: parent.x, y:parent.y};
					pathLen++;
					parent = parent.parent;
				}
				path.reverse();
				var ic = instance;
				var ip = path;
				ic.callback(ip);
				return
			}

			if (isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY)) {
				var node = coordinateToNode(instance, adjacentCoordinateX, 
					adjacentCoordinateY, searchNode, cost);

				if (node.list === undefined) {
					node.list = EasyStar.Node.OPEN_LIST;
					instance.openList.insert(node);
				} else if (node.list === EasyStar.Node.OPEN_LIST) {
					if (searchNode.costSoFar + cost < node.costSoFar) {
						node.costSoFar = searchNode.costSoFar + cost;
						node.parent = searchNode;
					}
				}
			}
		}
	};

	// Helpers
	var isTileWalkable = function(collisionGrid, acceptableTiles, x, y) {
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (collisionGrid[y][x] === acceptableTiles[i]) {
				return true;
			}
		}

		return false;
	};

	var getTileCost = function(x, y) {
		return pointsToCost[x + '_' + y] || costMap[collisionGrid[y][x]]
	};

	var coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
	};
}
},{}],2:[function(require,module,exports){
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

},{"../utils":34,"./commandState":4,"./endState":6}],3:[function(require,module,exports){
var CommandState = require("./commandState");
var Utils = require("../utils");

var FindNodeState = require("../commandStates/findNodeState");

function CityDumpState(command) {
    CommandState.call(this, "cityDump", command);
}

Utils.extend(CommandState, CityDumpState);

CityDumpState.prototype.update = function () {
    this.robot.emptyToCity(this.game.city);
    this.command.goState(new FindNodeState(this.command));
};

module.exports = CityDumpState;

},{"../commandStates/findNodeState":8,"../utils":34,"./commandState":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var CommandState = require("./commandState");
var EndState = require("./endState");
var Utils = require("../utils");

function DriveState(command, destination, nextState, errorState) {
    CommandState.call(this, "drive", command);
    this.destination = destination;
    this.nextState = nextState;
    this.errorState = errorState || new EndState(command);
}

Utils.extend(CommandState, DriveState);

DriveState.prototype.start = function () {
    this.robot.setDestinationPoint(this.destination);
};

DriveState.prototype.update = function () {
    if (this.robot.hasFailedPathing) {
        console.log("Could not find path to destination :(");
        this.command.goState(this.errorState);
    } else if (this.robot.hasFinishedPathing) {
        this.command.goState(this.nextState);
    }
};

module.exports = DriveState;

},{"../utils":34,"./commandState":4,"./endState":6}],6:[function(require,module,exports){
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

},{"../utils":34,"./commandState":4}],7:[function(require,module,exports){
var CommandState = require("./commandState");
var DriveState = require("./driveState");
var EndState = require("./endState");
var MineState = require("./mineState");
var Utils = require("../utils");

function ExploreState(command) {
    CommandState.call(this, "findNode", command);
}

Utils.extend(CommandState, ExploreState);

ExploreState.prototype.update = function () {
    this.robot.clearDestination();
    
    var curX = this.robot.currentTile.x;
    var curY = this.robot.currentTile.y;
    
    var minX = Math.max(0, curX - 5);
    var minY = Math.max(0, curY - 5);
    
    var maxX = Math.min(this.game.map.width, curX + 5);
    var maxY = Math.min(this.game.map.height, curY + 5);
    
    var newX = 0;
    var newY = 0;

    var candidateFound = false;
    while(!candidateFound) {
        newX = minX + Math.round(Math.random() * (maxX - minX));
        newY = minY + Math.round(Math.random() * (maxY - minY));
        
        candidateFound = !this.game.collisionData[newY][newX];
    }
    
    var destination =  new Phaser.Point(newX, newY);
    
    this.command.goState(new DriveState(this.command,
                                        destination,
                                        new ExploreState(this.command),
                                        new ExploreState(this.command)));
};

module.exports = ExploreState;

},{"../utils":34,"./commandState":4,"./driveState":5,"./endState":6,"./mineState":9}],8:[function(require,module,exports){
var CommandState = require("./commandState");
var DriveState = require("./driveState");
var EndState = require("./endState");
var MineState = require("./mineState");
var Utils = require("../utils");

function FindNodeState(command) {
    CommandState.call(this, "findNode", command);
}

Utils.extend(CommandState, FindNodeState);

FindNodeState.prototype.update = function () {
    this.robot.clearDestination();
    
    var resource = this.game.resourceMap.getClosestResourceByType(this.robot.currentTile.x, this.robot.currentTile.y, this.command.resourceType);
    this.command.resource = resource;
    
    if (this.command.resource) {
        var destination =  new Phaser.Point(resource.tile.x, resource.tile.y);
        
        this.command.goState(new DriveState(this.command,
                                            destination,
                                            new MineState(this.command)));
    } else {
        console.log("Could not find node :(");
        this.command.goState(new EndState(this.command));
    }
};

module.exports = FindNodeState;

},{"../utils":34,"./commandState":4,"./driveState":5,"./endState":6,"./mineState":9}],9:[function(require,module,exports){
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

},{"../utils":34,"./commandState":4,"./findNodeState":8}],10:[function(require,module,exports){
'use strict';

var Hud = function(game, tech, stats) {
    this.game   = game;
    this.tech   = game.techTree;
    this.city   = game.city;
    
    this.templates          = {};
    this.templates.hud      = require('./templates/hud.json');
    this.templates.menu     = require('./templates/menu.json');
    this.templates.robots   = require('./templates/robots.json');
    this.templates.tech     = require('./templates/tech.json');
    this.templates.stats    = require('./templates/stats.json');
    
    this.hudWindow      = {};
    this.robotsWindow   = {};
    this.techWindow     = {};
    this.statsWindow    = {};
    
    this.currentRobotDetailView = {};
    this.currentTechDetailView  = {};
    
    this.theme = 'kenney';
    this.doneLoading = false;
};

Hud.prototype = Object.create(Object.prototype);
Hud.prototype.constructor = Hud;

Hud.prototype.setupGUI = function() {
    var self = this;
    
    EZGUI.Theme.load(['assets/EZGUI/'+this.theme+'-theme/'+this.theme+'-theme.json'], function () {
	    //EZGUI.themes['metalworks'].override(themeOverride);
		
		self.hudWindow = EZGUI.create(self.templates.hud, self.theme);
		self.hudWindow.visible = true;
        
        self.renderMenuView();
        self.renderRobotsView();
        self.renderTechView();
        self.renderStatsView();
        
		self.initBinds();
		
		self.doneLoading = true;
	});
};

Hud.prototype.initBinds = function() {
    var self = this;
    
    //Window control
    EZGUI.components.menuButton.on('click', function(event, me) {
        var visible = !self.menuWindow.visible;
        self.hideWindows();
        self.menuWindow.visible = visible;
    });
    EZGUI.components.robotsButton.on('click', function(event, me) {
        var visible = !self.robotsWindow.visible;
        self.hideWindows();
        self.robotsWindow.visible = visible;
        self.currentRobotDetailView = {'robot':self.game.city.robots[0], 'index':0 };
    });
    EZGUI.components.techButton.on('click', function(event, me) {
        var visible = !self.techWindow.visible;
        self.hideWindows();
        self.techWindow.visible = visible;
    });
    EZGUI.components.statsButton.on('click', function(event, me) {
        var visible = !self.statsWindow.visible;
        self.hideWindows();
        self.statsWindow.visible = visible;
    });
    
    EZGUI.components.quitButton.on('click', function(event, me){
        self.hideWindows();
        self.hudWindow.visible = false;
        self.game.state.start('menu');
    });
	
	
	
	this.tech.tree.forEach(function(tech, index){
	    EZGUI.components[encodeURIComponent(tech.name)].on('click', function(event, me){
	        self.currentTechDetailView = {'tech':tech, 'index':index };
	        
            self.showTechDetailView();
	    });
	});
	
	EZGUI.components.techBuyButton.on('click', function(event, me){
	    var name = self.currentTechDetailView.tech.name;
	    var city = self.game.city;
	    
	    if(name && name !== ""){
	        var didBuy = self.tech.buyUpgrade(city, name);
	        if(didBuy){
	            //Update buy button
	            self.showTechDetailView();
	        } else {
	            EZGUI.components.techBuyErrorLabel.visible = true;
	        }
	    }
	});
	
	EZGUI.components.robotProgramZeroButton.on('click', function (event, me) {
	    var text = EZGUI.components.robotProgramCurrentLabel.text;
	    
	    text += '0';
	    
	    var bits = 1 + self.game.techTree.getValueModification('bits');
	    
	    text = text.substring(text.length - bits, text.length);
	    
	    
	    EZGUI.components.robotProgramCurrentLabel.text = text;
	    
	    
	});
	
	EZGUI.components.robotProgramOneButton.on('click', function (event, me) {
	    var text = EZGUI.components.robotProgramCurrentLabel.text;
	    
	    text += '1';
	    
	    var bits = 1 + self.game.techTree.getValueModification('bits');
	    
	    text = text.substring(text.length - bits, text.length);
	    
	    EZGUI.components.robotProgramCurrentLabel.text = text;
	});
	
	EZGUI.components.robotProgramSubmitButton.on('click', function (event, me) {
	    self.currentRobotDetailView.robot.changeCommand(EZGUI.components.robotProgramCurrentLabel.text);
	});
	
	EZGUI.components.robotBuy.on('click', function (event, me) {
	    console.log("Buying robot!");
	    if (self.game.city.robots.length < 25) {
    	    if (self.game.city.buyRobot()) {
                self.robotBought();
    	    }
	    } else {
	        console.log("25 robots max, HACK :(");
	    }
	});
};

Hud.prototype.update = function(){
    this.showRobotDetailView();
    this.updateStats();
    this.updateInlineResourceCount();
};

Hud.prototype.updateInlineResourceCount = function () {
    if (this.doneLoading) {
        EZGUI.components.ironLabel.text = this.game.city.storage["iron"];
        EZGUI.components.plasticLabel.text = this.game.city.storage["plastic"];
        EZGUI.components.stoneLabel.text = this.game.city.storage["stone"];
        EZGUI.components.leadLabel.text = this.game.city.storage["lead"];
        EZGUI.components.glassLabel.text = this.game.city.storage["glass"];
    }
}

Hud.prototype.hideWindows = function(){
    this.menuWindow.visible     = false;
    this.robotsWindow.visible   = false;
    this.techWindow.visible     = false;
    this.statsWindow.visible    = false;
};

Hud.prototype.renderMenuView = function(){
    this.menuWindow = EZGUI.create(this.templates.menu, this.theme);
	this.menuWindow.visible = false;
};

//TODO: call this whenever a robot is added
Hud.prototype.renderRobotsView = function(){
    var self = this;
    
    console.log("Render this!");
    
    //Empty the list of robots and add all current robots to the template
    this.templates.robots.children[0].children[2].children = [];

    
    
	for (var index = 0; index < 25; index++) {
        var currentElem = {   
            id: 'robot'+index+'Entry',
            component: 'Layout',
            layout: [3,1],
            position: { x: 10, y: 10 },
            width: 275,
            height:50,
            children: [
                {
                    id: 'robot'+index+'Name',
                    component: 'Label',
                    text: 'ROBOT '+index,
                    width: 100,
                    height: 50,
                    position: 'center'
                },
                {
                    id: 'robot'+index+'Status',
                    component: 'Label',
                    text: 'not bought',
                    font: {
                        size: '12px;'
                    },
                    width: 100,
                    height: 50,
                    position: 'center'
                },
                {
                    id: 'robot'+index+'Button',
                    component: 'Header',
                    text: 'open',
                    width: 75,
                    height: 30,
                    position: 'center',
                    font: {
                        size: '16px'
                    }
                }
            ]
        };
        
        if (index < self.game.city.robots.length) {
            currentElem.children[1].text = "LIVE";
        }
        
        self.templates.robots.children[0].children[2].children.push(currentElem);
    }
    
    //Destroy the old view;
    if(this.robotsWindow && this.robotsWindow.destroy){
        console.log("Destroying?");
        this.robotsWindow.destroy();
    }
    
    //Create the new view from the new edited template
    this.robotsWindow = EZGUI.create(this.templates.robots, this.theme);
	this.robotsWindow.visible = false;
	
	var createCallback = function (index ) {
	    
        
        console.log("creating new handler for robot: " + index);
        
	    return function(event, me) {
	        console.log("clickyclick on " + index);
	        
	        if (getIndex(index) < self.game.city.robots.length) {
    	        self.currentRobotDetailView = {'robot':self.game.city.robots[index], 'index':index };
	        }
        };
	}
	
	for (let index = 0; index < 25; index++) {
	    EZGUI.components['robot'+index+'Button'].on('click', createCallback(index));
    }
};


Hud.prototype.robotBought = function () {
    for (var index = 0; index < this.city.robots.length; index++) {
           EZGUI.components['robot'+index+'Status'].text = "LIVE";
           EZGUI.components['robot'+index+'Button'].component = "Button";
           
           console.log('robot'+index+'Status');
    }
}

Hud.prototype.showRobotDetailView = function(){
    if(this.robotsWindow.visible && this.currentRobotDetailView.robot){
        var robot = this.currentRobotDetailView.robot;
        var index = this.currentRobotDetailView.index;

        var headerLabel = EZGUI.components.robotDetailHeader;
        var inventory = EZGUI.components.robotDetailInventory;
        var inventoryStatus = EZGUI.components.robotDetailInventoryStatus;
        
        EZGUI.components.robotDetailTaskStatus.text = robot.command.toString();
        
        var inventoryCount = 0;
        var keyIndex = 0;
        inventory.container.children = [];
        for (var key in robot.inventory) {
            if (robot.inventory.hasOwnProperty(key)) {
                inventoryCount += robot.inventory[key];
                
                var invItem = EZGUI.create({
                    component: 'Label',
                    text: key + ': ' + robot.inventory[key],
                    width: 100,
                    height: 40,
                    position: {x:0, y:40*keyIndex}
                }, this.theme);
                
                inventory.addChild(invItem);
            }
            keyIndex++;
        }
        
        headerLabel.text = 'Robot '+index;
        inventoryStatus.text = inventoryCount + '/' + robot.getMaxCapacity();
    }
};

Hud.prototype.renderTechView = function(){
	this.updateTechView();
	
    this.techWindow = EZGUI.create(this.templates.tech, this.theme);
	this.techWindow.visible = false;
	
	EZGUI.components.techBoughtButton.visible = false;
    EZGUI.components.techBuyButton.visible = false;
    EZGUI.components.techBuyErrorLabel.visible = false;
};

Hud.prototype.updateTechView = function(){
    var self = this;
    var techTree = this.tech.tree;
    
    this.templates.tech.children[0].children[1].children = [];
    
    techTree.forEach(function(tech, index){
        var listItem = {
            id: encodeURIComponent(tech.name),
            component: 'Button',
            text: tech.name,
            width: 280,
            height: 50,
            position: 'center'
        };
        
        if(tech.hasAchieved){
            listItem.component = 'Header';
            listItem.font = {
                color: '#888'
            };
        }
        
        self.templates.tech.children[0].children[1].children.push(listItem);
    });
};

Hud.prototype.showTechDetailView = function(){
    EZGUI.components.techBuyErrorLabel.visible = false;
    if(this.techWindow.visible && this.currentTechDetailView.tech){
        var tech = this.currentTechDetailView.tech;
        var index = this.currentTechDetailView.index;
        
        EZGUI.components.techDetailHeader.text = 'Tech: '+tech.name;
        EZGUI.components.techDetailDescription.text = tech.desc;
        
        EZGUI.components.techDetailCosts.container.children = [];
        EZGUI.components.techDetailCosts.addChild(EZGUI.create({
            component: 'Label',
            text: 'Costs:',
            position: 'left',
            width: 300,
            height: 30,
            font: {
                size: '22px'
            }
        }, this.theme));
        for (var key in tech.costs) {
            if (tech.costs.hasOwnProperty(key)) {
                
                EZGUI.components.techDetailCosts.addChild(EZGUI.create({
                    component: 'Label',
                    width: 300,
                    height: 30,
                    position: 'left',
                    text: key + ': ' + tech.costs[key],
                    font: {
                        size: '16px'
                    }
                }, this.theme));
            }
        }
        
        //Add buy button
        if(tech.hasAchieved){
            EZGUI.components.techBoughtButton.visible = true;
            EZGUI.components.techBuyButton.visible = false;
        } else {
            EZGUI.components.techBoughtButton.visible = false;
            EZGUI.components.techBuyButton.visible = true;
        }
    }
};

Hud.prototype.renderStatsView = function(){
    this.statsWindow = EZGUI.create(this.templates.stats, this.theme);
	this.statsWindow.visible = false;
};

Hud.prototype.updateStats = function(){
    if(this.statsWindow.visible){
        var self = this;
        var resources = this.city.storage;
        
        //Remove current stats
        EZGUI.components.statsDetailLayout.container.children = [];
        
        //Amount of robots
        var robotStats = EZGUI.create({
                    component: 'Label',
                    text: 'robots: ' + self.game.city.robots.length,
                    width: 310,
                    height: 40,
                    position: {x:0, y:0}
                }, this.theme);
                
        //Add two empty elements and the robot stats
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({component: 'Label', position: {x:0,y:0}}, this.theme));
        EZGUI.components.statsDetailLayout.addChild(robotStats);
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({component: 'Label', position: {x:0,y:0}}, this.theme));
        EZGUI.components.statsDetailLayout.addChild(EZGUI.create({
            component: 'Label', 
            text: 'Resources', 
            position: 'center',
            width: 300,
            height: 40,
            font: {
		        size: '24px',
		        family: 'Arial'
		    }
        }, this.theme));
        
        //Add city resources
        var keyIndex = 0;
        for (var key in resources) {
            if (resources.hasOwnProperty(key)) {
                var invItem = EZGUI.create({
                    component: 'Label',
                    text: key + ': ' + resources[key],
                    width: 310,
                    height: 40,
                    position: {x:0, y:0}
                }, this.theme);
                
                EZGUI.components.statsDetailLayout.addChild(invItem);
            }
            keyIndex++;
        }
    }
}

module.exports = Hud;

},{"./templates/hud.json":11,"./templates/menu.json":12,"./templates/robots.json":13,"./templates/stats.json":14,"./templates/tech.json":15}],11:[function(require,module,exports){
module.exports={
    id: 'bottomHud',
	component: 'Window',	
	padding: 0,
	position: {x: 50, y: 500},
	width: 700,
	height: 70,
	layout: [5, 2],
	children: [
		{
            id: 'menuButton',
            text: 'menu',
            component: 'Button',
            position: 'center',
            width: 130,
            height: 30,
        	font: {
                color: '#333'
            }
		},
		null,
		{
		    id: 'robotsButton',
		    text: 'robots',
		    component: 'Button',
		    position: 'center',
		    width: 130,
		    height: 30,
        	font: {
                color: '#333'
            }
		},
		{
		    id: 'techButton',
		    text: 'tech',
		    component: 'Button',
		    position: 'center',
		    width: 130,
		    height: 30,
        	font: {
                color: '#333'
            }
		},
		{
		    id: 'statsButton',
		    text: 'stats',
		    component: 'Button',
		    position: 'center',
		    width: 130,
		    height: 30,
        	font: {
                color: '#333'
            }
		},
		{
			component: 'Layout',
			position: 'center', 
			width: 130,
			height: 30,
			layout: [2,1],
			children: [{
			    text: 'Iron: ',
			    component: 'Label',
			    position: 'center',
			    width: 60,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
	        },{
			    id: 'ironLabel',
			    text: '0',
			    component: 'Label',
			    position: 'center',
			    width: 40,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
			}]
		},
		{
			component: 'Layout',
			position: 'center', 
			width: 130,
			height: 30,
			layout: [2,1],
			children: [{
			    text: 'Plastic:',
			    component: 'Label',
			    position: 'center',
			    width: 60,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
	        },{
			    id: 'plasticLabel',
			    text: '0',
			    component: 'Label',
			    position: 'center',
			    width: 40,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
			}]
		},
		{
			component: 'Layout',
			position: 'center', 
			width: 130,
			height: 30,
			layout: [2,1],
			children: [{
			    text: 'Stone:',
			    component: 'Label',
			    position: 'center',
			    width: 60,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
	        },{
			    id: 'stoneLabel',
			    text: '0',
			    component: 'Label',
			    position: 'center',
			    width: 70,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
			}]
		},
		{
			component: 'Layout',
			position: 'center', 
			width: 130,
			height: 30,
			layout: [2,1],
			children: [{
			    text: 'Lead:',
			    component: 'Label',
			    position: 'center',
			    width: 60,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
	        },{
			    id: 'leadLabel',
			    text: '0',
			    component: 'Label',
			    position: 'center',
			    width: 70,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
			}]
		},
		{
			component: 'Layout',
			position: 'center', 
			width: 130,
			height: 30,
			layout: [2,1],
			children: [{
			    text: 'Glass:',
			    component: 'Label',
			    position: 'center',
			    width: 60,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
	        },{
			    id: 'glassLabel',
			    text: '0',
			    component: 'Label',
			    position: 'center',
			    width: 70,
			    height: 30,
	        	font: {
	                color: '#333'
	        	}
			}]
		},
	]
}
},{}],12:[function(require,module,exports){
module.exports={
    id: 'menuOverlay',
	component: 'Window',	
	padding: 0,
	position: {x: 250, y: 100},
	width: 300,
	height: 300,
	layout: [1, 4],
	children: [
		{
			component: 'Label',
			position: 'center',
			width: 260,
			height: 40,
			text: 'MENU'
		},
		null,
		null,
		{
            id: 'quitButton',
            text: 'quit',
            component: 'Button',
            position: 'center',
            width: 260,
            height: 40,
        	font: {
                color: '#333'
            }
		}
	]
}
},{}],13:[function(require,module,exports){
module.exports={
	id: 'robotsWindow',
	component: 'Window',
	padding: 10,
	position: {
		x: 50,
		y: 50
	},
	width: 700,
	height: 400,
	layout: [2, 1],
	children: [{
		id: 'robotsLayoutLeft',
		component: 'Layout',
		layout: [2, 10],
		width: 340,
		height: 380,
		position: 'center',
		children: [{
			text: 'Robots',
			font: {
				size: '24px',
				family: 'Arial'
			},
			component: 'Label',

			position: 'left',

			width: 200,
			height: 40
		}, {
            id: 'robotBuy',
            component: 'Button',
            text: 'Buy robot',
            width: 75,
            height: 40,
            position: 'center',
            font: {
                size: '16px'
            }
        }, {
			id: 'levelsList',
			component: 'List',
			dragX: false,
			padding: 3,
			position: {
				x: 30,
				y: 0
			},
			width: 300,
			height: 310,
			layout: [null, 6],
			children: [

			]
		}]
	}, {
		id: 'robotsLayoutRight',
		component: 'Layout',
		layout: [1, 10],
		width: 340,
		height: 380,
		position: 'center',
		children: [{
			id: 'robotDetailHeader',
			text: '[No robot selected]',
			font: {
				size: '24px',
				family: 'Arial'
			},
			component: 'Label',

			position: 'center',

			width: 300,
			height: 40
		}, {
		id: 'detailPanelTabs',
		component: 'Tabs',

		//Tabs bar height
		tabHeight: 50,
		position: {
			x: 0,
			y: 0
		},
		width: 320,
		height: 360,

		children: [
			{
				id: 'robotDetailLayout',
				component: 'Layout',
				title: 'Detail',
				layout: [1, 10],
				width: 340,
				height: 300,
				position: 'center',
				active: true,
				children: [
					{
						id: 'robotDetailTask',
						component: 'Layout',
						layout: [2, 1],
						width: 300,
						height: 40,
						position: {
							x: -3,
							y: 10
						},
						children: [{
							id: 'robotDetailTaskLabel',
							component: 'Label',
							width: 100,
							height: 30,
							position: {
								x: 0,
								y: 0
							},
							text: 'Task: '
						}, {
							id: 'robotDetailTaskStatus',
							component: 'Label',
							width: 100,
							height: 30,
							text: 'n/a',
							position: 'right',
						}]
					}, {
						id: 'robotDetailInventoryLayout',
						component: 'Layout',
						layout: [2, 1],
						width: 300,
						height: 40,
						position: {
							x: 13,
							y: 6
						},
						children: [{
							id: 'robotDetailInventoryLabel',
							component: 'Label',
							width: 100,
							height: 30,
							position: {
								x: 0,
								y: 0
							},
							text: 'Inventory'
						}, {
							id: 'robotDetailInventoryStatus',
							component: 'Label',
							width: 100,
							height: 30,
							text: 'n/a',
							position: 'right',
						}]
					}, {
						id: 'robotDetailInventory',
						component: 'List',
						position: {
							x: 20,
							y: 5
						},
						width: 270,
						height: 200,
						children: [
	
						]
					}]
				}, {
					id: 'robotProgramLayout',
					component: 'Layout',
					title: 'Program',
					layout: [1, 3],
					width: 340,
					height: 300,
					position: 'center',
					active: false,
					children: [
						{
							id: 'robotProgramCurrentLabel',
							component: 'Label',
							width: 100,
							height: 40,
							position: 'center',
							text: ''
						},
						{
							id: 'robotProgramLayout',
							component: 'Layout',
							title: 'Program',
							layout: [2, 1],
							width: 340,
							height: 40,
							position: 'center',
							active: false,
							children: [
								{
									id: 'robotProgramZeroButton',
									component: 'Button',
									width: 100,
									height: 40,
									position: {
										x: 20,
										y: 0
									},
									text: '0'
								}, {
									id: 'robotProgramOneButton',
									component: 'Button',
									width: 100,
									height: 40,
									position: {
										x: 40,
										y: 0
									},
									text: '1'
								}
							]
						},
						{
							id: 'robotProgramSubmitButton',
							component: 'Button',
							width: 250,
							height: 40,
							position: 'center',
							text: 'Set Command'
						}
						
					]
				}
			]
		}]
	}]
}
},{}],14:[function(require,module,exports){
module.exports={
    id: 'statsWindow',
	component: 'Window',	
	padding: 10,
	position: {x: 225, y: 50},
	width: 350,
	height: 400,
	layout: [2, 1],
	children: [
	    {
	        id: 'statsLayout',
	        component: 'Layout',
	        layout: [1,10],
	        width: 310,
	        height: 380,
	        position: 'center left',
	        children: [
	            {
        	        text: 'Statistics',
        		    font: {
        		        size: '24px',
        		        family: 'Arial'
        		    },
        		    component: 'Label',
        		    position: 'center',
        		    width: 310,
        		    height: 40
        	    },
    		    {
			        id: 'statsDetailLayout',
			        component: 'Layout',
			        layout: [1,10],
			        width: 310,
			        height: 340,
			        position: 'top center',
			        children: [
		    	    ]
			    }
        	]
	    }
	]
}
},{}],15:[function(require,module,exports){
module.exports={
    id: 'techWindow',
	component: 'Window',	
	padding: 10,
	position: {x: 50, y: 50},
	width: 700,
	height: 400,
	layout: [2, 1],
	children: [
	    {
	        id: 'techLayout',
	        component: 'Layout',
	        layout: [1,10],
	        width: 340,
	        height: 380,
	        position: 'center',
	        children: [
	            {
        	        text: 'Tech',
        		    font: {
        		        size: '24px',
        		        family: 'Arial'
        		    },
        		    component: 'Label',
        
        		    position: 'center',
        
        		    width: 300,
        		    height: 40
        	    },
            	{
            		id: 'techList',
            		component: 'List',
            		dragX:false,
            		padding: 3,
            		position: {x: 30, y: 0},
            		width: 300,
            		height: 310,
            		layout: [null, 6],
            		children: [
            		    
            		]
            	}
        	]
	    },
	    {
	        id: 'techDetailLayout',
	        component: 'Layout',
	        layout: [1,10],
	        width: 340,
	        height: 380,
	        position: 'center',
	        children: [
	            {
	            	id: 'techDetailHeader',
        	        text: '[no tech selected]',
        		    font: {
        		        size: '24px',
        		        family: 'Arial'
        		    },
        		    component: 'Label',
        
        		    position: 'center',
        
        		    width: 300,
        		    height: 40
        	    },
        	    {
        	    	id: 'techDetailDescription',
        	    	component: 'Label',
        	    	position: 'center',
        	    	font: {
        	    		size: '16px'
        	    	},
        	    	
        	    	width: 300,
        	    	height: 60,
        	    	
        	    	text: ''
        	    },
        	    {
        	    	id: 'techDetailCosts',
        	    	component: 'Layout',
        	    	position: {x:-100, y:20},
        	    	width: 300,
        	    	height: 200,
        	    	layout: [1,5],
        	    	children: [
        	    		]
        	    },
        	    {
        	    	id: 'techDetailBuy',
        	    	component: 'Layout',
        	    	position: {x:5, y:140},
        	    	width: 300,
        	    	height: 100,
        	    	layout: [1,1],
        	    	children: [
        	    		{
        	    			id: 'techBuyErrorLabel',
			                component: 'Label',
			                width: 290,
			                height: 20,
			                position: {x:0, y:0},
			                text: 'Not enough resources',
			                font: {
			                	color: '#FF0000'
			                }
			            },
        	    		{
        	    			id: 'techBoughtButton',
			                component: 'Header',
			                width: 290,
			                height: 40,
			                position: {x:0, y:-60},
			                text: 'Tech already unlocked'
			            },
			            {
			                id: 'techBuyButton',
			                component: 'Button',
			                width: 290,
			                height: 40,
			                position: {x:0, y:-160},
			                text: 'Unlock'
			            }
    	    		]
        	    }
    	    ]
	    }
	]
}
},{}],16:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'testgame');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":29,"./states/gameover":30,"./states/menu":31,"./states/play":32,"./states/preload":33}],17:[function(require,module,exports){
'use strict';


var Robot = require("../prefabs/robot");
  
var City = function(game, x, y, frame) {
  this.game = game;
  this.position = new Phaser.Point(x, y);
  
  this.storage = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  };
  
  // TODO FInd airlock
  this.airlock = {'position': new Phaser.Point(61,64)};
  // initialize your prefab here
  
};

City.prototype = Object.create(Object.prototype);
City.prototype.constructor = City;

City.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};


City.prototype.transferResource = function (robot) {
  for (var key in this.inventory) {
    if (robot.inventory.hasOwnProperty(key)) {
      this.storage[key] += robot.inventory[key];
      
      robot.inventory[key] = 0;
    }
  }
};

City.prototype.buyRobot = function () {
  if (this.game.techTree.hasAchieved('robotFactory')) {
    if (this.storage["iron"] >= 250 && this.storage["plastic"] >= 250) {
      this.storage["iron"] -= 250;
      this.storage["plastic"] -= 250;
      
      this.addRobot();
      
      return true;
    }
  }
  
  return false;
}


    
City.prototype.initRobot = function(){
  this.robots = [];
  this.addRobot();
};
    
City.prototype.addRobot = function () {
  var robot = new Robot(this.game, 64, 64);
  this.robots.push(robot);
  this.game.add.existing(robot);
  
}


module.exports = City;

},{"../prefabs/robot":24}],18:[function(require,module,exports){
var EndState = require("../commandStates/endState");

function Command (game, robot) {
    this.game = game;
    this.robot = robot;
    this.state = new EndState(this);
}

Command.prototype = Object.create(Object.prototype);

Command.prototype.goState = function (state) {
    console.log("State: " + this.state.name + " ==> " + state.name);
    this.state = state;
    this.state.start();
};

Command.prototype.update = function () {
    this.state.update();
};

Command.prototype.toString = function () {
    console.warn("command.toString() is not implemented");
    return "<command>";
};

Command.prototype.isFinished = function () {
    return this.state.isFinal();
};

module.exports = Command;

},{"../commandStates/endState":6}],19:[function(require,module,exports){
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

},{"../commandStates/exploreState":7,"../utils":34,"./command":18}],20:[function(require,module,exports){
var Command = require("./command");
var Utils = require("../utils");

var AirlockState = require("../commandStates/airlockState");
var CityDumpState = require("../commandStates/cityDumpState");
var DriveState = require("../commandStates/driveState");
var FindNodeState = require("../commandStates/findNodeState");

function MineCommand (game, robot, resourceType) {
    Command.call(this, game, robot);

    this.resourceType = resourceType;
    this.resource = null;
    this.airlock = this.game.city.airlock;

    this.goState(new FindNodeState(this));
}

Utils.extend(Command, MineCommand);

MineCommand.prototype.goToAirlock = function () {
    var destination = this.airlock.position;
    this.goState(new DriveState(this, destination,
                                new AirlockState(this, (function(){this.goToCity();}).bind(this))));
};

MineCommand.prototype.goToCity = function () {
    var destination = Utils.pixelsToTile(this.game.city.position);
    this.goState(new DriveState(this, destination,
                                new CityDumpState(this)));
};

MineCommand.prototype.toString = function () {
    return "Mine " + this.resourceType;
};

module.exports = MineCommand;

},{"../commandStates/airlockState":2,"../commandStates/cityDumpState":3,"../commandStates/driveState":5,"../commandStates/findNodeState":8,"../utils":34,"./command":18}],21:[function(require,module,exports){
var Command = require("./command");
var Utils = require("../utils");

var AirlockState = require("../commandStates/airlockState");
var DriveState = require("../commandStates/driveState");
var EndState = require("../commandStates/endState");

function OffCommand (game, robot) {
    Command.call(this, game, robot);

    var destination = this.game.city.airlock.position;

    this.goState(new DriveState(this, destination,
                                new AirlockState(this, (function(){this.goToCity();}).bind(this))));
}

Utils.extend(Command, OffCommand);

OffCommand.prototype.goToCity = function () {
    var destination = Utils.pixelsToTile(this.game.city.position);
    this.goState(new DriveState(this, destination,
                                new EndState(this)));
};

OffCommand.prototype.toString = function () {
    return "Off";
};

module.exports = OffCommand;

},{"../commandStates/airlockState":2,"../commandStates/driveState":5,"../commandStates/endState":6,"../utils":34,"./command":18}],22:[function(require,module,exports){
'use strict';

var Resource = function(resourceMap, tile) {
    this.resourceMap = resourceMap;
    this.tile = tile;

    this.tile.properties["mineSpeed"] = parseInt(this.tile.properties["mineSpeed"]);
    this.tile.properties["resourceCount"] = parseInt(this.tile.properties["resourceCount"]);
}

Resource.prototype = Object.create(Object.prototype);

Resource.prototype.mine = function(robot) {
    var mineSpeed = this.tile.properties["mineSpeed"];
    var resourceCount = this.tile.properties["resourceCount"];
    var mined = Math.min(mineSpeed, resourceCount, robot.getCapacity());
    
    resourceCount -= mined;
    
    if (resourceCount <= 0) {
        this.delete();
    }
    
    
    this.tile.properties["resourceCount"] = resourceCount;
    
    robot.addResource(this.tile.properties["resourceName"], mined);
    
    return mined;
}

Resource.prototype.delete = function() {
    this.resourceMap.removeDepletedResource(this.tile, this.tile.properties["resourceName"]);
}

Resource.prototype.isDepleted = function () {
    return this.tile.properties["resourceCount"] <= 0;
}


module.exports = Resource;
},{}],23:[function(require,module,exports){
'use strict';

var Resource = require('./resource');

var ResourceMap = function(game, layerName) {
    this.game = game;
    this.layerName = layerName;
    
    this.init();
}

ResourceMap.prototype = Object.create(Object.prototype);

ResourceMap.prototype.init = function() {
    this.resourceMap = {};    
    
    
    for (var y = 0; y < this.game.map.height; y++) {
        for (var x = 0; x < this.game.map.width; x++) {

            var resourceTile = this.game.map.getTile(x, y, this.game.map.getLayer(this.layerName));
            if (resourceTile) {

                var currResourceList = this.resourceMap[resourceTile.properties["resourceName"]] || [];

                currResourceList.push(new Resource(this, resourceTile));

                this.resourceMap[resourceTile.properties["resourceName"]] = currResourceList;
            }
        }
    }
}

ResourceMap.prototype.getClosestResourceByType = function (tileX, tileY, type) {
    var typeList = this.resourceMap[type] || [];
    
    var res = null;
    var resDist = -1;
    
    typeList.forEach(function (item) {
        var dist = Math.sqrt(Math.pow(item.tile.x - tileX, 2) + Math.pow(item.tile.y - tileY, 2));
        
        dist += Math.random() * 5;
        
        
        if (resDist == -1 || dist < resDist) {
            res = item;
            resDist = dist;
        }
    });
    
    return res;
}

ResourceMap.prototype.removeDepletedResource = function (tile, type) {
    var typeList = this.resourceMap[type] || [];
    
    var index = -1;
    
    typeList.forEach((function (item, i) {
        if (item.tile == tile) {
            this.game.map.removeTile(tile.x,  tile.y, this.layerName);
            
            index = i;
        }
    }).bind(this));
    
    if (index > -1) {
        typeList.splice(index, 1);
    }
}


module.exports = ResourceMap;
},{"./resource":22}],24:[function(require,module,exports){
'use strict';

function normalizeAngle(angle) {
  var result = angle;
  if(angle > Math.PI) {
    result = angle - 2*Math.PI;
  }
  if(angle <= -Math.PI) {
    result = angle + 2*Math.PI;
  }
  return result;
}

var MineCommand = require("../prefabs/mineCommand");
var Utils = require("../utils");

var Robot = function(game, x, y, frame) {
  this.currentTile = {x: x, y: y};
  
  Phaser.Sprite.call(this, game, x * 32 + 16, y * 32 + 16, 'robot', frame);

  this.rotationSpeed = 0.02 * Math.PI;
  this.previous_position;
  this.anchor.setTo(0.5, 0.5);
  this.startlocation = new Phaser.Point(x, y);

  var EasyStar = require("../../bower_components/easystarjs");
      
  this.easyStar = new EasyStar.js();
  
  // Pathfinding
  this.currentDestination = null;
  this.path = [];
  this.currentIndexInPath = 0;
  this.currentTarget = null;
  this.hasFailedPathing = false;
  this.hasFinishedPathing = true;
  
  // Home city TODO
  this.city = null;
  
  this.inventory = {
    'glass': 0,
    'iron': 0,
    'lead' : 0,
    'plastic': 0,
    'stone': 0
  }
  
  this.maxCapacity = 100;

  // Commands
  this.command = new MineCommand(this.game, this, 'iron');
};

Robot.prototype = Object.create(Phaser.Sprite.prototype);
Robot.prototype.constructor = Robot;

Robot.prototype.update = function() {
  this.moveToCurrentTarget();
  
  if(this.command) {
    this.command.update();
  }
};

Robot.prototype.moveToCurrentTarget = function() {
  if (!this.currentTarget) return;
  
  var ZeroPoint = new Phaser.Point(0, 0);
  
  var direction = Phaser.Point.subtract(this.currentTarget, this.position);
  var directionAngle = Phaser.Point.angle(direction, ZeroPoint);

  // Floating point is vervelend
  if(Math.abs(directionAngle - this.rotation) < 0.0001) {
    this.rotation = directionAngle;
  }
  
  // Update rotation if needed.
  if(this.rotation != directionAngle) {
    // Not in right rotation, rotate!
    var rotateAngle = normalizeAngle(directionAngle - this.rotation);
    if(rotateAngle < 0) {
      rotateAngle = Math.max(-this.rotationSpeed, rotateAngle);
    } else {
      rotateAngle = Math.min(this.rotationSpeed, rotateAngle);
    }

    this.rotation = normalizeAngle(this.rotation + rotateAngle);
  } else {
    // Right rotation, drive!

    var magnitude = direction.getMagnitude();
    
    direction.setMagnitude(Math.min(1.0 + this.game.techTree.getValueModification('drivingSpeed'), magnitude));
    
    Phaser.Point.add(this.position, direction, this.position);
    
    // Floating point is vervelend
    if(Phaser.Point.subtract(this.currentTarget, this.position).getMagnitude() < 0.0001) {
      this.position = this.currentTarget;
    }
    
    if(this.position == this.currentTarget) {
      this.currentTarget = null;
      this.updatePath();
    }
  }
};

Robot.prototype.updatePath = function () {
    if (!this.path) return;
    
    // Update current tile.
    this.currentTile = new Phaser.Point(this.path[this.currentIndex].x, this.path[this.currentIndex].y);

    this.currentIndex++;
    
    if (this.currentIndex < this.path.length) {
      this.setCurrentTargetForTile(this.path[this.currentIndex].x, this.path[this.currentIndex].y);
    } else {
      this.hasFinishedPathing = true;
      this.path = null;
    }
};

Robot.prototype.setCurrentTargetForTile = function (tileX, tileY) {
  this.currentTarget = new Phaser.Point(tileX * 32 + 16, tileY * 32 + 16);
};


Robot.prototype.setDestination = function(x, y) {
  this.setDestinationPoint({x: x, y: y});
};

Robot.prototype.setDestinationPoint = function(destination) {
  this.hasFailedPathing = false;
  this.hasFinishedPathing = false;

  this.currentDestination = destination;
  
  this.easyStar.setGrid(this.game.collisionData);
      
  this.easyStar.setAcceptableTiles([0]);
      
  this.easyStar.findPath(this.currentTile.x, this.currentTile.y, this.currentDestination.x, this.currentDestination.y, (function( path ) {
      if (path === null || path.length < 2) {
          this.hasFailedPathing = true;
          this.path = [];
      } else {
          this.path = path;
          this.currentIndex = 0;
          
          this.updatePath();
      }
  }).bind(this));
  
  this.easyStar.setIterationsPerCalculation(10000000000);
    
  this.easyStar.calculate();
};

Robot.prototype.clearDestination = function () {
  this.currentDestination = null;
  this.path = [];
  this.currentIndexInPath = 0;
  this.currentTarget = null;
};

Robot.prototype.resourceCount = function () {
  var count = 0;
  
  for (var key in this.inventory) {
    if (this.inventory.hasOwnProperty(key)) {
      count += this.inventory[key];
    }
  }
  
  return count;
};
  
Robot.prototype.getCapacity = function () {
  return Math.max(this.getMaxCapacity() - this.resourceCount(), 0);
};

Robot.prototype.addResource = function (type, count) {
  this.inventory[type] += count;
};

Robot.prototype.isFull = function () {
  return this.getCapacity() == 0;
};

Robot.prototype.isEmpty = function () {
  return this.resourceCount() == 0;
};

Robot.prototype.removeResource = function (type, count) {
  this.inventory["resource"] -= count;
};

Robot.prototype.getMaxCapacity = function () {
  return this.maxCapacity + this.game.techTree.getValueModification('storageSize');
}

Robot.prototype.emptyToCity = function (city) {
  for (var key in this.inventory) {
    if (this.inventory.hasOwnProperty(key)) {
      city.storage[key] += this.inventory[key];
      this.inventory[key] = 0;
    }
  }
};

Robot.prototype.changeCommand = function (bits) {
  this.clearDestination();
  this.command = Utils.bitsToCommand(this.game, this, bits);
}

module.exports = Robot;

},{"../../bower_components/easystarjs":1,"../prefabs/mineCommand":20,"../utils":34}],25:[function(require,module,exports){
'use strict';

var TechTreeNode = require("./techTreeNode");
var TechTreeModificationNode = require("./techTreeModificationNode");
var TechTreeUnlockNode = require("./techTreeUnlockNode");

var TechTree = function() {
    this.tree = [];
    
    this.createModNode('Commands I', 'Increases command input bits by one', {iron: 300}, 'bits', 1);
    this.createModNode('Commands II', 'Increases command input bits by one', {iron: 500, plastic: 500, stone: 500}, 'bits', 1);
    
    this.createModNode('Storage I', 'Increases storage by 25 units', {plastic: 300, stone: 300}, 'storageSize', 25);
    this.createModNode('Storage II', 'Increases storage by 50 units', {plastic: 500, stone: 500}, 'storageSize', 50);
    this.createModNode('Storage III', 'Increases storage by 75 units', {plastic: 800, stone: 800, glass: 800}, 'storageSize', 75);
    
    this.createUnlockNode('RobotFactory', 'Allows you to make new robots', {iron: 300, plastic: 300}, 'robotFactory');
    
    this.createModNode('DriveSpeed I', 'Increases drive speed by 25%', {glass: 300}, 'drivingSpeed', 0.25);
    this.createModNode('DriveSpeed II', 'Increases drive speed by another 50%', {plastic: 500}, 'drivingSpeed', 0.25);
    this.createModNode('DriveSpeed III', 'Increases drive speed by another 75%', {glass: 800, lead: 800},'drivingSpeed', 0.25);
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
},{"./techTreeModificationNode":26,"./techTreeNode":27,"./techTreeUnlockNode":28}],26:[function(require,module,exports){
'use strict';

var Utils = require('../utils');
var TechTreeNode = require('./techTreeNode');

var TechtreeModificationNode = function(name, desc, costs, affectedValue, addition) {
    TechTreeNode.call(this, name, desc, costs);
    
    this.affectedValue = affectedValue;
    this.addition = addition;
}

Utils.extend(TechTreeNode, TechtreeModificationNode);

TechtreeModificationNode.prototype.affects = function (value) {
    return value == this.affectedValue;
}

TechtreeModificationNode.prototype.getModificaton = function () {
    return this.hasAchieved ? this.addition : 0;
}

module.exports = TechtreeModificationNode;
},{"../utils":34,"./techTreeNode":27}],27:[function(require,module,exports){
'use strict';

var TechTreeNode = function(name, desc, costs) {
    this.name = name;
    this.desc = desc;
    this.costs = costs;
    
    this.hasAchieved = false;
}

TechTreeNode.prototype = Object.create(Object.prototype);



module.exports = TechTreeNode;
},{}],28:[function(require,module,exports){
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
},{"../utils":34,"./techTreeNode":27}],29:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],30:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],31:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px sans-serif', fill: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 10};
    this.sprite = this.game.add.sprite(0, 0, 'nuclear');

    this.titleText = this.game.add.text(this.game.width/2, 140, 'ROBOPOCALYPSE', style);
    this.titleText.anchor.setTo(0.5, 0.5);
    
    var story = "Once a vibrant city, after the nuclear disaster five years ago, there is not much left. Protected from the radiation by shields, some people have survived. \
Today, one very old robot was found, and a way off this destroyed world lies before you. It is up to you to make use of this robot, gather the necessary resources, and find a way to save everyone. \n Good luck!";
    
    this.storyText = this.game.add.text(this.game.width/2, 380, story, { font: '20px sans-serif', fill: '#ffffff', align: 'center', wordWrapWidth: 570, wordWrap: true, stroke: '#000000', strokeThickness: 2});
    this.storyText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.width/2, 580, 'Click anywhere to play', { font: '20px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],32:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    canvasHasFocus: true,
    create: function() {
      var self = this;
      var canvasElement = document.getElementById('testgame');
      canvasElement.onmouseout  = function(){ self.canvasHasFocus = false; };
      canvasElement.onmouseover = function(){ self.canvasHasFocus = true; };
      
      
      

      this.initWorld();
      
      var ResourceMap = require('../prefabs/resourceMap');
      this.game.resourceMap = new ResourceMap(this.game, 'Resource');
      
      var TechTree = require("../prefabs/techTree");
      this.game.techTree = new TechTree();
      
      var City = require("../prefabs/city");
      this.game.city = new City(this.game, this.game.map.widthInPixels/2, this.game.map.heightInPixels/2);
      this.game.city.initRobot();
      
      //Set camera to middle of map
      this.game.camera.x = this.game.map.widthInPixels/2 - this.game.camera.width/2;
      this.game.camera.y = this.game.map.heightInPixels/2 - this.game.camera.height/2;
      
      //Set cameraspeed
      this.cameraSpeed = 10;
      
      //Update frequency settings;
      this.updates = 0;
      this.fogUpdateSkip = 4;
  
      //move player with cursor keys
      this.cursors = this.game.input.keyboard.createCursorKeys();
      
      
      //CREATE GUI LAST, MUST HAVE CORRECT REFERENCES
      var Hud = require('../gui/hud');
      this.currentGUI = new Hud(this.game, null, this.city);
      this.currentGUI.setupGUI();
      
      this.game.currentGUI = this.currentGUI;
    },
    update: function() {
      this.updates++;
      if (this.cursors.up.isDown){
        this.game.camera.y -= this.cameraSpeed;
      }else if (this.cursors.down.isDown){
        this.game.camera.y += this.cameraSpeed;
      }
      if (this.cursors.left.isDown){
        this.game.camera.x -= this.cameraSpeed;
      }else if (this.cursors.right.isDown){
        this.game.camera.x += this.cameraSpeed;
      }
      
      this.edgeScroll();
      
      this.fogUpdate();

      this.currentGUI.update();
    },
    
    edgeScrollEnabled: true,
    disableEdgeScroll: function(){
      this.edgeScrollEnabled = false;
    },
    enableEdgeScroll: function(){
      this.edgeScrollEnabled = true;
    },
    
    edgeScroll: function(){
      if(this.canvasHasFocus){
        var deadzone = 50;
        
        var width = this.game.width;
        var height = this.game.height;
        
        var x = this.game.input.mousePointer.x;
        var y = this.game.input.mousePointer.y;
        
        if(x < deadzone){
          this.game.camera.x -= this.cameraSpeed*Math.min((deadzone-x)/deadzone*1.5,1);
        }else if(x > width - deadzone){
          this.game.camera.x += this.cameraSpeed*Math.min((x-width+deadzone)/deadzone*1.5,1);
        }
        
        if(y < deadzone){
          this.game.camera.y -= this.cameraSpeed*Math.min((deadzone-y)/deadzone*1.5,1);
        } else if(y > height - deadzone){
          this.game.camera.y += this.cameraSpeed*Math.min((y-height+deadzone)/deadzone*1.5,1);
        }
      }
    },
    
    fogUpdate: function() {
      
      if(this.updates%this.fogUpdateSkip==0) {
        var self = this;
        this.game.city.robots.forEach(function(robot) {
          var tilex = Math.floor(robot.position.x/self.game.map.tileWidth)
          var tiley = Math.floor(robot.position.y/self.game.map.tileHeight)
          for(var x = -2; x <= 2; x++) {
            for(var y = -2; y<= 2; y++) {
              var tile = self.game.map.getTile(tilex-x,tiley-y,'fog');
              if(tile != null) {
                if(x==0 && y==0)
                  self.game.map.removeTile(tilex,tiley,'fog');
                else {
                  tile.alpha -= 0.008*self.fogUpdateSkip/(Math.abs(x)+Math.abs(y));
                  if(tile.alpha <= 0) {
                    self.game.map.removeTile(tilex-x,tiley-y,'fog');
                  }
                  self.fogLayer.dirty=true;
                }
              }
            }
          }
        });
      }
    },
    
    initWorld: function(){
      this.game.TILESIZE = 32;
      
      
      this.game.map = this.game.add.tilemap('testmap');

      //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
      this.game.map.addTilesetImage('tileset', 'mapTiles');
  
      //create layer
      this.backgroundlayer = this.game.map.createLayer('Ground');
      this.backgroundCornersLayer = this.game.map.createLayer('GroundCorners');
      this.backgroundBordersLayer = this.game.map.createLayer('GroundBorders');
      this.buildingsLayer = this.game.map.createLayer('Building');
      this.airlocksLayer = this.game.map.createLayer('Airlocks');
      this.spawnLayer = this.game.map.createLayer('spawn');

      this.collisionLayer = this.game.map.createLayer('Collision');
      this.collisionLayer.visible = false;
      this.resourceLayer = this.game.map.createLayer('Resource');
      this.fogLayer = this.game.map.createLayer('fog');
      
      
      this.game.collisionData = new Array(this.game.map.width);
      
      for (var y = 0; y < this.game.map.height; y++) {
        var row = new Array(this.game.map.width);
        for (var x = 0; x < this.game.map.width; x++) {
          if (this.game.map.getTile(x, y, 'Collision')) {
            row[x] = 1;
          } else {
            row[x] = 0;
          }
          // Set default fog alpha
          this.game.map.getTile(x, y, 'fog').alpha = 0.9;
        }
        
        this.game.collisionData[y] = row;
      }
      
      // Remove some fog initially.
      var center = 63.5;
      var citysize = 2.5;
      var extrafog = 2;
      for (var x = -citysize-extrafog; x <= citysize+extrafog; x++) {
        for (var y = -citysize-extrafog; y <= citysize+extrafog; y++) {
          var sx = Math.floor(center-x);
          var sy = Math.floor(center-y);
          if(x >= -citysize && x <= citysize && y >= -citysize && y <= citysize)
            this.game.map.removeTile(sx,sy,'fog');
          else 
            this.game.map.getTile(sx, sy, 'fog').alpha = Math.max(Math.abs(x)-citysize,Math.abs(y)-citysize)*0.3;
        }
      }
  
      //resizes the game world to match the layer dimensions
      this.backgroundlayer.resizeWorld();
    },
  };
  
  module.exports = Play;
},{"../gui/hud":10,"../prefabs/city":17,"../prefabs/resourceMap":23,"../prefabs/techTree":25}],33:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('robot', 'assets/robot.png', 32, 32);
    this.load.spritesheet('city', 'assets/city.png', 32, 32);
    this.load.image('nuclear', 'assets/nuclear-01.png');
    this.load.image('fog', 'assets/fog.png');
    
    this.load.tilemap('testmap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('mapTiles', 'assets/tileset.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}],34:[function(require,module,exports){
// From http://stackoverflow.com/a/4389429
function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
}

function tileCornerToPixes(tilePoint) {
  return new Phaser.Point(tilePoint.x * 32, tilePoint.y * 32);
}

function tileMidToPixes(tilePoint) {
  return new Phaser.Point(tilePoint.x * 32 + 16, tilePoint.y * 32 + 16);
}

function pixelsToTile(pixelPoint) {
  return new Phaser.Point(Math.floor(pixelPoint.x / 32),
                          Math.floor(pixelPoint.y / 32));
}

function bitsToCommand(game, robot, bits){
  var MineCommand = require("./prefabs/mineCommand");
  var OffCommand = require("./prefabs/offCommand");
  var ExploreCommand = require("./prefabs/exploreCommand");
  
  if (bits.length < 3){
    if (bits.length == 2) {
      bits = bits + "0";
    }
    else {
      bits = bits + "00";
    }
  }
  switch (bits) {
  case "000":
      return new OffCommand(game, robot);
  case "001":
    return new MineCommand(game, robot, "lead");
  case "010":
      return new MineCommand(game, robot, "plastic");
  case "011":
      return new MineCommand(game, robot, "glass");
  case "100":
      return new MineCommand(game, robot, "iron");
  case "101":
      return new ExploreCommand(game, robot);
  case "110":
      return new MineCommand(game, robot, "stone");
  case "111":
      return new OffCommand(game, robot);
  } 
}

module.exports = {
    extend: extend,
    tileCornerToPixes: tileCornerToPixes,
    tileMidToPixes: tileMidToPixes,
    pixelsToTile: pixelsToTile,
    bitsToCommand: bitsToCommand
};

},{"./prefabs/exploreCommand":19,"./prefabs/mineCommand":20,"./prefabs/offCommand":21}]},{},[16])