class SodaMinion {
  /**
   * Creates an object of the minion class for the soda boss in level four.
   * 
   * @param {number} x center x coordinate of the minion
   * @param {number} y center y coordinate of the minion
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32;
    this.speed = 2.2;
    this.health = 4;
    this.color = '#4DA6FF'; // Bright soda blue

    this.sprites = sodaBubbleSprites; // array of images
    this.frameIndex = 0;
    this.frameSpeed = 0.15; // how fast the animation cycles
    this.facingRight = false; // default facing left
  }

  /**
   * @returns {Set} minion hitbox coordinates numbers {x, y, r}
   */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2
    };
  }

  /**
   * Reduces the minion's health points by a set amount.
   * 
   * @param {number} dmg amount to reduce the minion's health by
   */
  takeDamage(dmg) {
    this.health -= dmg;
  }

  /**
   * Updates the minion's position to move towards the player.
   * @param {number} playerX x coordinate to move towards
   * @param {number} playerY y coordinate to move towards
   */
  update(playerX, playerY) {
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let angle = atan2(playerY - this.y, playerX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    // Update facing direction: left if dx < 0, right if dx >= 0
    this.facingRight = dx >= 0;
    
    // Update animation
    this.frameIndex += this.frameSpeed;
    if (this.frameIndex >= this.sprites.length) {
      this.frameIndex = 0;
    }
  }

  /**
   * Draws the minion to the screen.
   */
  draw() {
    let frame = floor(this.frameIndex);
    push();
    translate(this.x, this.y);

    // Flip horizontally if facing right (default left)
    if (this.facingRight) scale(-1, 1);

    imageMode(CENTER);
    image(this.sprites[frame], 0, 0, this.size, this.size);
    pop();
  }
}