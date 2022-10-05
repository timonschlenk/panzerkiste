class Hull extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, image, size, label) {
        super(game.matter.world, x, y, image);
        game.add.existing(this);

        this.setBody({type: "rectangle", width:190, height:230 }, {label: label, chamfer: {radius: [30, 30, 30, 30]}});

        this.setOrigin(0.5, 0.5);
        this.setScale(size, size);
        this.setFrictionAir(0.1);
    }
}