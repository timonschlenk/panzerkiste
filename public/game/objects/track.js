class Track extends Phaser.GameObjects.Sprite {
    
    constructor(game, x, y, image, size) {
        
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(1*size, 0.9*size);
        this.framerateChange = 0;

        this.track1 = this.anims.create({key:"track1", frames: this.anims.generateFrameNumbers("Track_1_A"), frameRate:24, repeat: -1});

        this.particles = game.add.particles('tiretracks');

        this.emitter = this.particles.createEmitter({
            x: this.x,
            y: this.y,
            angle: this.angle,
            scale: 0.2,
            quantity: 1,
            frequency: 10,
            lifespan: {max: 800, min: 50},
            alpha: { start: 0.5, end: 0 }
        });

        this.emitter.startFollow(this);


    }

    update(angleDeg,framerateChange1, framerateChange2){
        let angle = (angleDeg-90)*Math.PI/180
        let framerateChange = framerateChange1 + framerateChange2
        if(framerateChange < -10){
            this.emitter.followOffset = {x: Math.cos(angle)*25, y: Math.sin(angle)*25};
        } else {
            this.emitter.followOffset = {x: Math.cos(angle)*-25, y: Math.sin(angle)*-25};
        }
    }
    
}