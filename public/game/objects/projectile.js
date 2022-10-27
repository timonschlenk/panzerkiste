class Projectile extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, angle, size, label, type, group=0) {
        let images = ["Bullet-Mid", "Sniper-Bullet", "Bullet-Big", "Bullet-Small", "Double-Bullet", "Shotgun", "Laser", "Flamethrower"];
        super(game.matter.world, x, y, images[type], 0, {scale: {x:1, y: 1}, collisionFilter: {group: group}});
        game.add.existing(this);
        if(type === 0 || type === 1 || type === 2 || type === 4){
            this.explosion = this.anims.create({key:"explosion", frames: this.anims.generateFrameNumbers(images[type], {start:0, end: 7}), frameRate:24, repeat: 0});
            this.setFrame(8);
            this.setBody({type:"rectangle", width: 15, height:28}, {label: label, chamfer: {radius: [5, 5, 5, 5] } });
            this.bounces = 0;
            this.setOrigin(0.5, 0.5);
            this.angle = angle;
            this.setScale(size*1.6, size*1.6);
            this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
            this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
            this.setFrictionAir(0);
            this.setBounce(1);
            this.setFixedRotation();
            this.bulletCollision(this);
        } else if(type === 3){

        } else if(type === 5){

        } else if(type === 6){

        } else if(type === 7){
            console.log("hello")
            this.setBody({type:"rectangle", width: 25, height:200}, {label: label, chamfer: {radius: [15, 15, 15, 15] } });
            this.setOrigin(0.5, 0.5);
            this.angle = angle;
            this.setScale(size*1.6, size*1.6);
            this.fire = this.anims.create({key:"fire", frames: this.anims.generateFrameNumbers(images[type], {start:0, end: 7}), frameRate:24, repeat: 0});
            this.fireHold = this.anims.create({key:"fireHold", frames: this.anims.generateFrameNumbers(images[type], {start:3, end: 7}), frameRate:24, repeat: -1});
            this.play("fire");
            window.setTimeout(() => {
                this.play("fireHold");
            },334)
            this.destroyed = false;
           
        }
    }

    fire(){

        clearTimeout(this.destroyTimeout);

        this.body.reset(x, y);
        

        this.setActive(true);
        this.setVisible(true);

        this.destroyTimeout = setTimeout( () => {
            this.destroy();
        }, 8000);
    }

    reflect(){
        if(this.body.blocked.right || this.body.blocked.left){
            this.angle *= -1;
        } else {
            this.angle *= -1;
            this.angle += 180;
        }

        this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
        this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
    }

    explode(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.play("explosion");
        window.setTimeout(() => {
            this.destroy();
        },334)
    }

    bulletCollision(me){
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
                me.setVelocityX(Math.sin(me.angle*Math.PI/180)*size*15);
                me.setVelocityY(-Math.cos(me.angle*Math.PI/180)*size*15);
                if(me.bounces === 2){
                    me.explode();
                }
                me.bounces++;
            } else if (body.label.slice(0, -1) === "bot" || body.label === "player"){
                if(body.health == null){
                    body.health = 4;
                } else {
                    body.health--;
                }
                me.explode();
            } else {
                me.explode();
            }
        })
    }
}