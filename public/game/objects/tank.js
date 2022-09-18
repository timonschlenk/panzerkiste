class Tank {
    constructor(game, x, y){
        this.game = game;

        this.trackRight = new Track(game, x, y, "Track_1_A");
        this.trackLeft = new Track(game, x, y, "Track_1_A");
        this.tracks = [this.trackRight, this.trackLeft];
        this.hull = new Hull(game, x, y, "Hull_01");
        this.gun = new Gun(game, x, y, "Gun_01");
        this.tankParts = [this.hull, this.gun, this.trackLeft, this.trackRight];
        this.offsetOld = {x: 0, y: 0};

        this.trackRight.play("track1");
        this.trackLeft.play("track1");

        this.angleToRadiant = this.hull.angle*Math.PI/180;
    }

    update (){
        this.gun.angle = this.calculateGunAnlge();
    
        this.angleToRadiant = this.hull.angle*Math.PI/180;
        let offset = {x: Math.sin(this.angleToRadiant), y: Math.cos(this.angleToRadiant)};
        let offsetRelative = {x: this.offsetOld.x - offset.x, y: this.offsetOld.y - offset.y};
    
        for (let i = 0; i < 2; i++){
            if(this.tracks[i].framerateChange != 0){
                if(!this.tracks[i].anims.isPlaying){
                    this.tracks[i].play("track1");
                }
                this.tracks[i].anims.msPerFrame = 500/Math.abs(this.tracks[i].framerateChange);
            } else {
                this.tracks[i].anims.stop()
            }
        }
    
        this.addOffset(this.gun, offsetRelative, 40);
        this.addOffset(this.trackRight, {x: offsetRelative.y, y: offsetRelative.x*-1}, 70);
        this.addOffset(this.trackLeft, {x: offsetRelative.y, y: offsetRelative.x*-1}, -70);
        this.offsetOld = {x: offset.x, y: offset.y};

        this.trackLeft.framerateChange = 0;
        this.trackRight.framerateChange = 0;
    }

    moveForward(){
        this.tankParts.forEach(tankPart => {
            this.move(tankPart, this.angleToRadiant, 4);
        });
        this.trackLeft.framerateChange += 24;
        this.trackRight.framerateChange += 24;
    }

    moveBackward(){
        this.tankParts.forEach(tankPart => {
            this.move(tankPart, this.angleToRadiant, -3);
        });
        this.trackLeft.framerateChange -= 10;
        this.trackRight.framerateChange -= 10;
    }

    rotateRight(){
        this.hull.angle += 3;
        this.rotateTrack("right");
    }

    rotateLeft(){
        this.hull.angle -= 3;
        this.rotateTrack("left");
    }
    
    calculateGunAnlge(){
        let mousePosition = {x: this.game.input.mousePointer.x, y: this.game.input.mousePointer.y};
        let relativeMousePosition = {x: mousePosition.x-this.gun.x, y: mousePosition.y-this.gun.y};
        let anglePositive = Math.atan(relativeMousePosition.y / relativeMousePosition.x)*180/Math.PI + 90
        if (relativeMousePosition.x < 0){
            return anglePositive + 180;
        } else {
            return anglePositive;
        }
    }
    
    move(sprite, angle, factor){
        sprite.x += Math.sin(angle) * factor;
        sprite.y -= Math.cos(angle) * factor;
    }
    
    addOffset(sprite, offset, factor){
        sprite.x += offset.x * factor;
        sprite.y -= offset.y * factor;
    }
    
    rotateTrack(direction){
        if (direction == "left"){
            this.trackLeft.angle -= 3;
            this.trackRight.angle -= 3;
            this.trackLeft.framerateChange += 24;
            this.trackRight.framerateChange -= 10;
        } else {
            this.trackLeft.angle += 3;
            this.trackRight.angle += 3;
            this.trackLeft.framerateChange -= 10;
            this.trackRight.framerateChange += 24;
        }
    }
    
}