var gWid = 600;
var gHig = 600;
var game = new Phaser.Game(gWid, gHig, Phaser.Auto);

game.state.add('gameState', gameState);
game.state.start('gameState');