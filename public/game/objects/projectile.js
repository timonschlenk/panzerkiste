class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x=500, y=500) {
        super(game, x, y, "Medium_Shell");
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);

        this.angle = 0;
        game.physics.add.existing(this);
        this.body.setSize(25,25);
        this.destroyTimeout = setTimeout( () => {
            this.destroy();
        }, 5000);
        
    }

    fire(x, y, angle, size){

        clearTimeout(this.destroyTimeout);

        this.body.reset(x, y);
        this.angle = angle;
        this.setScale(size, size);
        this.body.velocity.x = Math.sin(this.angle*Math.PI/180)*size*800;
        this.body.velocity.y = -Math.cos(this.angle*Math.PI/180)*size*800;

        this.setActive(true);
        this.setVisible(true);

        this.destroyTimeout = setTimeout( () => {
            this.destroy();
        }, 5000);
    }

    destroy(){
        this.setActive(false);
        this.setVisible(false);
    }
}