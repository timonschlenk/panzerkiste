class Track extends Phaser.GameObjects.Sprite {
    
    constructor(game, x, y, image, size) {
        
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(1*size, 0.9*size);
        this.framerateChange = 0;

        this.track1 = this.anims.create({key:"track1", frames: this.anims.generateFrameNumbers("Track_1_A"), frameRate:24, repeat: -1});
    }
    
}