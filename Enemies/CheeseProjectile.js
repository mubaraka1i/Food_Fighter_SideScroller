class CheeseProjectile {
  constructor(x, y, dx, dy) {
    /**
     * Creates a 
     */
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 20;
    this.size = 20;
    this.color = '#FFA500';
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    
    // Draw melty cheese effect
    fill('#FF8C00');
    for (let i = 0; i < 3; i++) {
      let dripX = this.x + random(-5, 5);
      let dripY = this.y + random(-5, 5);
      ellipse(dripX, dripY, 6, 8);
    }
  }

   drawHitbox() {
    push();
    noFill();
    stroke('red');
    strokeWeight(2);
    rectMode(CENTER); 
    rect(this.x, this.y, this.size+1, this.size+1);
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