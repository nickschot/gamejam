function init() {
    main = new Main();
}

function Main() {
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(800, 600);
    document.body.appendChild(this.renderer.view);
    
    this.game = new Game(this.stage);
    
    requestAnimationFrame(this.update.bind(this));
};

Main.prototype.update = function() {
    this.game.update();
    this.renderer.render(this.stage);
    requestAnimationFrame(this.update.bind(this));
};