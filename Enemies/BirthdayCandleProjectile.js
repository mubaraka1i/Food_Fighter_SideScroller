class BirthdayCandleProjectile {
    /**
     * Creates a projectile object for the level five cake boss.
     * 
     * @param {number} x boss center x
     * @param {number} y boss center y
     * @param {number} dx distance between player top left x and boss center x
     * @param {number} dy distance between player top left y and boss center y
     */
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = 12;
        this.size = 15;
        this.flameSize = 8;
        this.flameTimer = 0;
    }

    /**
     * @returns {Set} hitbox coordinates for the projectile {x, y, r}
     */
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            r: this.size / 2
        };
    }

    /**
     * Updates the position of the projectile.
     */
    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        this.flameTimer++;
    }

    /**
     * Draws the boss projectile to the screen.
     */
    draw() {
        push();
        
        // Candle stick
        fill('#8B4513'); // Brown
        rect(this.x - 3, this.y - 10, 6, 20);
        
        // Flame with flickering effect
        let flicker = sin(this.flameTimer * 0.3) * 2;
        fill(255, 255, 0); // Yellow center
        ellipse(this.x, this.y - 15 + flicker, this.flameSize);
        
        fill(255, 165, 0); // Orange outer
        ellipse(this.x, this.y - 15 + flicker, this.flameSize - 2);
        
        pop();
    }

    /**
     * Draws the boss projectile hitbox to the screen.
     */
    drawHitbox() {
        push();
        noFill();
        stroke('red');
        strokeWeight(2);
        rectMode(CENTER);
        rect(this.x, this.y, this.size + 1, this.size + 1);
        pop();
    }
}