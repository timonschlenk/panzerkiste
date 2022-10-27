class Gun extends Phaser.GameObjects.Sprite {
    constructor(game, x, y, image, size, frame) {
        super(game, x, y, image, frame);
        game.add.existing(this);
        this.setOrigin(0.5, 0.8);
        this.size = size;
        this.setScale(size*1.1, size*1.1);
        this.explosion = this.anims.create({key:"explosion", frames: this.anims.generateFrameNumbers("Bullet", {start:0, end: 7}), frameRate:24, repeat: 0});
    }

    upgrade(type){
        this.setFrame("Gun_0"+ (type+1)+".png")
        if(type === 0){
            this.setOrigin(0.5, 0.8);
            this.setScale(this.size*1.1, this.size*1.1);
        } else if (type === 1){
            this.setOrigin(0.5, 0.67);
            this.setScale(this.size*1.3, this.size*1.3);
        } else if (type === 2){
            this.setOrigin(0.5, 0.8);
            this.setScale(this.size*1.5, this.size*1.5);
        } else if (type === 3){
            this.setOrigin(0.5, 0.77);
            this.setScale(this.size*1.5, this.size*1.4);
        } else if (type === 4 || type === 5){
            this.setOrigin(0.5, 0.8);
            this.setScale(this.size*1.4, this.size*1.4);
        } else if (type === 6){
            this.setOrigin(0.5, 0.77);
            this.setScale(this.size*1.2, this.size*1.2);
        } else if (type === 7){
            this.setOrigin(0.5, 0.7);
            this.setScale(this.size*1.4, this.size*1.5);
        }
    }
}