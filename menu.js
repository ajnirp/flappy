var menuState = {
    create: function () {
        game.add.image(0, 0, 'background');
        game.add.image(12, 52, 'logo');
        
        var pressStartText = game.add.text(game.world.centerX,
                                           game.world.height - 100,
                                           'press space to start',
                                           { font: '25px Arial', fill: '#000000' })
        
        pressStartText.anchor.setTo(0.5, 0.5);
        
        var tween = game.add.tween(pressStartText);
        tween.to({ y: game.world.height - 130 }, 400);
        tween.to({ y: game.world.height - 100 }, 400);
        tween.loop();
        tween.easing(Phaser.Easing.Sinusoidal.In);
        tween.start();
        
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(this.start, this);
    },
    
    start: function () {
        game.state.start('play');
    }
}