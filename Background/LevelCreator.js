class LevelCreator {
    constructor(start, end, powerUps, enemy1, enemy2, bossTrigger, layout, height) {
        // start and end indicate the x coordinates where the level cannot scroll any further
        this.start = start;
        this.end = end;
        this.powerUps = powerUps; // amount of power ups
        this.enemy1 = enemy1; // amount of enemy type spawn points
        this.enemy2 = enemy2; // amount of enemy type spawn points
        this.layout = layout;
        this.height = height;

        this.bossTrigger = bossTrigger;
        this.reducedEnd = this.bossTrigger; // end accounts for the boss fight
        this.powerList = this.powerUpSpawn(layout);
        this.enemy1List = this.enemy1Spawn(this.start, this.reducedEnd, this.enemy1);
        this.enemy2List = this.enemy2Spawn(this.start, this.reducedEnd, this.enemy2);

        // starts at the first threshold for enemies and power ups
        this.enemy1Curr = 0;
        this.enemy2Curr = 0;
        this.powerCurr = 0;
    }
    
    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    getPowerUps() {
        return this.powerUps;
    }

    getEnemy1() {
        return this.enemy1;
    }

    getEnemy2() {
        return this.enemy2;
    }

    powerUpSpawn(layout) {
        let powerList = [];
        let possSpawns = this.powerUps * 2;
        let area = this.bossTrigger - this.start;
        let frequency = Math.floor(area / possSpawns);
        let random;
        let x;
        let y;
        for (let i = 1; i <= possSpawns; i+=2) {
            random = Math.random();
            if (random < 0.5) {
                x = frequency * i;
            } else {
                x = frequency * (i + 1);
            }
            
            // Use layout to get proper height for powerup placement
            if (layout && layout.getRefHeight) {
                y = layout.getRefHeight(x, this.height);
            } else {
                // Fallback: place on ground
                y = this.height - 50;
            }
            
            let powerUp = new PowerUpHitbox(x, y, 25, true, this.powerUpEffect());
            powerList.push(powerUp);
        }
        return powerList;
    }

    powerUpEffect() {
        let random = Math.random();
        if (random < 0.25) {
            return 1; // speed boost
        } else if (random < 0.5) {
            return 2; // health boost
        } else if (random < 0.75) {
            return 3; // protection boost
        } else {
            return 4; // damage boost
        }
    }

    enemy1Spawn(start, end, spawns) {
        let enemy1List = [];
        let area = end - start;
        let threshold = Math.floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy1List.push(threshold * i)
        }
        return enemy1List;
    }

    enemy2Spawn(start, end, spawns) {
        let enemy2List = [];
        let area = end - start;
        let threshold = Math.floor(area / spawns);
        for (let i = 1; i <= spawns; i++) {
            enemy2List.push([threshold * (i + 0.5), true]); // format: x coordinate, active
        }
        return enemy2List;
    }

    enemy1Reached(playerX) {
        if (playerX >= this.enemy1List[this.enemy1Curr] && this.ememy1Curr + 1 < this.enemy1List.length) {
            this.enemy1Curr++;
            return true;
        } else {
            return false;
        }
    }

    enemy2Reached(playerX) {
        if (playerX >= this.enemy2List[this.enemy2Curr] && this.ememy2Curr + 1 < this.enemy2List.length) {
            this.enemy2Curr++;
            return true;
        } else {
            return false;
        }
    }

    powerUpReached(playerHitbox) {
        for (let i = this.powerList.length - 1; i >= 0; i--) {
            let powerUp = this.powerList[i];
            if (powerUp.checkCollision(playerHitbox)) {
                let effect = powerUp.getEffect();
                this.powerList.splice(i, 1);
                this.applyPowerUpEffect(effect);
                return effect;
            }
        }
        return null;
    }
    // For you Sam, this method 
    applyPowerUpEffect(effect) {
        switch(effect) {
            case 1: // speed boost
                if (player.speed <= 5) { // prevents stacking
                    player.speed += 2;
                    setTimeout(() => { player.speed -= 2; }, 10000);
                }
                break;
            case 2: // health boost
                if (health.getHealth() < 50) { // prevents over fill of HP
                    if (health.getHealth() + 10 <= 50) {
                        health.healthInc(10);
                    } else {
                        health.healthInc(50 - health.getHealth());
                    }
                }
                break;
            case 3: // protection boost
                if (!player.shieldActive) {
                    player.activateShield();
                }
                break;
            case 4: // damage boost
                if (!player.damageBoostActive) {
                    player.damageBoostActive = true;
                    player.damageMultiplier = 2; // double damage
                    setTimeout(() => {
                        player.damageBoostActive = false;
                        player.damageMultiplier = 1;
                    }, 7000); // lasts 7s
                }
                break;
        }
    }

    drawPowerUp(x, y, d, effect) {
        let powerUpToDraw;
        if (effect == 1) { // speed
            powerUpToDraw = speedBoost;
        } else if (effect == 2) { // health
            powerUpToDraw = healthBoost;
        } else if (effect == 3) { // protection
            powerUpToDraw = shieldBoost;
        } else if (effect == 4) { // damage
            powerUpToDraw = damageBoost;
        }
      
        if (powerUpToDraw) {
          imageMode(CENTER);
          image(powerUpToDraw, x, y, d * 2, d * 2); // slightly larger than the old circle
        }
    }
}