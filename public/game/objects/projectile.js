class Projectile extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, angle, size, label, level) {
        super(game.matter.world, x, y, "Bullet", 0, {scale: {x:1, y: 1}});
        game.add.existing(this);
        this.explosion = this.anims.create({key:"explosion", frames: this.anims.generateFrameNumbers("Bullet", {start:0, end: 7}), frameRate:24, repeat: 0});
        this.shot = this.anims.create({key:"shot", frames: this.anims.generateFrameNumbers("Bullet", {start:8, end: 11}), frameRate:24, repeat: 0});
        //this.play("shot")
        this.setFrame(11);

        this.setBody({type:"rectangle", width: 15, height:28}, {label: label, chamfer: {radius: [5, 5, 5, 5] } });
        this.bounces = 0;
        this.setOrigin(0.5, 0.5);
        this.angle = angle;
        this.setScale(size*1.6, size*1.6);
        this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
        this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
       /* window.setTimeout( () => {
            let correctAngle = Math.atan((this.body.velocity.x/size/15)/(-this.body.velocity.y/size/15))/Math.PI*180
            console.log(correctAngle)
            this.angle = correctAngle
        },100)*/
        this.setFrictionAir(0);
        this.setBounce(1);
        this.setFixedRotation();
        this.setOnCollide( (data) => {
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
                this.angle *= -1;
                console.log(vector)
                if(vector.y === -1 || vector.y === 1){
                    this.angle += 180;
                }
                this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
                this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
                if(this.bounces === 2){
                    this.explode();
                }
                this.bounces++;
            } else if (body.label.slice(0, -1) === "bot" || body.label === "player"){
                if(body.health == null){
                    body.health = 4;
                } else {
                    body.health--;
                }
                this.explode();
            } else {
                this.explode();
            }
        })
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
}