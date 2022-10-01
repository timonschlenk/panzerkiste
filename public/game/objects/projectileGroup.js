class ProjectileGroup extends Phaser.Physics.Arcade.Group {
    constructor(game) {
        super(game.physics.world, game);

        this.createMultiple({
            classType: Projectile,
            frameQuantity: 5,
            active: false,
            visible: false,
            key: "projectile"
        });
    }

    fire(x, y, angle, size){
        const projectile = this.getFirstDead(false);
        console.log(projectile);
        if (projectile){
            projectile.fire(x, y, angle, size);
        }
    }
}