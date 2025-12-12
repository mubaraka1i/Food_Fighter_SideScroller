class SodaBubbleProjectile {
    /**
     * Creates a projectile of the soda boss of level 5.
     * 
     * @param {number} x center y coordinate of the projectile
     * @param {number} y center y coordinate of the projectile
     * @param {number} dx playerX - bossCenterY
     * @param {number} dy playerY - bossCenterY
     */
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = 15;
        this.size = 20;
        this.color = '#87CEEB'; // Light blue bubble color
        this.popping = false;
        this.popTimer = 0;
        this.active = true;
        
    }

    /**
     * @returns {Set} projectile hitbox coordinate numbers {x, y, r}
     */
    getHitbox() {
        if (!this.active) return null;
        return {
            x: this.x,
            y: this.y,
            r: this.size / 2,
            active: this.active 
        };
    }

    /**
    * Updates the center x and y coordinates with the given trajectory.
    */
    update() {
    if (!this.popping) {

        // Always move using original direction
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        if (this.y <= 0 || this.y >= height) {
      this.dy *= -1;
    }

        // When bubble crosses half of the screen width it goes up
        if (this.x < width / 2) {
            this.dy -= 0.01;

            // Prevent it from becoming straight-up
            if (this.dy < -0.2) {
                this.dy = -0.2;
            }
        }

        if (random() < 0.005) {
            this.popping = true;
            this.active = false;
        }
    } else {
        this.popTimer++;
    }
}


    /**
    * Draws a projectile to the screen as an ellipse.
    */
    draw() {
        if (!this.popping) {
            push();
            fill(this.color);
            stroke(255);
            strokeWeight(2);
            ellipse(this.x, this.y, this.size);
            
            // Bubble highlight
            fill(255, 255, 255, 150);
            ellipse(this.x - this.size/4, this.y - this.size/4, this.size/3);
            pop();
        } else {
            // Pop animation
            fill(255, 100);
            ellipse(this.x, this.y, this.size + this.popTimer * 2);
        }
    }



    /**
     * @returns {boolean} true if projectile should be removed, false if not
     */
    shouldRemove() {
        return this.popTimer > 10 || 
               this.x < cameraX || this.x > cameraX + width 
    }
}