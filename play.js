var playState = {
    create: function () {
        game.add.image(0, 0, 'background');
        
        this.bird = game.add.sprite(100, 145, 'bird');
        this.bird.animations.add('flapWings');
        this.bird.animations.play('flapWings', 10, true);
        
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.timer = game.time.events.loop(1600, this.addPipes, this);
        // this.timer = game.time.events.loop(3000, this.logStuff, this);
        
        this.initializeScore();
        
        this.jumpSound = game.add.audio('jump');
        
        this.pipes = {};
        this.pipeId = 0;
    },
    
    logStuff: function () {
        console.log(this.pipeId);
    },
    
    initializeScore: function () {
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000000" });
    },
    
    update: function () {
        if (this.bird.angle < 20)
            this.bird.angle += 1;
        
        if (this.bird.inWorld == false)
            this.restartGame();
        
        for (var key in this.pipes) {
            if (this.pipes.hasOwnProperty(key)) {
                var pipe = this.pipes[key];
                game.physics.arcade.overlap(this.bird, pipe, this.hitPipe, null, this);
            }
        }

    },
    
    jump: function () {
        if (this.bird.alive == false)
            return;
        
        this.jumpSound.play();
        
        this.bird.body.velocity.y = -350;
        
        this.bird.anchor.setTo(-0.2, 0.5);
        game.add.tween(this.bird).to({ angle: -20 }, 100).start();        
    },
    
    restartGame: function () {
        game.state.start('menu');
    },
    
    addPipes: function () {
        var pipesGap = 140;
        // y coordinate of top of the gap
        var gapTop = 50 + Math.floor(Math.random() * (490 - 300));
        
        var pipeTop = game.add.sprite(400, gapTop - 490, 'pipeTop');
        var pipeBottom = game.add.sprite(400, gapTop + pipesGap, 'pipeBottom');
        
        pipeTop.pipeId = this.pipeId;
        this.pipeId = (1 + this.pipeId) % 4;
        pipeBottom.pipeId = this.pipeId;
        this.pipeId = (1 + this.pipeId) % 4;
        
        this.pipes[pipeTop.pipeId] = pipeTop;
        this.pipes[pipeBottom.pipeId] = pipeBottom;
        
        game.physics.arcade.enable(pipeTop);
        game.physics.arcade.enable(pipeBottom);
        
        pipeTop.body.velocity.x = -200;
        pipeBottom.body.velocity.x = -200;
        
        pipeTop.checkWorldBounds = true;
        pipeBottom.checkWorldBounds = true;
        
        pipeTop.events.onOutOfBounds.add(this.pipeOutOfBounds, this);
        pipeBottom.events.onOutOfBounds.add(this.pipeOutOfBounds, this);
        
        pipeTop.outOfBoundsKill = true;
        pipeBottom.outOfBoundsKill = true;
        
        this.incrementScore();
    },
    
    pipeOutOfBounds: function (pipe) {
        delete this.pipes[pipe.pipeId];
    },
    
    incrementScore: function () {
        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    hitPipe: function () {
        if (this.bird.alive == false)
            return; 
        
        this.bird.alive = false;
        
        game.time.events.remove(this.timer);
        
        // stop all pipes from moving
        for (var key in this.pipes)
            if (this.pipes.hasOwnProperty(key))
                this.pipes[key].body.velocity.x = 0;
    }
};

game.state.add('boot', bootState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');