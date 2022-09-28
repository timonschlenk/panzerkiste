class Hull extends Phaser.GameObjects.Sprite {
    constructor(game, x, y, image, size) {
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(size, size);
        game.physics.add.existing(this);
        this.body.debug = true;
        this.body.collideWorldBounds = true;
    }
}