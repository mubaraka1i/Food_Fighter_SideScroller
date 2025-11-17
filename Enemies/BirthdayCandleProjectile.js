class BirthdayCandleProjectile {
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

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        this.flameTimer++;
    }

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

    drawHitbox() {
        push();
        noFill();
        stroke('red');
        strokeWeight(2);
        rectMode(CENTER);
        rect(this.x, this.y, this.size + 1, this.size + 1);
        pop();
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            r: this.size / 2
        };
    }
}