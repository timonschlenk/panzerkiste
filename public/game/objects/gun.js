class Gun extends Phaser.GameObjects.Sprite {
    constructor(game, x, y, image, size) {
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.8);
        this.setScale(size, size);
        this.explosion = this.anims.create({key:"explosion", frames: this.anims.generateFrameNumbers("Bullet", {start:0, end: 7}), frameRate:24, repeat: 0});
    }
}