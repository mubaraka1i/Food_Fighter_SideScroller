class FlyingEnemies {
  /**
   * Creates an object of the flying enemies class (Enemy 2).
   * 
   * @param {number} x center x coordinate of the enemy
   * @param {number} y center y coordinate of the enemy
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30; // Diameter of the circle
    this.speed = 1 + (currentLevel * 0.2); // Speed increases with level
  }

  /**
   * @returns {Set} enemy hitbox coordinates numbers {x, y, r}
   */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2 // Radius
    };
  }

  /**
   * Updates enemy's position based on the player position.
   * 
   * @param {number} playerHitboxX x value to move towards
   * @param {number} playerHitboxY y value to move towards
   */
  update(playerHitboxX, playerHitboxY) {
    // Calculate the angle towards the player
    let angle = atan2(playerHitboxY - this.y, playerHitboxX - this.x);
    
    // Move on that angle
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  /**
   * Draw the enemy to the screen.
   */
  draw() {
    fill(0, 150, 255); // Blue
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

