class Flame extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, angle, size, label, group=0) {
        super(game.matter.world, x, y, "Flamethrower", 0, {scale: {x:1, y: 1}, collisionFilter: {group: group}});
        game.add.existing(this);
        console.log("hello");
        this.setBody({type:"rectangle", width: 25, height:200}, {label: label, chamfer: {radius: [15, 15, 15, 15] } });
        this.setOrigin(0.5, 0.5);
        this.angle = angle;
        this.setScale(size*1.6, size*1.6);
        this.fire = this.anims.create({key:"fire", frames: this.anims.generateFrameNumbers("Flamethrower", {start:0, end: 7}), frameRate:24, repeat: 0});
        this.fireHold = this.anims.create({key:"fireHold", frames: this.anims.generateFrameNumbers("Flamethrower", {start:3, end: 7}), frameRate:24, repeat: -1});
        this.play("fire");
        window.setTimeout(() => {
            this.play("fireHold");
        },334)
        this.destroyed = false;
    }

    bulletCollision(me){
        me.setOnCollide( (data) => {
           
        })
    }
}