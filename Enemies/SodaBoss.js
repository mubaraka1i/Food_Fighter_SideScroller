class SodaBoss extends Boss {
    /**
     * Creates an object of the SodaBoss class for level four.
     * 
     * @param {number} x top left corner x coordinate for the boss
     * @param {number} y top left corner y coordinate for the boss
     */
    constructor(x, y) {
        super(x, y, 'soda', sodaBoss.idle);
        this.health = 35; // More health
        this.maxHealth = 35;
        this.minionSpawnInterval = 180;
        this.maxMinions = 3;
    }

    /**
   * Shoots a projectile towards the player's position.
   * 
   * @param {number} playerX x coordinate to shoot towards
   * @param {number} playerY y coordiante to shoot towards
   */
    shootAtPlayer(playerX, playerY) {
        let bossCenterX = this.x + this.width / 2;
        let bossCenterY = this.y + this.height / 2;

        // Shoot bubbles in a spread pattern
        for (let i = 0; i < 2; i++) {
            // Randomized the Bosses projectile Y axis
            let randomHeightY = random(-120, 120);

            let constrainY = constrain(
                bossCenterY + randomHeightY,
                100,
                height - 120
            );
            let angle = atan2(playerY - constrainY, playerX - bossCenterX);
            angle += random(-0.4, 0.4); // Wider spread

            let dx = cos(angle) * 0.08; // Slower bubbles
            let dy = sin(angle) * 0.08;


            this.projectiles.push(new SodaBubbleProjectile(
                bossCenterX,
                constrainY,
                dx,
                dy
            ));
        }
    }

    /**
   * Spawns a minion if possible for the boss.
   */
    spawnMinions() {
        if (enemiesArray.length < this.maxMinions && !this.slidingIn) {
            let spawnX = this.x + random(-100, 100);
            let spawnY = this.y + this.height;
            enemiesArray.push(new SodaMinion(spawnX, spawnY));
        }
    }

    /**
   * Draws the boss to the screen.
   */
    draw() {
        // --- Placeholder Draw ---
        super.draw();
        /*
        if (!this.slidingIn) {
            push();
            // Body (can)
            fill('#C0C0C0'); // Silver
            rectMode(CORNER);
            rect(this.x, this.y, this.width, this.height);
            
            // Label
            fill('#E74C3C'); // Red
            rect(this.x, this.y + 20, this.width, this.height - 60);
            
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(20);
            text("SODA", this.x + this.width / 2, this.y + this.height / 2);
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
    // You can override shootAtPlayer to use a different projectile
    // For now, it will use the OriginalBoss's shooting logic
}