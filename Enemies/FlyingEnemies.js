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
    
    // for sprite
    this.radius = this.size / 2;
    this.direction = random([-1, 1]); // -1 = left, 1 = right
    this.frame = 0;
    this.frameTimer = 0;
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
    let dx = cos(angle) * this.speed;
    let dy = sin(angle) * this.speed;

    this.x += dx;
    this.y += dy;

    // Update direction of sprite based on horizontal velocity
    if (dx < 0) {
        this.direction = -1;  // left
    } else {
        this.direction = 1;   // right
    }
  }

  /**
   * Draw the enemy to the screen.
   */
  draw() {
    fill(0, 150, 255); // Blue
    noStroke();
    circle(this.x, this.y, this.size);

    // --- Choose facing direction based on movement ---
    let facing = this.direction === -1 ? "left" : "right";

    // --- Update animation frame ---
    this.frameTimer++;
    if (this.frameTimer >= 6) {   // Change frames every 6 ticks
      this.frame = (this.frame + 1) % flyingEnemySprites[facing].length;
      this.frameTimer = 0;
    }

    // --- DRAW SPRITE ---
    let img = flyingEnemySprites[facing][this.frame];

    push();
    imageMode(CENTER);
    image(
      img,
      this.x,    // offset so it centers
      this.y,
      this.radius * 3.7,
      this.radius * 3.7
    );
    pop();
  }
}

