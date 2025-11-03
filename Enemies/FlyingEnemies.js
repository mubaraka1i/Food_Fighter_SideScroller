class FlyingEnemies {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30; // Diameter of the circle
    this.speed = 1;
  }

  // Update its position based on the player's location
  update(playerHitboxX, playerHitboxY) {
    // Calculate the angle towards the player
    let angle = atan2(playerHitboxY - this.y, playerHitboxX - this.x);
    
    // Move on that angle
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  // Draw itself
  draw() {
    fill(0, 150, 255); // Blue
    noStroke();
    circle(this.x, this.y, this.size);
  }

  // Helper for collision detection
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2 // Radius
    };
  }
}

