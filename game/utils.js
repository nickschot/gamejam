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

module.exports = {
    extend: extend,
    tileCornerToPixes: tileCornerToPixes,
    tileMidToPixes: tileMidToPixes,
    pixelsToTile: pixelsToTile,
};
