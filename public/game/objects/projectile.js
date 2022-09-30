class Projectile extends Phaser.GameObjects.Sprite {
    constructor(game, x, y, image, angle, size) {
        super(game, x, y, image, angle);
        game.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.angle = angle;
        game.physics.add.existing(this);
        this.body.setSize(25,25);
        this.body.velocity.x = Math.sin(this.angle*Math.PI/180)*size*800;
        this.body.velocity.y = -Math.cos(this.angle*Math.PI/180)*size*800;
        this.setScale(size, size);
        this.body.collideWorldBounds = true;
        this.body.onWorldBounds = true;

        this.body.world.on('worldbounds', (body) => {
            if (body.gameObject === this) {
                if(body.touching.up || body.touching.down || body.touching.right){
                    console.log("hello")
                }
                this.angle = -this.angle;
                this.body.velocity.x = Math.sin(this.angle*Math.PI/180)*size*800;
                this.body.velocity.y = -Math.cos(this.angle*Math.PI/180)*size*800;
            }
        }, this);
    }
}