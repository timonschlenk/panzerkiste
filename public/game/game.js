var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var cursors, keys, pointer, tank, projectiles;

var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.image("Hull_01", "Hulls_Color_A/Hull_01.png");
	this.load.image("Gun_01", "Weapon_Color_A/Gun_01.png");
	this.load.image("Medium_Shell", "Effects/Medium_Shell.png");
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
}

function create (){
	//this.physics.startSystem(Phaser.Physics.ARCADE);
	pointer = this.input.activePointer;
	cursors = this.input.keyboard.createCursorKeys();
	keys = this.input.keyboard.addKeys({ w: 87, a: 65, s: 83 ,d: 68, space: 32});
	tank = new Tank(this, 1000, 500);
	projectiles = new Array();

}

function update (){
	tank.update();

	if (cursors.left.isDown || keys.a.isDown){
		tank.rotateLeft();
	} if (cursors.right.isDown || keys.d.isDown){
		tank.rotateRight();
	} if (cursors.up.isDown || keys.w.isDown){
		tank.moveForward();
	} if(cursors.down.isDown || keys.s.isDown){
		tank.moveBackward();
	}

	if ((keys.space.isDown || pointer.isDown) && tank.framecount >= 12){
		projectiles.push(new Projectile(this, tank.getFrontOfGun().x, tank.getFrontOfGun().y, "Medium_Shell", tank.gun.angle));
		tank.framecount = 0;
	}
}