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

var cursors, keys, pointer, tank, projectiles, size;

var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.image("Hull_01", "Hulls_Color_A/Hull_01.png");
	this.load.image("Gun_01", "Weapon_Color_A/Gun_01.png");
	this.load.image("Medium_Shell", "Effects/Medium_Shell.png");
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
	this.load.image("tiles", "tiles.png")
	this.load.tilemapTiledJSON("map", "panzerkiste.json");
}

function create (){

	const map = this.make.tilemap({key:"map", tileWidth: 32, tileHeight: 32});
	const tileset = map.addTilesetImage("tiles1", "tiles");
	const layer = map.createLayer("Background", tileset, 0, 0);
	layer.setScale(calculateScale(this.sys.game.canvas.height,this.sys.game.canvas.width));
	layer.resizeWorld();
	

	pointer = this.input.activePointer;
	cursors = this.input.keyboard.createCursorKeys();
	keys = this.input.keyboard.addKeys({ w: 87, a: 65, s: 83 ,d: 68, space: 32});
	size = ((this.sys.game.canvas.width+ this.sys.game.canvas.height)/20)/256;
	tank = new Tank(this, this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, size);
	projectiles = new Array();

}

function update (){

	if ((cursors.left.isDown || keys.a.isDown)&&!(cursors.right.isDown || keys.d.isDown)){
		if((cursors.down.isDown || keys.s.isDown)&&!(cursors.up.isDown || keys.w.isDown)){
			tank.rotateRight();
		} else {
			tank.rotateLeft();
		}
	} if ((cursors.right.isDown || keys.d.isDown)&&!(cursors.left.isDown || keys.a.isDown)){
		if((cursors.down.isDown || keys.s.isDown)&&!(cursors.up.isDown || keys.w.isDown)){
			tank.rotateLeft();
		} else {
			tank.rotateRight();
		}
	} if (cursors.up.isDown || keys.w.isDown){
		tank.moveForward();
	} if(cursors.down.isDown || keys.s.isDown){
		tank.moveBackward();
	}

	if ((keys.space.isDown || pointer.isDown) && tank.framecount >= 24){
		projectiles.push(new Projectile(this, tank.getFrontOfGun().x, tank.getFrontOfGun().y, "Medium_Shell", tank.gun.angle, size));
		tank.framecount = 0;
	}

	tank.update();
}

function calculateScale(gameHeight, gameWidth){
	let height = gameHeight/1280;
	let width = gameWidth/1920;
	if (height < width){
		return height;
	} else {
		return width;
	}
}