class ChocolateChipProjectile {
  /**
   * Creates a projectile of the cookie boss of level 2.
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
    this.speed = 20;
    this.size = 12;
    this.color = '#5D4037';
  }

  /**
   * @returns {Set} projectile hitbox coordinate numbers {x, y, r}
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
    if (this.y <= 0 || this.y >= height) {
      this.dy *= -1;
    }
  }

  /**
   * Draws a projectile to the screen as an ellipse.
   */
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
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