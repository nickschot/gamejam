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
    console.log("Jippie, you've discovered the lazy mode :)");
    break;
  } 
}

module.exports = {
    extend: extend,
    tileCornerToPixes: tileCornerToPixes,
    tileMidToPixes: tileMidToPixes,
    pixelsToTile: pixelsToTile,
    bitsToCommand: bitsToCommand
};
