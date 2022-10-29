var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'matter',
		matter: {
            debug: false,
			gravity: {y:0}
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var cursors, keys, pointer, tank, size, map, tileset, backgroundLayer, collisionLayer, tanks, projectiles, border, shapes, projectilesBots, counterBots;
var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.spritesheet("Hulls_A", "Hulls_Color_A/Hulls.png", { frameWidth: 256, frameHeight: 256});
	this.load.atlas("Gun_01_A", "Weapon_Color_A/guns.png", "Weapon_Color_A/guns-atlas.json");
	this.load.spritesheet("Hulls_B", "Hulls_Color_B/Hulls.png", { frameWidth: 256, frameHeight: 256});
	this.load.image("Gun_01_B", "Weapon_Color_B/Gun_01.png");
	this.load.spritesheet("Hulls_C", "Hulls_Color_C/Hulls.png", { frameWidth: 256, frameHeight: 256});
	this.load.image("Gun_01_C", "Weapon_Color_C/Gun_01.png");
	this.load.spritesheet("Hulls_D", "Hulls_Color_D/Hulls.png", { frameWidth: 256, frameHeight: 256});
	this.load.image("Gun_01_D", "Weapon_Color_D/Gun_01.png");

	this.load.spritesheet("Health", "Effects/healthbar.png", { frameWidth: 68, frameHeight: 16});

	this.load.spritesheet("Bullet-Mid", "Effects/Bullet-Mid.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Bullet-Big", "Effects/Bullet-Big.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Bullet-Small", "Effects/Bullet-Small.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Bullet-Double", "Effects/Double.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Bullet-Sniper", "Effects/Sniper.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Bullet-Shotgun", "Effects/Shotgun.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Laser", "Effects/Laser.png", { frameWidth: 128, frameHeight: 128});
	this.load.spritesheet("Flamethrower", "Effects/Flames.png", { frameWidth: 256, frameHeight: 256});
	
	
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
	this.load.image("tiles", "tilesExtruded.png")
	this.load.tilemapTiledJSON("map", "panzerkiste.json");
	this.load.image("transparent", "transparents.png");
	this.load.json("shapes", "shapes.json");
	this.load.atlas('explosion', 'Effects/explosion.png', 'Effects/explosion.json');
	this.load.image("tiretracks", "Effects/Tire_Track_01.png");
}

function create (){
	size = (64/256);

	map = this.make.tilemap({key:"map", tileWidth: 32, tileHeight: 32});
	tileset = map.addTilesetImage("tiles1", "tiles", 32, 32, 1, 2);
	level = map.createLayer("level", tileset, 0, 0);
	map.setCollisionByProperty({ collision: true });
	shapes = this.cache.json.get('shapes');
	addBorders(this);

	pointer = this.input.activePointer;
	cursors = this.input.keyboard.createCursorKeys();
	keys = this.input.keyboard.addKeys({ w: 87, a: 65, s: 83 ,d: 68, space: 32, one: 49, two:50, three:51, four:52, five:53, six:54, seven:55, eight:56});

	projectiles = new Array();
	counter = 0;

	tank = new Tank(this, 1000, 400, size, "A", "player");
	tanks = [new Tank(this, 300, 800, size, "B", "bot1"), new Tank(this, 200, 200, size, "C", "bot2"), new Tank(this, 1500, 1000, size, "D", "bot3")];

	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	this.cameras.main.startFollow(tank);
	this.cameras.main.zoom = calculateScale(this.sys.game.canvas.height, this.sys.game.canvas.width)*1.5;
}

function update (){
	upgradeTank();
	tankControls();
	shooting(this);
	tank.update();
	tank.updateGunAngle(true);
	
	tanks.forEach( bot => {
		bot.update();
		bot.updateGunAngle(false, {x: tank.x, y: tank.y});
	})
}

function tankControls(){
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
}

function shooting(game){
	let number = [5, 1, 7, 4, 0, 10];
	let framecount = [24, 72, 24, 24, 0, 24];
	if ((keys.space.isDown || pointer.isDown) && tank.framecount >= framecount[tank.type] && projectiles.length < number[tank.type] && !tank.destroyed){
		if (tank.type === 0 || tank.type === 1 || tank.type === 2 || tank.type === 3){
			projectiles.push(new Projectile(game, tank.getFrontOfGun().x, tank.getFrontOfGun().y, tank.gun.angle, size, `projectile_${counter}`, tank.type));
			counter++;
			tank.framecount = 0;
		} else if (tank.type === 4){
	
		} else if (tank.type === 5){
			for (i = -1; i < 2; i+=2){
				projectiles.push(new Projectile(game, tank.getFrontOfGun(1,i*5).x, tank.getFrontOfGun(1,i*5).y, tank.gun.angle+i*3, size, `projectile_${counter}`, tank.type));
				counter++;
			}
			tank.framecount = 0;
		} else if (tank.type === 6){
	
		} else if (tank.type === 7){
	
		}
	}

	for (i = 0; i < projectiles.length; i++){
		if(!projectiles[i].active){
			projectiles.splice(i,1);
		}
	}
}

function calculateScale(gameHeight, gameWidth){
	return (gameHeight/1260+gameWidth/1920)/2
}

function getRelativePositionToCanvas(gameObject, camera) {
	return {
	  	x: (gameObject.x - camera.worldView.x) * camera.zoom,
	  	y: (gameObject.y - camera.worldView.y) * camera.zoom
	}
}

function addBorders(game){
	shapesResized = shapes;
	for(i = 0; i < shapes.level.fixtures[0].vertices.length; i++){
		for(j = 0; j < shapes.level.fixtures[0].vertices[i].length; j++){
			shapesResized.level.fixtures[0].vertices[i][j].x *= 32;
			shapesResized.level.fixtures[0].vertices[i][j].y *= 32;
		}
	}
	border = game.matter.add.sprite(963, 610, "transparent", 0, {shape: shapesResized.level});
	border.setStatic(true);
}

function upgradeTank(){
	if(keys.one.isDown){
		tank.upgrade(1);
	} else if(keys.two.isDown){
		tank.upgrade(2);
	} else if(keys.three.isDown){
		tank.upgrade(3);
	} else if(keys.four.isDown){
		tank.upgrade(4);
	} else if(keys.five.isDown){
		tank.upgrade(5);
	} else if(keys.six.isDown){
		tank.upgrade(6);
	} else if(keys.seven.isDown){
		tank.upgrade(7);
	} else if(keys.eight.isDown){
		tank.upgrade(8);
	}
}