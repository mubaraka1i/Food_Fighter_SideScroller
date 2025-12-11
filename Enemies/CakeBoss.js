class CakeBoss extends Boss {
    /**
     * Creates the cake boss in level 5 and draws it.
     * 
     * @param {number} x top left corner x coordinate of the boss
     * @param {number} y top left corner y coordinate of the boss
     */
    constructor(x, y) {
        super(x, y, 'cake', cakeBoss.idle);
        this.width = 200;
        this.height = 200;
        this.y = height - this.height;
        this.health = 50;
        this.maxHealth = 50; 
        this.minionSpawnInterval = 150;
        this.maxMinions = 4;
        
        // Customize jump for CakeBoss
        this.jumpInterval = 180; // 3 seconds between jumps
        this.jumpChance = 0.005; // 0.5% chance per frame
        this.jumpHeight = 350; // Higher jump for bigger boss
        this.jumpSpeed = 0.012; // Even slower jump for dramatic effect
    }

    /**
     * Override jump trail drawing for CakeBoss
     */
    drawJumpTrail() {
        push();
        noFill();
        stroke(255, 105, 180, 100); // Pink trail for cake
        strokeWeight(6);
        
        // Draw sprinkles as trail
        for (let i = 0; i < 8; i++) {
            const trailProgress = this.jumpProgress - i * 0.03;
            if (trailProgress > 0) {
                const trailX = lerp(this.jumpStartX, this.jumpTargetX, trailProgress);
                const t = trailProgress;
                let trailY;
                
                const peak = 0.5;
                if (t < peak) {
                    const normalizedT = t / peak;
                    trailY = this.jumpStartY - this.jumpHeight * (1 - (1 - normalizedT) * (1 - normalizedT));
                } else {
                    const normalizedT = (t - peak) / (1 - peak);
                    trailY = this.jumpStartY - this.jumpHeight * (1 - normalizedT * normalizedT);
                }
                
                // Draw sprinkle at trail position
                fill(random(255), random(255), random(255), 200);
                noStroke();
                rect(trailX + this.width/2 + random(-10, 10), 
                     trailY + this.height/2 + random(-10, 10), 
                     8, 8);
            }
        }
        pop();
    }

    /**
    * Shoots a projectile at the player's coordiantes.
    * 
    * @param {number} playerX x value to shoot at
    * @param {number} playerY y value to shoot at
    */
    shootAtPlayer(playerX, playerY) {
        let bossCenterX = this.x + this.width / 2;
        let bossCenterY = this.y + this.height / 2;
        
        // Shoot birthday candles in a circular pattern
        for (let i = 0; i < 4; i++) {
            let angle = (TWO_PI / 4) * i + frameCount * 0.02; // Rotating pattern
            
            let dx = cos(angle) * 0.1;
            let dy = sin(angle) * 0.1;
            

            
            this.projectiles.push(new BirthdayCandleProjectile(
                bossCenterX,
                bossCenterY,
                dx,
                dy
            ));
        }
    }


    /**
     * Spawn cake minions
     */
    spawnMinions() {
        if (enemiesArray.length < this.maxMinions && !this.slidingIn) {
            let spawnX = this.x + random(-150, 150);
            let spawnY = this.y + this.height;
            enemiesArray.push(new CakeMinion(spawnX, spawnY));
        }
    }

    /**
     * Draws the cake boss onto the screen.
     */
    draw() {
        // --- Placeholder Draw ---
        super.draw();
        //push();
        // Body (cake layers)
        /*
        if (!this.slidingIn) {
            
            rectMode(CORNER);
            fill('#AF601A'); // Brown (cake)
            rect(this.x, this.y, this.width, this.height);
            
            fill('#E6B0AA'); // Pink (icing)
            rect(this.x, this.y, this.width, 40);
            rect(this.x, this.y + 80, this.width, 40);
            rect(this.x, this.y + 160, this.width, 40);

            // Candle
            fill(255, 0, 0);
            rect(this.x + this.width/2 - 5, this.y - 30, 10, 30);
            fill(255, 255, 0);
            ellipse(this.x + this.width/2, this.y - 30, 10, 15);
            
        }
            */
        
        // Draw projectiles
        for (let projectile of this.projectiles) {
            projectile.draw();
            projectile.drawHitbox();
        }
        
        // Draw health bar
        if (!this.slidingIn) {
            this.drawHealthBar();
        }
        pop();
    }
}
