var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var cursors, tank;

var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.image("Hull_01", "Hulls_Color_A/Hull_01.png");
	this.load.image("Gun_01", "Weapon_Color_A/Gun_01.png");
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
}

function create (){
	cursors = this.input.keyboard.createCursorKeys();
	tank = new Tank(this, 1000, 500);
}

function update (){
	tank.update();

	if (cursors.left.isDown){
		tank.rotateLeft();
	} if (cursors.right.isDown){
		tank.rotateRight();
	} if (cursors.up.isDown){
		tank.moveForward();
	} if(cursors.down.isDown){
		tank.moveBackward();
	}
}