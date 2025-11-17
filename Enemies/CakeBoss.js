// Placeholder for Level 5 Boss
class CakeBoss extends Boss { // Inherits from OriginalBoss for now
    /**
     * Creates the cake boss in level 5 and draws it. (PLACEHOLDER)
     * 
     * @param {number} x top left corner x coordinate of the boss
     * @param {number} y top left corner y coordinate of the boss
     */
    constructor(x, y) {
        super(x, y); // Calls the constructor of OriginalBoss
        this.width = 200; // Bigger!
        this.height = 200;
        this.y = height - this.height; // Adjust Y for new height
        this.health = 50; // Final boss health
        this.maxHealth = 50; 
        this.minionSpawnInterval = 150;
        this.maxMinions = 4;
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
     * Draws the cake boss onto the screen. (PLACEHOLDER)
     */
    draw() {
        // --- Placeholder Draw ---
        push();
        // Body (cake layers)
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
