function Game(stage) {
    this.background = new Background();
    stage.addChild(this.background);
};

Game.prototype.update = function() {
    this.background.update();
};