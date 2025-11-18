class SodaBubbleProjectile {
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

    update() {
        if (!this.popping) {
            this.x += this.dx * this.speed;
            this.y += this.dy * this.speed;
            
            // Bubbles float upward slightly
            this.dy -= 0.005;
            
            // Check if bubble should pop (random chance)
            if (random() < 0.005) {
                this.popping = true;
                this.active = false;
            }
        } else {
            this.popTimer++;
        }
    }

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

    drawHitbox() {
        if (this.active) {
            push();
            noFill();
            stroke('red');
            strokeWeight(2);
            rectMode(CENTER);
            rect(this.x, this.y, this.size + 1, this.size + 1);
            pop();
        }
    }

    getHitbox() {
        if (!this.active) return null;
        return {
            x: this.x,
            y: this.y,
            r: this.size / 2,
            active: this.active 
        };
    }

    shouldRemove() {
        return this.popTimer > 10 || 
               this.x < cameraX || this.x > cameraX + width || 
               this.y < 0 || this.y > height;
    }
}