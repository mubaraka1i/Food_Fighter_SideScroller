class CheeseProjectile {
  /**
   * Creates a projectile of the cheese boss of level 3.
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
    this.speed = 20;
    this.size = 20;
    this.color = '#FFA500';
  }

  /**
   * @returns set of numbers {x, y, r}
   */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2
    };
  }

  /**
   * Updates the center x and y coordinates with the given trajectory.
   */
  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  /**
   * Draws a projectile to the screen as an ellipse.
   */
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

  /**
  * Draws the rectangular hitbox of the projectile.
  */
  drawHitbox() {
    push();
    noFill();
    stroke('red');
    strokeWeight(2);
    rectMode(CENTER); 
    rect(this.x, this.y, this.size+1, this.size+1);
    pop();
  }
}