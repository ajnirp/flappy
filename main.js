var game = new Phaser.Game(400,490,Phaser.AUTO,'gameDiv');

var mainState = {
    preload: function () {
        game.stage.backgroundColor = '#71c5cf';
        
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        
        game.load.audio('jump', 'assets/jump.wav');
    },
    
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');
        
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        this.jumpSound = game.add.audio('jump');
    },
    
    update: function () {
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
        
        if (this.bird.inWorld == false) {
            this.restartGame();
        }
        
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },
    
    jump: function () {
        if (this.bird.alive == false) {
            return;
        }
        
        this.jumpSound.play();
        
        this.bird.body.velocity.y = -350;
        
        this.bird.anchor.setTo(-0.2, 0.5);
        game.add.tween(this.bird).to({ angle: -20 }, 100).start();        
    },
    
    restartGame: function () {
        game.state.start('main');
    },
    
    addOnePipe: function (x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function () {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0 ; i < 8 ; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i*60 + 10);
            }
        }
        
        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    hitPipe: function () {
        if (this.bird.alive == false) {
            return;
        }
        
        this.bird.alive = false;
        
        game.time.events.remove(this.timer);
        this.pipes.forEachAlive(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

game.state.add('main', mainState);
game.state.start('main');