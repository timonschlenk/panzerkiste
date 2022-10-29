class Tank {
    constructor(game, x, y, size, color, label){
        this.size = size;
        this.game = game;
        this.type = 0;

        this.trackRight = new Track(game, x, y, "Track_1_A", size);
        this.trackLeft = new Track(game, x, y, "Track_1_A", size);
        this.tracks = [this.trackRight, this.trackLeft];

        this.hull = new Hull(game, x, y, "Hulls_" + color, size, label);
        this.gun = new Gun(game, x, y, "Gun_01_" + color, size, "Gun_01.png");

        this.trackRight.play("track1");
        this.trackLeft.play("track1");

        this.healthbar = game.add.sprite(x,y,"Health");
        this.healthbar.setScale(size*2,size*2);
        this.healthbar.setFrame(5);
        this.healthbar.alpha = 0.8;

        this.angle = this.hull.angle*Math.PI/180;
        this.x = this.hull.x;
        this.y = this.hull.y;

        this.framecount = 12;
        this.resitance = 0.8;
        this.hull.body.health = 6;
        this.healthOld = this.hull.body.health;
        this.destroyed = false;

        this.particles = game.add.particles("explosion")

        this.particles.createEmitter({
            frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
            angle: { min: 240, max: 300 },
            speed: { min: 0, max: 20 },
            quantity: 3,
            lifespan: {max: 1000, min: 500},
            alpha: { start: 0.5, end: 0 },
            scale: { start: 0.5, end: 0.1 },
            on: false
        });

        this.particles.createEmitter({
            frame: 'muzzleflash2',
            lifespan: 200,
            alpha: { start: 0.3, end: 0 },
            scale: { start: 0.4, end: 0 },
            rotate: { start: 0, end: 180 },
            on: false
        });
    }

    updateGunAngle(player, posPlayer){
        if(!this.destroyed){
            this.gun.angle = this.calculateGunAnlge(player, posPlayer);
        }
    }

    //called every frame in update
    update(){
        if(!this.destroyed){
            this.healthbar.alpha -= 0.01;
            //Managing how fast the tracks change frame
            for (let i = 0; i < 2; i++){
                if(this.tracks[i].framerateChange != 0){
                    if(!this.tracks[i].anims.isPlaying){
                        this.tracks[i].play("track1");
                    }
                    this.tracks[i].anims.msPerFrame = 500/Math.abs(this.tracks[i].framerateChange);
                    this.tracks[i].emitter.start();
                } else {
                    this.tracks[i].anims.stop()
                    this.tracks[i].emitter.stop()
                }
                this.tracks[i].update(this.hull.angle, this.tracks[0].framerateChange, this.tracks[1].framerateChange);
                this.tracks[i].framerateChange = 0;
            }
            this.framecount++;
            
            //updating core properties of tank
            this.angle = this.hull.angle*Math.PI/180;
            this.x = this.hull.x;
            this.y = this.hull.y;

            //moving other tankParts than hull to the position of hull and giving them the correct angle and offset
            this.adjustTankparts();
            //console.log(this.hull)
            if(this.healthOld!=this.hull.body.health){
                this.healthbar.alpha = 1;
            }
            this.healthbar.setFrame(this.hull.body.health-1);
            this.healthOld = this.hull.body.health;
            if(this.hull.body.health <= 0){
                this.destroy();
                this.destroyed = true;
            }
        }
    }

    //called in update when "w" is pushed
    moveForward(){
        if(!this.destroyed){
            this.move(this.hull, this.angle, 8*this.size);
            this.trackLeft.framerateChange += 24;
            this.trackRight.framerateChange += 24;
        }
    }

    //called in update when "s" is pushed
    moveBackward(){
        if(!this.destroyed){
            this.move(this.hull, this.angle, -6*this.size);
            this.trackLeft.framerateChange -= 24;
            this.trackRight.framerateChange -= 24;
        }
    }

    //called in update when "d" is pushed
    rotateRight(){
        if(!this.destroyed){
            this.hull.angle += 3;
            this.trackLeft.framerateChange -= 10;
            this.trackRight.framerateChange += 10;
        }
    }

    //called in update when "a" is pushed
    rotateLeft(){
        if(!this.destroyed){
            this.hull.angle -= 3;
            this.trackLeft.framerateChange += 10;
            this.trackRight.framerateChange -= 10;
        }
    }
    
    //rotate gun, so that it's facing mousepointer
    calculateGunAnlge(player, posPlayer){
        if(!this.destroyed){
            let mousePosition
            if(player){
                mousePosition = this.getMouseCoords();
            } else {
                mousePosition = posPlayer;
            }
            let relativeMousePosition = {x: mousePosition.x-this.gun.x, y: mousePosition.y-this.gun.y};
            let anglePositive = Math.atan(relativeMousePosition.y / relativeMousePosition.x)*180/Math.PI + 90
            if (relativeMousePosition.x < 0){
                return anglePositive + 180;
            } else {
                return anglePositive;
            }
        } else {
            return 0
        }
    }
    
    //move sprite in a direction (angle) with a velocity pixels/frame determined by factor
    move(sprite, angle, factor){
        sprite.setVelocityX(Math.sin(angle)*factor);
        sprite.setVelocityY(-Math.cos(angle)*factor);
        //sprite.setVelocity({x: Math.sin(angle)*factor, y: -Math.cos(angle)*factor});
        //sprite.setVelocity({x: 0.1, y:0.1});
    }
    //reset the sprites position and then add offset
    addOffset(sprite, offset, factor){
        sprite.x = this.hull.x;
        sprite.x += offset.x * factor;
        sprite.y = this.hull.y;
        sprite.y -= offset.y * factor;
    }

    //called when fireing a bullet
    getFrontOfGun(factor = 1, offset = 0){
        return {x: this.gun.x + Math.sin((this.gun.angle+offset)*Math.PI/180)*200*this.size*factor, y: this.gun.y - Math.cos((this.gun.angle+offset)*Math.PI/180)*200*this.size*factor}
    }

    //reseting core parameters of tankparts to those of hull and adding the right offset
    adjustTankparts(){
        this.trackRight.angle = this.hull.angle;
        this.trackLeft.angle = this.hull.angle;

        let offset = {x: Math.sin(this.angle), y: Math.cos(this.angle)};
    
        this.addOffset(this.gun, offset, -40 * this.size);
        this.addOffset(this.trackRight, {x: offset.y, y: offset.x*-1}, 70* this.size);
        this.addOffset(this.trackLeft, {x: offset.y, y: offset.x*-1}, -70* this.size);

        this.healthbar.x = this.gun.x;
        this.healthbar.y = this.gun.y - 35;
    }

    getMouseCoords() {
        // Takes a Camera and updates this Pointer's worldX and worldY values so they are the result of a translation through the given Camera.
        this.game.input.activePointer.updateWorldPoint(this.game.cameras.main);
        let pointer = this.game.input.activePointer
        return {
          x: pointer.worldX,
          y: pointer.worldY,
        }
    }
    
    destroy(){
        this.particles.emitParticleAt(this.hull.x, this.hull.y);
        this.healthbar.destroy();
        this.hull.destroy();
        this.trackLeft.emitter.stop();
        this.trackLeft.destroy();
        this.trackRight.emitter.stop();
        this.trackRight.destroy();
        this.gun.destroy();
    
    }

    upgrade(type){
        this.type = type-1;
        this.hull.upgrade(this.type);
        this.gun.upgrade(this.type);
    }
}