class PlayerShoots {
  constructor() {
    this.bullets = [];
  }

  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Move bullet in world coordinates
      this.bullets[i].x += this.bullets[i].speed;
      
      // Remove bullets that go off the level 
      if (this.bullets[i].x > levelWidth || this.bullets[i].x < 0) {
        this.bullets.splice(i, 1);
        continue;
      }
    }
  }

  draw() {
    for (let bullet of this.bullets) {
      fill(255, 215, 0); // Gold color
      circle(bullet.x, bullet.y, bullet.size);
    }
  }

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
}