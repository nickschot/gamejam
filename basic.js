document.addEventListener("DOMContentLoaded", function(event){ initialize(); });

function initialize() {
    
    var renderer = PIXI.autoDetectRenderer(800, 600);
    document.body.appendChild(renderer.view);
    
    // create the root of the scene graph
    var stage = new PIXI.Container();
    
    loadMap();
    
    //createBackground(stage);
    
    var count = 0;
    
    //animate();
    
    function animate() {
    
        count += 0.005;
    
        // Do animation things
    
        // render the root container
        renderer.render(stage);
    
        requestAnimationFrame(animate);
    }
    
    function createBackground(stage) {
        var texture = PIXI.Texture.fromImage('assets/p2.jpeg');
        var tilingSprite = new PIXI.extras.TilingSprite(texture, renderer.width, renderer.height);
        tilingSprite.tileScale.x = 0.25;
        tilingSprite.tileScale.y = 0.25;
        
        stage.addChild(tilingSprite);
    }
    
};

function loadMap(){
    PIXI.loader.add('assets/map/desert.json', function(res){
        var map = res.tiledMap;
        console.log(map);
    });
    
    PIXI.loader.load();
}