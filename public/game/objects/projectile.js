class Projectile extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, angle, size, label, type) {
        let tankTypeData = [{bounces: 2, velocity: 1, damage: 1, number:1, width:15, height:28, chamfer: [5,5,5,5]},
            {bounces: 0, velocity: 2.5, damage: 2, width:15, height:48, chamfer:[5,5,5,5]},
            {bounces: 4, velocity: 1, damage: 2, width:25, height:48, chamfer:[8,8,8,8]},
            {bounces: 2, velocity: 1, damage: 1, width:10, height:18, chamfer:[2,2,2,2]},
            {},
            {bounces: 2, velocity: 1, damage: 1, width:17, height:30, chamfer:[5,5,5,5]}];
        let images = ["Bullet-Mid", "Bullet-Sniper", "Bullet-Big", "Bullet-Small", "-----", "Bullet-Double"];
        
        super(game.matter.world, x, y, images[type]);
        game.add.existing(this);

        this.explosion = this.anims.create({key:"explosion", frames: this.anims.generateFrameNumbers(images[type], {start:0, end: 7}), frameRate:24, repeat: 0});
        this.setFrame(8);
        this.bounces = 0;

        this.setBody({type:"rectangle", width: tankTypeData[type].width, height: tankTypeData[type].height}, {label: label, chamfer: {radius: tankTypeData[type].chamfer } });
        this.setOrigin(0.5, 0.5);
        this.angle = angle;
        this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15*tankTypeData[type].velocity);
        this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15*tankTypeData[type].velocity);
        this.setScale(size*1.6, size*1.6);
        this.setFrictionAir(0);
        this.setBounce(1);
        this.setFixedRotation();

        this.bulletCollision(this, tankTypeData[type].bounces, tankTypeData[type].velocity, tankTypeData[type].damage);
    }

    explode(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.play("explosion");
        window.setTimeout(() => {
            this.destroy();
        },334)
    }

    bulletCollision(me, bouncesMax, velocity, damage){
        me.setOnCollide( (data) => {
            console.log(data)
            //console.log(data.collision.normal)

            let vector = data.collision.normal;
            let body;
            if(data.bodyA.label.slice(0,-2) === "projectile"){
                body = data.bodyB;
            } else {
                body = data.bodyA;
            }

            if(body.label == "level-fixture"){
                me.angle *= -1;
                console.log(vector)
                if(vector.y === -1 || vector.y === 1){
                    me.angle += 180;
                }
                me.setVelocityX(Math.sin(me.angle*Math.PI/180)*size*15*velocity);
                me.setVelocityY(-Math.cos(me.angle*Math.PI/180)*size*15*velocity);
                if(me.bounces === bouncesMax){
                    me.explode();
                }
                me.bounces++;
            } else if (body.label.slice(0, -1) === "bot" || body.label === "player"){
                if(body.health == null){
                    body.health = 5 -damage;
                } else {
                    body.health -= damage;
                }
                me.explode();
            } else {
                me.explode();
            }
        })
    }
}