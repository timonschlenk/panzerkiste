class Tank {
    constructor(game, x, y, sizePX){
        this.game = game;

        this.size = sizePX / 256

        this.trackRight = new Track(game, x, y, "Track_1_A", this.size);
        this.trackLeft = new Track(game, x, y, "Track_1_A", this.size);
        this.tracks = [this.trackRight, this.trackLeft];
        this.hull = new Hull(game, x, y, "Hull_01", this.size);
        this.gun = new Gun(game, x, y, "Gun_01", this.size);
        this.tankParts = [this.gun, this.trackLeft, this.trackRight];
        this.offsetOld = {x: 0, y: 0};

        this.trackRight.play("track1");
        this.trackLeft.play("track1");

        this.angleToRadiant = this.hull.angle*Math.PI/180;
        this.framecount = 12;
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
    
        this.addOffset(this.gun, offsetRelative, 40 * this.size);
        this.addOffset(this.trackRight, {x: offsetRelative.y, y: offsetRelative.x*-1}, 70* this.size);
        this.addOffset(this.trackLeft, {x: offsetRelative.y, y: offsetRelative.x*-1}, -70* this.size);
        this.offsetOld = {x: offset.x, y: offset.y};

        this.trackLeft.framerateChange = 0;
        this.trackRight.framerateChange = 0;

        this.framecount++;
    }

    setPosition(object, factor, offset){
        object.x = this.hull.x + offset.x *factor;
        object.y = this.hull.y - offset.y *factor;
    }

    moveForward(){
        this.move(this.hull, this.angleToRadiant, 6*this.size);
        this.setPosition(this.gun, this.size*40, {x: Math.sin(this.angleToRadiant)*-1, y: Math.cos(this.angleToRadiant)*-1});
        this.setPosition(this.trackLeft, this.size * 70, {y: Math.sin(this.angleToRadiant)*-1, x: Math.cos(this.angleToRadiant)});
        this.setPosition(this.trackRight, this.size * -70, {y: Math.sin(this.angleToRadiant)*-1, x: Math.cos(this.angleToRadiant)});
        this.trackLeft.framerateChange += 24;
        this.trackRight.framerateChange += 24;
    }

    moveBackward(){
        this.move(this.hull, this.angleToRadiant, -4*this.size);
        this.setPosition(this.gun, this.size*40, {x: Math.sin(this.angleToRadiant)*-1, y: Math.cos(this.angleToRadiant)*-1});
        this.setPosition(this.trackLeft, this.size * 70, {y: Math.sin(this.angleToRadiant)*-1, x: Math.cos(this.angleToRadiant)});
        this.setPosition(this.trackRight, this.size * -70, {y: Math.sin(this.angleToRadiant)*-1, x: Math.cos(this.angleToRadiant)});
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

    getFrontOfGun(){
        return {x: this.gun.x + Math.sin(this.gun.angle*Math.PI/180)*180*this.size, y: this.gun.y - Math.cos(this.gun.angle*Math.PI/180)*180*this.size}
    }
    
}