class Tank {
    constructor(game, x, y, size){
        this.size = size;
        this.game = game;

        this.trackRight = new Track(game, x, y, "Track_1_A", size);
        this.trackLeft = new Track(game, x, y, "Track_1_A", size);
        this.tracks = [this.trackRight, this.trackLeft];

        this.hull = new Hull(game, x, y, "Hull_01", size);
        this.gun = new Gun(game, x, y, "Gun_01", size);


        this.trackRight.play("track1");
        this.trackLeft.play("track1");

        this.angle = this.hull.angle*Math.PI/180;
        this.x = this.hull.x;
        this.y = this.hull.y;

        this.framecount = 12;
    }

    //called every frame in update
    update (){
        //rotate gun, so that it's facing mousepointer
        this.gun.angle = this.calculateGunAnlge();

        //Managing how fast the tracks change frame
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
        this.trackLeft.framerateChange = 0;
        this.trackRight.framerateChange = 0;
        this.framecount++;
        
        //updating core properties of tank
        this.angle = this.hull.angle*Math.PI/180;
        this.x = this.hull.x;
        this.y = this.hull.y;

        //moving other tankParts than hull to the position of hull and giving them the correct angle and offset
        this.adjustTankparts();
    }

    //called in update when "w" is pushed
    moveForward(){
        this.move(this.hull, this.angle, 6*this.size);
        this.trackLeft.framerateChange += 24;
        this.trackRight.framerateChange += 24;
    }

    //called in update when "s" is pushed
    moveBackward(){
        this.move(this.hull, this.angle, -4*this.size);
        this.trackLeft.framerateChange -= 10;
        this.trackRight.framerateChange -= 10;
    }

    //called in update when "d" is pushed
    rotateRight(){
        this.hull.angle += 3;
        this.trackLeft.framerateChange -= 10;
        this.trackRight.framerateChange += 24;
    }

    //called in update when "a" is pushed
    rotateLeft(){
        this.hull.angle -= 3;
        this.trackLeft.framerateChange += 24;
        this.trackRight.framerateChange -= 10;
    }
    
    //rotate gun, so that it's facing mousepointer
    calculateGunAnlge(){
        let mousePosition = {x: this.game.input.activePointer.worldX, y: this.game.input.activePointer.worldY};
        let relativeMousePosition = {x: mousePosition.x-this.gun.x, y: mousePosition.y-this.gun.y};
        let anglePositive = Math.atan(relativeMousePosition.y / relativeMousePosition.x)*180/Math.PI + 90
        if (relativeMousePosition.x < 0){
            return anglePositive + 180;
        } else {
            return anglePositive;
        }
    }
    
    //move sprite in a direction (angle) with a velocity pixels/frame determined by factor
    move(sprite, angle, factor){
        sprite.x += Math.sin(angle) * factor;
        sprite.y -= Math.cos(angle) * factor;
    }
    
    //reset the sprites position and then add offset
    addOffset(sprite, offset, factor){
        sprite.x = this.hull.x;
        sprite.x += offset.x * factor;
        sprite.y = this.hull.y;
        sprite.y -= offset.y * factor;
    }

    //called when fireing a bullet
    getFrontOfGun(){
        return {x: this.gun.x + Math.sin(this.gun.angle*Math.PI/180)*180*this.size, y: this.gun.y - Math.cos(this.gun.angle*Math.PI/180)*180*this.size}
    }

    //reseting core parameters of tankparts to those of hull and adding the right offset
    adjustTankparts(){
        this.trackRight.angle = this.hull.angle;
        this.trackLeft.angle = this.hull.angle;

        let offset = {x: Math.sin(this.angle), y: Math.cos(this.angle)};
    
        this.addOffset(this.gun, offset, -40 * this.size);
        this.addOffset(this.trackRight, {x: offset.y, y: offset.x*-1}, 70* this.size);
        this.addOffset(this.trackLeft, {x: offset.y, y: offset.x*-1}, -70* this.size);
    }
      
}