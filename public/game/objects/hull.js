class Hull extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y, image, size) {
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(size, size);
        game.physics.add.existing(this);
    }
}