class GroundEnemies {
  constructor(x, y) {
    this.x = x;
    this.width = 100;
    this.height = 90;
    // Set its y-position to be on the ground
    this.y = height - this.height; 
    this.speed = 1.5;
  }

  // Update its position based on the player's location
  update(playerX) {
    // Move towards the player
    if (this.x < playerX) {
      this.x += this.speed;
    } else if (this.x > playerX) {
      this.x -= this.speed;
    }
  }

  // Draw itself
  draw() {
    fill(10, 160, 40); 
    noStroke();
    rect(this.x, this.y, this.width, this.height);
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