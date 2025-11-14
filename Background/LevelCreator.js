class LevelCreator {
    /**
     * Creates a LevelCreator object that can be used for power up creation and enemy spawning.
     *
     * @param {number} start: x coordinate of the leftmost side of the screen
     * @param {number} end: x coordinate of the rightmost side of the screen
     * @param {number} powerUps: dictates the amount of power ups that spawn
     * @param {number} enemy1: dictates how many spawn points are created for enemy1.
     * @param {number} enemy2: dictates how many spawn points are created for enemy1.
     * @param {number} bossTrigger: player x coordinate that triggers the boss
     * @param {LevelLayout} layout: used to calculate power up collision
     * @param {number} height: height of canvas, used to calculate power up collision,
     */
    constructor(start, end, powerUps, enemy1, enemy2, bossTrigger, layout, height) {
        // start and end indicate the x coordinates where the level cannot scroll any further
        this.start = start;
        this.end = end;
        this.powerUps = powerUps;
        this.enemy1 = enemy1;
        this.enemy2 = enemy2;
        this.layout = layout;
        this.height = height;
        this.bossTrigger = bossTrigger;

        this.powerList = this.powerUpSpawn();
        this.enemy1List = this.enemy1Spawn();
        this.enemy2List = this.enemy2Spawn();

        // used to keep track of spawn points already crossed
        this.enemy1Curr = 0;
        this.enemy2Curr = 0;
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

    /**
     * Creates a list of spawn points for power ups.
     *
     * @returns list of PowerUpHitbox objects
     */
    powerUpSpawn() {
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
            if (this.layout && this.layout.getRefHeight) {
                y = this.layout.getRefHeight(x, this.height);
            } else {
                // Fallback: place on ground
                y = this.height - 50;
            }
            
            let powerUp = new PowerUpHitbox(x, y, 25, true, this.powerUpEffect());
            powerList.push(powerUp);
        }
        return powerList;
    }

    /**
     * Assigns a power up effect to a PowerUpHitbox object.
     *
     * @returns 1 for speed boost, 2 for health boost, 3 for protection boost, and 4 for damage boost.
     */
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

    /**
     * Creates a list of spawn points for ground enemies.
     * NOT CURRENTLY USED 
     * @returns list of x-coordinates for spawn points
     */
    enemy1Spawn() {
        let enemy1List = [];
        let area = this.bossTrigger - this.start; // bossTrigger used as end to account for boss fight
        let threshold = Math.floor(area / this.enemy1);
        for (let i = 1; i <= this.enemy1; i++) {
            enemy1List.push(threshold * i)
        }
        return enemy1List;
    }

    /**
     * Creates a list of spawn points for flying enemies.
     * NOT CURRENTLY USED 
     * @returns list of x-coordinates for spawn points
     */
    enemy2Spawn() {
        let enemy2List = [];
        let area = this.bossTrigger - this.start;
        let threshold = Math.floor(area / this.enemy2);
        for (let i = 1; i <= this.enemy2; i++) {
            enemy2List.push(threshold * (i + 0.5));
        }
        return enemy2List;
    }

    /**
     * Finds if the player has crossed the current threshold for ground enemies.
     * NOT CURRENTLY USED
     * @param {number} playerX 
     * @returns true if enemies should spawn, false if not
     */
    enemy1Reached(playerX) {
        if (playerX >= this.enemy1List[this.enemy1Curr] && this.ememy1Curr + 1 < this.enemy1List.length) {
            this.enemy1Curr++;
            return true;
        }
        return false;
    }

    /**
     * Finds if the player has crossed the current threshold for flying enemies.
     * NOT CURRENTLY USED
     * @param {number} playerX 
     * @returns true if enemies should spawn, false if not
     */
    enemy2Reached(playerX) {
        if (playerX >= this.enemy2List[this.enemy2Curr] && this.ememy2Curr + 1 < this.enemy2List.length) {
            this.enemy2Curr++;
            return true;
        }
        return false;
    }

    /**
     * Finds if the player has touched a power up in powerList and calls applyPowerUpEffect if reached.
     * @param {PlayerHitbox} playerHitbox 
     * @returns the effect if reached, null otherwise
     */
    powerUpReached(playerHitbox) {
        for (let i = this.powerList.length - 1; i >= 0; i--) {
            let powerUp = this.powerList[i]; // {powerUpHitbox} powerup;
            if (powerUp.checkCollision(playerHitbox)) {
                let effect = powerUp.getEffect(); // {number} effect
                this.powerList.splice(i, 1); // removes the powerUp from the list
                this.applyPowerUpEffect(effect);
                return effect;
            }
        }
        return null;
    }

    /**
     * Applies the power up effect when called by powerUpReached.
     * @param {number} effect: 1-4, dictates the effect that is applied to the player
     */
    applyPowerUpEffect(effect) {
        switch(effect) {
            case 1: // speed boost
                if (player.speed <= 5) { // prevents stacking
                    player.speed += 2;
                    setTimeout(() => { player.speed -= 2; }, 10000); // speed goes to normal after 10 seconds
                }
                break;
            case 2: // health boost
                if (health.getHealth() < 50) { // prevents over fill of HP
                    if (health.getHealth() + 10 <= 50) {
                        health.healthInc(10);
                    } else {
                        health.healthInc(50 - health.getHealth()); // sets health to 50
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

    /**
     * Draws the power ups to the screen if powerUpToDraw exists.
     * @param {number} x: center x of the powerUp
     * @param {number} y: center y of the powerUp
     * @param {number} d: radius of the powerUp
     * @param {number} effect: 1-4, boost effect to apply
     */
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
          image(powerUpToDraw, x, y, d * 2, d * 2); // img, x, y, width, height
        }
    }
}