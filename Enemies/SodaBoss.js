class SodaBoss extends Boss { // Inherits from OriginalBoss for now
    constructor(x, y) {
        super(x, y, 'soda', sodaBoss.idle); // Calls the constructor of OriginalBoss
        this.health = 35; // More health
        this.maxHealth = 35;
        this.minionSpawnInterval = 180;
        this.maxMinions = 3;
    }

    shootAtPlayer(playerX, playerY) {
        let bossCenterX = this.x + this.width / 2;
        let bossCenterY = this.y + this.height / 2;
        
        // Shoot bubbles in a spread pattern
        for (let i = 0; i < 2; i++) {
            let angle = atan2(playerY - bossCenterY, playerX - bossCenterX);
            angle += random(-0.4, 0.4); // Wider spread
            
            let dx = cos(angle) * 0.08; // Slower bubbles
            let dy = sin(angle) * 0.08;
            
            this.projectiles.push(new SodaBubbleProjectile(
                bossCenterX,
                bossCenterY,
                dx,
                dy
            ));
        }
    }

    spawnMinions() {
        if (enemiesArray.length < this.maxMinions && !this.slidingIn) {
            let spawnX = this.x + random(-100, 100);
            let spawnY = this.y + this.height;
            enemiesArray.push(new SodaMinion(spawnX, spawnY));
        }
    }
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