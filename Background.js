function Background() {
    var texture = PIXI.Texture.fromImage('assets/p2.jpeg');
    PIXI.extras.TilingSprite.call(this, texture, 256, 256);
    	
    this.tileScale.x = 0.25;
    this.tileScale.y = 0.25;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;
}

Background.constructor = Background();
Background.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

Background.prototype.update = function() {
  //Do something?
};