
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
