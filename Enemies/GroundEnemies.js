class GroundEnemies {
  constructor(x, y, spritesArray) {
    this.x = x;
    this.width = 100;
    this.height = 90;
    // Set its y-position to be on the ground
    this.y = height - this.height; 
    this.speed = 1.5 + (currentLevel * 0.3); // Speed increases with level

    // Sprite animation
    this.sprites = spritesArray;       // Array of images
    this.frameIndex = 0;               // Current frame
    this.frameSpeed = 0.15;            // Animation speed
    this.facingRight = false;          // Default facing left
  }

  // Update its position based on the player's location
  update(playerX) {
    // Move towards the player
    if (this.x < playerX) {
      this.x += this.speed;
      this.facingRight = true;
    } else if (this.x > playerX) {
      this.x -= this.speed;
      this.facingRight = false;
    }

    // Update animation frame
    this.frameIndex += this.frameSpeed;
    if (this.frameIndex >= this.sprites.length) {
      this.frameIndex = 0;
    }
  }

  // Draw itself
  draw() {
    let frame = floor(this.frameIndex);
    push();
    translate(this.x + this.width / 2, this.y + this.height / 2); // Center for rotation/flip
    imageMode(CENTER);

    // Flip sprite horizontally if facing right
    if (this.facingRight) scale(-1, 1);

    // Draw sprite with the size of the original rectangle
    image(this.sprites[frame], 0, 0, this.width, this.height);
    pop();
  }

  // Helper for collision detection
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }
}