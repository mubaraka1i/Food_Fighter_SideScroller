class BossProjectile {
  /**
   * Creates a boss projectile object that shoots from a boss.
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
    this.speed = 20;
    this.size = 15;
  }

  /**
   * @returns {Set} hitbox coordinates of the boss projectile {x, y, r}
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
    let oldX = this.x;
    let oldY = this.y;

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    if (this.y <= 0 || this.y >= height) {
      this.dy *= -1;
    }
  }

  /**
   * Draws a boss projectile on the screen.
   */
  draw() {
    fill(255, 0, 255);
    ellipse(this.x, this.y, this.size);
  }


}