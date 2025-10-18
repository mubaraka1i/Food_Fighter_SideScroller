class PlayerShoots {
  constructor() {
    this.bullets = [];
  }

  // Call this every frame to update bullet positions
  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Move bullet
      this.bullets[i].x += this.bullets[i].speed;
      
      // Remove bullets that go off screen
      if (this.bullets[i].x > width || this.bullets[i].x < 0) {
        this.bullets.splice(i, 1);
        continue;
      }

    }
  }

  // Call this every frame to draw bullets
  draw() {
    for (let bullet of this.bullets) {
      fill(255, 215, 0); // Gold color
      circle(bullet.x, bullet.y, bullet.size);
    }
  }

  // Call this when player shoots from sketch.js
  shoot(player) {
    const shootInfo = player.getShootInfo();
    
    this.bullets.push({
      x: shootInfo.x,
      y: shootInfo.y,
      speed: shootInfo.speed,
      size: 15,
      direction: shootInfo.direction
    });
  }

  // Get bullets for collision detection will be used by bebo
  getBullets() {
    return this.bullets;
  }
}