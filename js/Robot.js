var TopDownGame = TopDownGame || {};

TopDownGame.Robot = function (game_state, name, position, properties) {
    "use strict";
    TopDownGame.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.walking_speed = +properties.walking_speed;
    this.walking_distance = +properties.walking_distance;
    this.direction = +properties.direction;
    this.axis = properties.axis;
    
    this.previous_position = (this.axis === "x") ? this.x : this.y;
    
    this.animations.add("walking_down", [1, 2, 3], 10, true);
    this.animations.add("walking_left", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_right", [4, 5, 6, 7], 10, true);
    this.animations.add("walking_up", [0, 8, 9], 10, true);
    
    this.stopped_frames = [1, 4, 4, 0, 1];
    
    this.game_state.game.physics.arcade.enable(this);
    if (this.axis === "x") {
        this.body.velocity.x = this.direction * this.walking_speed;
    } else {
        this.body.velocity.y = this.direction * this.walking_speed;
    }
};

TopDownGame.Robot.prototype = Object.create(TopDownGame.Prefab.prototype);
TopDownGame.Robot.prototype.constructor = TopDownGame.Robot;

TopDownGame.Robot.prototype.update = function () {
    "use strict";
    var new_position;
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.walls, this.switch_direction, null, this);
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.blocks, this.switch_direction, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.bombs, this.switch_direction, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
    
    if (this.body.velocity.x < 0) {
        // walking left
        this.scale.setTo(-1, 1);
        this.animations.play("walking_left");
    } else if (this.body.velocity.x > 0) {
        // walking right
        this.scale.setTo(1, 1);
        this.animations.play("walking_right");
    }
    
    if (this.body.velocity.y < 0) {
        // walking up
        this.animations.play("walking_up");
    } else if (this.body.velocity.y > 0) {
        // walking down
        this.animations.play("walking_down");
    }
    
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        // stop current animation
        this.animations.stop();
        this.frame = this.stopped_frames[this.body.facing];
    }
    
    new_position = (this.axis === "x") ? this.x : this.y;
    if (Math.abs(new_position - this.previous_position) >= this.walking_distance) {
        this.switch_direction();
    }
};

TopDownGame.Robot.prototype.switch_direction = function () {
    "use strict";
    if (this.axis === "x") {
        this.previous_position = this.x;
        this.body.velocity.x *= -1;
    } else {
        this.previous_position = this.y;
        this.body.velocity.y *= -1;
    }
};