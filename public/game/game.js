var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
            debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var cursors, keys, pointer, tank, size, projectileGroup, tank2, map, tileset, backgroundLayer, collisionLayer;

var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.image("Hull_01", "Hulls_Color_A/Hull_01.png");
	this.load.image("Gun_01", "Weapon_Color_A/Gun_01.png");
	this.load.image("Medium_Shell", "Effects/Medium_Shell.png");
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
	this.load.image("tiles", "tilesExtruded.png")
	this.load.tilemapTiledJSON("map", "panzerkiste.json");
}

function create (){
	projectilesGroup = this.physics.add.group();

	map = this.make.tilemap({key:"map", tileWidth: 32, tileHeight: 32});
	tileset = map.addTilesetImage("tiles1", "tiles", 32, 32, 1, 2);
	level = map.createLayer("level", tileset, 0, 0);

	map.setCollisionByProperty({ collision: true });


	pointer = this.input.activePointer;
	cursors = this.input.keyboard.createCursorKeys();
	keys = this.input.keyboard.addKeys({ w: 87, a: 65, s: 83 ,d: 68, space: 32});
	size = (64/256);
	tank = new Tank(this, this.sys.game.canvas.width/4, this.sys.game.canvas.height/2, size);
	tank2 = new Tank(this, this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, size);
	projectileGroup = new ProjectileGroup(this);


	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	this.cameras.main.startFollow(tank);
	this.cameras.main.zoom = 1.2;
	//this.cameras.main.setRoundPixels(true);

	this.physics.add.collider(tank2.hull, level);
	this.physics.add.collider(tank.hull, level);
	this.physics.add.collider(projectileGroup, tank2.hull, bulletHitsTank);
	this.physics.add.collider(projectileGroup, level);
	this.physics.add.collider(tank.hull, tank2.hull);
	


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
	} if (!(cursors.down.isDown || keys.s.isDown)&&(cursors.up.isDown || keys.w.isDown)){
		tank.moveForward();
	} if ((cursors.down.isDown || keys.s.isDown)&&!(cursors.up.isDown || keys.w.isDown)){
		tank.moveBackward();
	}

	if ((keys.space.isDown || pointer.isDown) && tank.framecount >= 24){
		projectileGroup.fire(tank.getFrontOfGun().x, tank.getFrontOfGun().y, tank.gun.angle, size);
		tank.framecount = 0;
	}

	tank.update();
	tank.updateGunAngle();
	tank2.update();
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

function getRelativePositionToCanvas(gameObject, camera) {
	return {
	  	x: (gameObject.x - camera.worldView.x) * camera.zoom,
	  	y: (gameObject.y - camera.worldView.y) * camera.zoom
	}
}

function bulletHitsTank(tank, bullet){
	bullet.destroy();
}