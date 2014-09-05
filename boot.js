var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var bootState = {
    preload: function () {
        game.load.spritesheet('bird', 'assets/bird/123.png', 68, 48, 3);
        
        game.load.image('pipeTop', 'assets/pipe/top.png');
        game.load.image('pipeBottom', 'assets/pipe/bottom.png');
        
        game.load.image('background', 'assets/background.png');
        
        game.load.image('logo', 'assets/logo.png');
        
        game.load.audio('jump', 'assets/jump.wav');
    },
    
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('menu');
    }
};