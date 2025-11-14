// Placeholder for Level 4 Boss
class SodaBoss extends OriginalBoss { // Inherits from OriginalBoss for now
    constructor(x, y) {
        super(x, y); // Calls the constructor of OriginalBoss
        this.health = 35; // More health
    }

    draw() {
        // --- Placeholder Draw ---
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
        
        // Draw projectiles
        for (let projectile of this.projectiles) {
            projectile.draw();
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