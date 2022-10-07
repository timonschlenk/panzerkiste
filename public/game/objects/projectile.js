class Projectile extends Phaser.Physics.Matter.Sprite {
    constructor(game, x, y, angle, size, label, level) {
        super(game.matter.world, x, y, "Medium_Shell", 0, {scale: {x:1, y: 1}});
        game.add.existing(this);

        this.setBody({type:"rectangle", width: 15, height:28}, {label: label, chamfer: {radius: [5, 5, 5, 5] } });

        this.setOrigin(0.5, 0.5);
        this.angle = angle;
        this.setScale(size*1.6, size*1.6);
        this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
        this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
        this.setFrictionAir(0);
        this.destroyTimeout = setTimeout( () => {
            this.destroy();
        }, 8000);
        this.setBounce(1);
        this.setFixedRotation();
        
        this.setOnCollide( (data) => {
            console.log(data)
            console.log(data.collision.normal)
            let vector = data.collision.normal;
            this.angle *= -1;
            if(vector.y == 1 || vector.y == -1){
                this.angle += 180;
            }
            this.setVelocityX(Math.sin(this.angle*Math.PI/180)*size*15);
            this.setVelocityY(-Math.cos(this.angle*Math.PI/180)*size*15);
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

    destroy(){
        //this.setActive(false);
       // this.setVisible(false);
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
}