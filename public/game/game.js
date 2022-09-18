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

var cursors , tank, gun, trackLeft, trackLeft, trackRight, offsetOld, tracks;

var game = new Phaser.Game(config);


function preload (){
	this.load.path = "/public/assets/";
	this.load.image("Hull_01", "Hulls_Color_A/Hull_01.png");
	this.load.image("Gun_01", "Weapon_Color_A/Gun_01.png");
	this.load.spritesheet("Track_1_A", "Tracks/Track_1_A.png", { frameWidth: 42, frameHeight: 246 });
}

function create (){
	cursors = this.input.keyboard.createCursorKeys();
	trackRight = new Track(this, 500, 500, "Track_1_A");
	trackLeft = new Track(this, 500, 500, "Track_1_A");
	tracks = [trackLeft, trackRight];
	tank = new Tank(this, 500, 500, "Hull_01");
	gun = new Gun(this, 500, 500, "Gun_01");
	offsetOld = {x: 0, y:0};

	trackRight.anims.create({key:"track1", frames: this.anims.generateFrameNumbers("Track_1_A"), frameRate:24, repeat: -1});
	trackLeft.anims.create({key:"track1", frames: this.anims.generateFrameNumbers("Track_1_A"), frameRate:24, repeat: -1});

	trackRight.play("track1");
	trackLeft.play("track1");
}

function update (){
	gun.angle = calculateGunAnlge();

	let angleToRadiant = tank.angle*Math.PI/180;
	let offset = {x: Math.sin(angleToRadiant), y: Math.cos(angleToRadiant)};
	let offsetRelative = {x: offsetOld.x - offset.x, y: offsetOld.y - offset.y};

	let tankParts = [tank, gun, trackLeft, trackRight];

	trackLeft.framerateChange = 0;
	trackRight.framerateChange = 0;

	if (cursors.left.isDown){
		tank.angle -= 3;
		rotateTrack("left");
	} if (cursors.right.isDown){
		tank.angle += 3;
		rotateTrack("right");
	} if (cursors.up.isDown){
		tankParts.forEach(tankPart => {
			move(tankPart, angleToRadiant, 4);
		});
		trackLeft.framerateChange += 24;
		trackRight.framerateChange += 24;
	} if(cursors.down.isDown){
		tankParts.forEach(tankPart => {
			move(tankPart, angleToRadiant, -3);
		});
		trackLeft.framerateChange -= 10;
		trackRight.framerateChange -= 10;
	}

	for (i = 0; i < 2; i++){
		if(tracks[i].framerateChange != 0){
			if(!tracks[i].anims.isPlaying){
				tracks[i].play("track1");
			}
			tracks[i].anims.msPerFrame = 500/Math.abs(tracks[i].framerateChange);
		} else {
			tracks[i].anims.stop()
		}
	}

	addOffset(gun, offsetRelative, 40);
	addOffset(trackRight, {x: offsetRelative.y, y: offsetRelative.x*-1}, 70);
	addOffset(trackLeft, {x: offsetRelative.y, y: offsetRelative.x*-1}, -70);
	offsetOld = {x: offset.x, y: offset.y};
}

function calculateGunAnlge(){
	let mousePosition = {x: game.input.mousePointer.x, y: game.input.mousePointer.y};
	let relativeMousePosition = {x: mousePosition.x-gun.x, y: mousePosition.y-gun.y};
	let anglePositive = Math.atan(relativeMousePosition.y / relativeMousePosition.x)*180/Math.PI + 90
	if (relativeMousePosition.x < 0){
		return anglePositive + 180;
	} else {
		return anglePositive;
	}
}

function move(sprite, angle, factor){
	sprite.x += Math.sin(angle) * factor;
	sprite.y -= Math.cos(angle) * factor;
}

function addOffset(sprite, offset, factor){
	sprite.x += offset.x * factor;
	sprite.y -= offset.y * factor;
}

function rotateTrack(direction){
	if (direction == "left"){
		trackLeft.angle -= 3;
		trackRight.angle -= 3;
		trackLeft.framerateChange += 24;
		trackRight.framerateChange -= 10;
	} else {
		trackLeft.angle += 3;
		trackRight.angle += 3;
		trackLeft.framerateChange -= 10;
		trackRight.framerateChange += 24;
	}
}