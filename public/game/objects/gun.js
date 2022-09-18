class Gun extends Phaser.GameObjects.Sprite {
    constructor(game, x, y, image) {
        super(game, x, y, image);
        game.add.existing(this);
        this.setOrigin(0.5, 0.8);
    }
}